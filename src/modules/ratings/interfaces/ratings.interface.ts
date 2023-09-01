import { SaveRatingDto } from "../dto/saveRatingDto";

export interface IRatingsService {
    saveWorkerRating(request: SaveRatingDto): Promise<void>;
    getWorkerRating(workerId: number): Promise<any>;
}