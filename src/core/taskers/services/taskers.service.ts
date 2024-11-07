import { Inject, Injectable } from "@nestjs/common";
import { ITaskersService } from "../interfaces/taskers.interface";
import { Tasker } from "src/core/firestore/collections/taskers";
import { ECountries } from "src/app/enums/countries";
import { Firestore } from "@google-cloud/firestore";

import { MailService } from '../../mail/services/mail.service';
import * as admin from 'firebase-admin';

import * as pdfLib from 'pdf-lib';
import fetch from 'node-fetch';

import { legalContractEmailTemplate } from "src/core/mail/templates/legalContractEmailTemplate";

import axios from 'axios';

@Injectable()
export class TaskersService implements ITaskersService {

    constructor(
        @Inject('COLOMBIA') private readonly COL_DB: Firestore,
        @Inject('CHILE') private readonly CL_DB: Firestore,
        private readonly mailService: MailService
    ) {
    }

    async getTaskerById(taskerId: string, country: ECountries): Promise<Tasker> {
        const database = country == ECountries.COLOMBIA ? this.COL_DB : this.CL_DB;
        const collection = Tasker.collectionName;
        const ref = await database.collection(collection).doc(taskerId);
        const docInfo = await ref.get();
        if (docInfo.exists) {
            console.log('Document data:', docInfo.data());
            return Tasker.fromJson(docInfo.data());
        } else {
            throw Error('No existe el tasker en la bd');
        }
    }

    async executePostPdfLegal(taskerId: string, country: ECountries): Promise<Buffer> {
        const db = country === ECountries.COLOMBIA ? this.COL_DB : this.CL_DB;

        // Obtener el documento del tasker
        const snapshot = await db.collection('taskers')
            .where('id', '==', taskerId)
            .get();

        if (snapshot.empty) {
            throw new Error(`No se encontraron contratos finalizados para el tasker con ID ${taskerId}`);
        }

        // Crear las variables de fecha y datos del tasker
        const fechaActual = new Date();
        const diaActual = fechaActual.getDate().toString().padStart(2, '0');
        const mesActual = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const añoActual = fechaActual.getFullYear();
        const fechaCompleta = `${diaActual}/${mesActual}/${añoActual}`;

        const docData = snapshot.docs[0].data();

        const taskerData = {
            currentDay: diaActual,
            currentMonth: mesActual,
            currentYear: añoActual,
            taskerName: `${docData.firstname} ${docData.lastname}`,
            documentNumber: docData.documentNumber,
            documentType: docData.documentType,
            phoneNumber: `${docData.phoneExtension} ${docData.phoneNumber}`,
            residenceCity: docData.city,
            categories: docData.subcategoryPrices,
        };

        const response = await fetch(`https://pub-6cc38a2ed42c45d5a69c93f0d3784bdd.r2.dev/${country}/tasker_contract.json`);
        const contractTemplate = await response.json() as { privacy: Array<{ type: string; content: any; title?: string }> };

        const pdfDoc = await pdfLib.PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontBold = await pdfDoc.embedFont(pdfLib.StandardFonts.HelveticaBold);
        const fontRegular = await pdfDoc.embedFont(pdfLib.StandardFonts.Helvetica);

        // Agregar la fecha completa en la cabecera
        page.drawText(`Fecha: ${fechaCompleta}`, { x: 50, y: height - 50, size: 12, font: fontRegular });

        let yPosition = height - 80;

        for (const section of contractTemplate.privacy) {
            if (section.type === 'title') {
                page.drawText(section.content, { x: 50, y: yPosition, size: 20, font: fontBold });
                yPosition -= 40;
            } else if (section.type === 'paragraph') {
                const text = section.content.replace('$$PARAM1$$', taskerData.taskerName);
                yPosition = this.drawWrappedText(page, text, 50, yPosition, fontRegular, 12, width - 100);
                yPosition -= 15;
            } else if (section.type === 'section') {
                page.drawText(section.title, { x: 50, y: yPosition, size: 14, font: fontBold });
                yPosition -= 20;
                for (const content of section.content) {
                    const text = content.content.replace('$$PARAM1$$', taskerData.taskerName);
                    yPosition = this.drawWrappedText(page, text, 60, yPosition, fontRegular, 12, width - 100);
                    yPosition -= 10;
                }
            }
            yPosition -= 15;
        }

        // Información general del Tasker
        const taskerInfo = [
            `Nombre del Tasker: ${taskerData.taskerName}`,
            `Número de Documento: ${taskerData.documentNumber}`,
            `Tipo de Documento: ${taskerData.documentType}`,
            `Número de Teléfono: ${taskerData.phoneNumber}`,
            `Ciudad de Residencia: ${taskerData.residenceCity}`
        ];

        for (const info of taskerInfo) {
            yPosition = this.drawWrappedText(page, info, 50, yPosition, fontRegular, 12, width - 100);
            yPosition -= 15;
        }

        // Agregar título para los precios de subcategorías
        yPosition -= 20;
        page.drawText('Categoria:', { x: 50, y: yPosition, size: 14, font: fontBold });
        yPosition -= 20;

        // Obtener nombres de las categorías
        const categoryNames = await Promise.all(taskerData.categories.map(async (category) => {
            const name = await this.nameCategory(category.categoryId, country);
            return `${name}`;
        }));

        // Dibujar cada categoría en el PDF
        for (const categoryText of categoryNames) {
            yPosition = this.drawWrappedText(page, categoryText, 50, yPosition, fontRegular, 12, width - 100);
            yPosition -= 15;
        }

        const pdfBytes = await pdfDoc.save();
        const pdfBuffer = Buffer.from(pdfBytes);

        // Configura el email
        const emailDetails = {
            to: docData.email,
            subject: 'Contrato Legal',
            text: 'Adjunto encontrarás el contrato legal en formato PDF.',
            html: legalContractEmailTemplate(docData),
        };

        // Envía el correo con el PDF adjunto
        await this.mailService.sendEmail(emailDetails, [
            { filename: `contrato-${taskerData.taskerName}-${taskerData.documentNumber}.pdf`, content: pdfBuffer },
        ]);

        return pdfBuffer;
    }

