import { Body, Controller, Headers, Logger, Post } from "@nestjs/common";
import { FeedbackService } from "../services/feedback.service";

@Controller("feedback")
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) { }

    private readonly logger = new Logger(FeedbackController.name);

    @Post()
    async saveFeedback(@Headers() headers, @Body() body) {
        this.logger.log(`CEL: [${headers.cellphone}] INICIA GUARDADO DEL COMENTARIO`)
        await this.feedbackService.saveFeedback(body.comment, headers.cellphone);
        this.logger.log(`CEL: [${headers.cellphone}] FINALIZA GUARDADO DEL COMENTARIO`)
    }
}