export interface IFeedbackService {
    saveFeedback(comment: string, authorId: number): Promise<void>;
}