    async nameCategory(id: string, country: ECountries): Promise<string> {
        const db = country === ECountries.COLOMBIA ? this.COL_DB : this.CL_DB;

        const snapshot = await db.collection('categories').where('id', '==', id).get();
        if (snapshot.empty) {
            throw new Error(`No se encontró la categoría con ID ${id}`);
        }

        const docData = snapshot.docs[0].data();
        return docData.name;
    }

    async finish_procedure_registration(taskerId: string, country: ECountries): Promise<object> {
        const db = country === ECountries.COLOMBIA ? this.COL_DB : this.CL_DB;

        const snapshot = await db.collection('taskers').where('id', '==', taskerId).get();

        if (snapshot.empty) {
            throw new Error(`No se encontraron contratos finalizados para el tasker con ID ${taskerId}`);
        }

        const docData = snapshot.docs[0].data();

        // Enviar la notificación push
        const accessToken = (await admin.credential.applicationDefault().getAccessToken()).access_token;
        const message = {
            message: {
                notification: {
                    title: 'Finaliza tu registro 🚨',
                    body: `Recuerda culminar tu proceso de registro como Tasker, estás a un paso de generar ingresos adicionales 💵`,
                },
                token: docData.deviceId,
            }
        };

        try {
            await axios.post(
                `https://fcm.googleapis.com/v1/projects/${process.env.PROJECT_ID_NAME}/messages:send`,
                message,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Notificación enviada correctamente');
        } catch (error) {
            console.error('Error al enviar la notificación:', error.response?.data || error.message);
            throw new Error('Error al enviar la notificación');
        }

        // Configuración y envío del correo
        const emailDetails = {
            to: docData.email,
            subject: 'Recordatorio terminar proceso - Tasky',
            text: `Hola ${docData.firstname} ${docData.lastname}, estas a punto de finalizar tu proceso de registro en Tasky 🐙, ingresa a la APP para finalizarlo!`,
        };

        try {
            await this.mailService.sendEmail(emailDetails);
            console.log('Correo enviado correctamente');
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            throw new Error('Error al enviar el correo');
        }

        return { result: true, msg: 'Correo y notificación enviados correctamente' };
    }

    private drawWrappedText(
        page: pdfLib.PDFPage,
        text: string,
        x: number,
        y: number,
        font: pdfLib.PDFFont,
        fontSize: number,
        maxWidth: number
    ): number {
        const words = text.split(' ');
        let line = '';
        for (const word of words) {
            const testLine = line + word + ' ';
            const textWidth = font.widthOfTextAtSize(testLine, fontSize);
            if (textWidth > maxWidth) {
                page.drawText(line, { x, y, size: fontSize, font });
                line = word + ' ';
                y -= fontSize + 4; // Espaciado entre líneas
            } else {
                line = testLine;
            }
        }
        if (line) {
            page.drawText(line, { x, y, size: fontSize, font });
            y -= fontSize + 4;
        }
        return y;
    }

}
