import { Controller, Post, Req, Res } from "@nestjs/common";
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
}
