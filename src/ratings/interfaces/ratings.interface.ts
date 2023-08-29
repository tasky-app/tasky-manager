export interface IRatingsService {
    saveWorkerRating(contractId: number, ratingValue: number): Promise<void>;
}