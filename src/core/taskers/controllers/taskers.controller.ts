import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { HeadersConstants } from "src/app/constants/headers";
import { TaskersService } from "../services/taskers.service";
import { Request, Response } from 'express';
import { ECountries } from "src/app/enums/countries";

@Controller("tasker")
export class TaskerController {

    constructor(private readonly taskersService: TaskersService) { }

    @Post('pdf-legal')
    async executePostPdfLegal(@Req() request: Request, @Res() res: Response) {
        const taskerId = request.headers[HeadersConstants.TASKER_ID] as string;
        const countryHeader = request.headers[HeadersConstants.COUNTRY];
        const country = Array.isArray(countryHeader) ? countryHeader[0] : countryHeader;

        if (!Object.values(ECountries).includes(country as ECountries)) {
            throw new Error(`Invalid country value: ${country}`);
        }

        const pdfBuffer = await this.taskersService.executePostPdfLegal(taskerId, country as ECountries);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="contract.pdf"',
            'Content-Length': pdfBuffer.length,
        });

        res.end(pdfBuffer);
    }

    @Post('finish-procedure-registration')
    async finish_procedure_registration(@Req() request: Request, @Res() res: Response) {
        const taskerId = request.headers[HeadersConstants.TASKER_ID] as string;
        const countryHeader = request.headers[HeadersConstants.COUNTRY];
        const country = Array.isArray(countryHeader) ? countryHeader[0] : countryHeader;

        if (!Object.values(ECountries).includes(country as ECountries)) {
            return res.status(400).json({ error: `Invalid country value: ${country}` });
        }

        try {
            const result = await this.taskersService.finish_procedure_registration(taskerId, country as ECountries);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error en la operación:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    @Get('minimum-hourly-rate')
    async getMinimumHourlyRate(@Req() request: Request, @Res() res: Response) {
        const countryHeader = request.headers[HeadersConstants.COUNTRY];
        const country = Array.isArray(countryHeader) ? countryHeader[0] : countryHeader;

        if (!Object.values(ECountries).includes(country as ECountries)) {
            return res.status(400).json({ error: `Invalid country value: ${country}` });
        }

        try {
            const rate = this.taskersService.getMinimumHourlyRate(country as ECountries);
            res.status(200).json({ rate });
        } catch (error) {
            console.error('Error al calcular la tarifa mínima por hora:', error.message);
            res.status(500).json({ error: error.message });
        }
    }



}