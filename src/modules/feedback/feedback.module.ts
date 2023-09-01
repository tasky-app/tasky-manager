import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Feedback } from "src/database/entities/Feedback";
import { FeedbackService } from "./services/feedback.service";
import { FeedbackController } from "./controllers/feedback.controller";
import { ClientService } from "../client/services/client.service";
import { Client } from "src/database/entities/Client";

@Module({
    imports: [TypeOrmModule.forFeature([Feedback, Client])],
    providers: [FeedbackService, ClientService],
    controllers: [FeedbackController]
})

export class FeedbackModule {}