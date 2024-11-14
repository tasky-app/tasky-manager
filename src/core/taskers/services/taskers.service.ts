import { Inject, Injectable } from "@nestjs/common";
import { ITaskersService } from "../interfaces/taskers.interface";
import { Tasker } from "src/core/firestore/collections/taskers";
import { ECountries } from "src/app/enums/countries";
import { Firestore } from "@google-cloud/firestore";
import { Logger } from '@nestjs/common';
import { MailService } from '../../mail/services/mail.service';

import * as admin from 'firebase-admin';
import * as pdfLib from 'pdf-lib';
import * as fs from 'fs';


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

    getMinimumHourlyRate(country: ECountries): number {
        let minimumHourlyWage;

        if (country === ECountries.COLOMBIA) {
            minimumHourlyWage = process.env.MINIMUM_HOURLY_CO;
        } else if (country === ECountries.CHILE) {
            minimumHourlyWage = process.env.MINIMUM_HOURLY_CL
        } else {
            throw new Error('País no soportado');
        }

        if (!minimumHourlyWage) {
            throw new Error(`El salario mínimo por hora no está configurado para el país ${country}`);
        }

        const rateWithMarkup = minimumHourlyWage * 1.3;
        Logger.log(`El valor mínimo por hora para ${country} con el 30% adicional es: ${rateWithMarkup}`, 'getMinimumHourlyRate');
        return rateWithMarkup;
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

    async finish_procedure_registration(taskerId: string, country: ECountries): Promise<object> {
        const db = country === ECountries.COLOMBIA ? this.COL_DB : this.CL_DB;
        Logger.log(`Iniciando procedimiento de finalización de registro para el tasker con ID ${taskerId} en el país ${country}`, 'finish_procedure_registration');

        try {
            const snapshot = await db.collection('taskers').where('id', '==', taskerId).get();
            Logger.log(`Consulta realizada en la base de datos para tasker con ID ${taskerId}`, 'finish_procedure_registration');

            if (snapshot.empty) {
                Logger.warn(`No se encontraron registros para el tasker con ID ${taskerId}`, 'finish_procedure_registration');
                throw new Error(`No se encontraron registros para el tasker con ID ${taskerId}`);
            }

            const docData = snapshot.docs[0].data();
            Logger.debug(`Datos del tasker obtenidos: ${JSON.stringify(docData)}`, 'finish_procedure_registration');

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
                Logger.log('Notificación push enviada correctamente', 'finish_procedure_registration');
            } catch (error) {
                Logger.error('Error al enviar la notificación push', error.response?.data || error.message, 'finish_procedure_registration');
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
                Logger.log('Correo enviado correctamente', 'finish_procedure_registration');
            } catch (error) {
                Logger.error('Error al enviar el correo', error, 'finish_procedure_registration');
                throw new Error('Error al enviar el correo');
            }

            Logger.log('Procedimiento de finalización de registro completado correctamente', 'finish_procedure_registration');
            return { result: true, msg: 'Correo y notificación enviados correctamente' };

        } catch (error) {
            Logger.error(`Error en el procedimiento de finalización de registro para el tasker con ID ${taskerId}: ${error.message}`, error.stack, 'finish_procedure_registration');
            throw new Error('Error en el procedimiento de finalización de registro');
        }
    }




    // Crear contrato Legal

    async nameCategory(id: string, country: ECountries): Promise<string> {
        const db = country === ECountries.COLOMBIA ? this.COL_DB : this.CL_DB;

        const snapshot = await db.collection('categories').where('id', '==', id).get();
        if (snapshot.empty) {
            throw new Error(`No se encontró la categoría con ID ${id}`);
        }

        const docData = snapshot.docs[0].data();
        return docData.name;
    }

    async executePostPdfLegal(taskerId: string, country: ECountries): Promise<Buffer> {
        const db = country === ECountries.COLOMBIA ? this.COL_DB : this.CL_DB;
        Logger.log(`Iniciando generación de PDF legal para el tasker con ID ${taskerId} en el país ${country}`, 'executePostPdfLegal');

        try {
            const snapshot = await db.collection('taskers').where('id', '==', taskerId).get();

            if (snapshot.empty) {
                Logger.warn(`No se encontró el tasker con ID ${taskerId}`, 'executePostPdfLegal');
                throw new Error(`No se encontró el tasker con ID ${taskerId}`);
            }

            const fechaActual = new Date();
            const diaActual = fechaActual.getDate().toString().padStart(2, '0');
            const mesActual = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
            const añoActual = fechaActual.getFullYear();

            const docData = snapshot.docs[0].data();

            const categoryId = docData.subcategoryPrices[0].categoryId;
            const categoryName = await this.nameCategory(categoryId, country);

            const taskerData = {
                diaActual: diaActual,
                mesActual: mesActual,
                añoActual: añoActual,
                nombreTasker: `${docData.firstname} ${docData.lastname}`,
                numeroDocumento: docData.documentNumber,
                tipoDocumento: docData.documentType,
                numeroTelefono: `${docData.phoneExtension} ${docData.phoneNumber}`,
                ciudadDeResidencia: docData.city,
                categoria: categoryName,
            };

            const response = await axios.get(`https://pub-6cc38a2ed42c45d5a69c93f0d3784bdd.r2.dev/${country}/tasker_contract.json`);
            const contractTemplate = response.data;
            Logger.log('Plantilla de contrato obtenida correctamente', 'executePostPdfLegal');

            const pdfBuffer = await this.generatePDF(contractTemplate, taskerData);

            const filename = `contrato-${taskerData.nombreTasker}-${taskerData.numeroDocumento}.pdf`;


            const emailDetails = {
                to: docData.email,
                subject: 'Contrato Legal',
                text: 'Adjunto encontrarás el contrato legal en formato PDF.',
                html: legalContractEmailTemplate(docData),
            };

            await this.mailService.sendEmail(emailDetails, [{ filename: filename, content: pdfBuffer }]);

            // Enviar la notificación push
            const accessToken = (await admin.credential.applicationDefault().getAccessToken()).access_token;
            const message = {
                message: {
                    notification: {
                        title: 'Hemos verificado tu cuenta 🥳',
                        body: `Te damos la bienvenida a Tasky 😍🐙`,
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
                Logger.log('Notificación push enviada correctamente', 'finish_procedure_registration');
            } catch (error) {
                Logger.error('Error al enviar la notificación push', error.response?.data || error.message, 'finish_procedure_registration');
                throw new Error('Error al enviar la notificación');
            }


            Logger.log('Correo enviado con PDF adjunto', 'executePostPdfLegal');
            return pdfBuffer;
        } catch (error) {
            Logger.error(`Error en la generación del PDF legal para el tasker con ID ${taskerId}: ${error.message}`, error.stack, 'executePostPdfLegal');
            throw new Error('Error en la generación del PDF legal');
        }
    }

    async generatePDF(data, taskerData) {
        const pdfDoc = await pdfLib.PDFDocument.create();
        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        const fontRegular = await pdfDoc.embedFont(pdfLib.StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(pdfLib.StandardFonts.HelveticaBold);

        let yPosition = height - 50;

        page.drawText(`Fecha: ${taskerData.diaActual}/${taskerData.mesActual}/${taskerData.añoActual}`, { x: 50, y: yPosition, size: 12, font: fontRegular });
        yPosition -= 30;

        // Procesa cada sección en el JSON
        for (const section of data.privacy) {
            if (section.type === 'title') {
                const titleContent = this.replaceVariables(section.content, taskerData);
                [page, yPosition] = this.drawTextWithPagination(pdfDoc, page, titleContent, 50, yPosition, fontBold, fontRegular, 18, width - 100);
            }
            else if (section.type === 'paragraph') {
                const content = this.replaceVariables(section.content, taskerData);
                [page, yPosition] = this.drawTextWithPagination(pdfDoc, page, content, 50, yPosition, fontRegular, fontBold, 12, width - 100);
            } else if (section.type === 'section') {
                yPosition -= 25;
                const sectionTitle = this.replaceVariables(section.title, taskerData);
                [page, yPosition] = this.drawTextWithPagination(pdfDoc, page, sectionTitle, 50, yPosition, fontBold, fontRegular, 14, width - 100);
                for (const paragraph of section.content) {
                    const content = this.replaceVariables(paragraph.content, taskerData);
                    [page, yPosition] = this.drawTextWithPagination(pdfDoc, page, content, 50, yPosition, fontRegular, fontBold, 12, width - 100);
                }
            }
        }

        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }

    private replaceVariables(text: string, taskerData: any): string {

        const monthNames = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];

        const dataWithMonthName = {
            ...taskerData,
            mesActual: monthNames[parseInt(taskerData.mesActual, 10) - 1]
        };

        return text.replace(/\$\{([a-zA-Z_ñÑáéíóúÁÉÍÓÚ]+)\}/g, (_, key) => dataWithMonthName[key] || '');
    }

    private drawTextWithPagination(
        pdfDoc: pdfLib.PDFDocument,
        page: pdfLib.PDFPage,
        text: string,
        x: number,
        y: number,
        fontRegular: pdfLib.PDFFont,
        fontBold: pdfLib.PDFFont,
        fontSize: number,
        maxWidth: number
    ): [pdfLib.PDFPage, number] {
        const lineHeight = fontSize + 4;
        const bottomMargin = 50;
        let line = '';
        let currentFont = fontRegular;

        // Divide el texto en segmentos para detectar partes en negrita
        const segments = text.split(/(\*\*[^*]+\*\*)/);  // Divide el texto en segmentos, incluyendo los delimitadores **

        for (const segment of segments) {
            const isBold = segment.startsWith('**') && segment.endsWith('**');
            const font = isBold ? fontBold : fontRegular;
            const content = isBold ? segment.slice(2, -2) : segment;  // Elimina los delimitadores **

            // Log para verificar si el segmento está en negrita y el contenido
            console.log("isBold:", isBold, "| content:", content);

            const words = content.split(' ');

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const wordWithSpace = i < words.length - 1 ? word + ' ' : word;
                const testLine = line + wordWithSpace;

                const textWidth = font.widthOfTextAtSize(testLine, fontSize);

                if (textWidth > maxWidth) {
                    if (y <= bottomMargin) {
                        page = pdfDoc.addPage();
                        y = page.getSize().height - 50;
                    }
                    page.drawText(line, { x, y, size: fontSize, font: currentFont });
                    line = wordWithSpace;
                    y -= lineHeight;
                } else {
                    line = testLine;
                }
            }

            currentFont = font;
        }

        if (line) {
            if (y <= bottomMargin) {
                page = pdfDoc.addPage();
                y = page.getSize().height - 50;
            }
            page.drawText(line, { x, y, size: fontSize, font: currentFont });
            y -= lineHeight;
        }

        return [page, y];
    }




}
