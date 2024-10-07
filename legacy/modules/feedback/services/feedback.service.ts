import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { IFeedbackService } from "../interfaces/feedback.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Feedback } from "legacy/database/entities/Feedback";
import { Client } from "legacy/database/entities/Client";
import { ClientService } from "legacy/modules/client/services/client.service";

@Injectable()
export class FeedbackService implements IFeedbackService {
    private readonly logger = new Logger(FeedbackService.name);

    constructor(
        @InjectRepository(Feedback) private readonly feedbackRepository: Repository<Feedback>,
        private readonly clientService: ClientService,
    ) { }

    async saveFeedback(comment: string, authorId: number): Promise<void> {
        this.logger.log(`CEL: [${authorId}] inicia guardado del comentario`)
        const client = await this.clientService.getClientInfo(authorId.toString());

        const feedback: Feedback = new Feedback();
        feedback.comment = comment;
        feedback.client = client;
        return this.feedbackRepository.save(feedback).then(() => {
            this.logger.log(`CEL: [${authorId}] finaliza guardado del comentario`)
        }).catch(err => {
            this.logger.error(err);
            throw new InternalServerErrorException("Error al guardar el comentario");
        });
    }
} 