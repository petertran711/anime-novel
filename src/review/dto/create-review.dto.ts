import {IsOptional} from "class-validator";

export class CreateReviewDto {
    @IsOptional()
    name: string;

    @IsOptional()
    review: string;

    @IsOptional()
    image?: string;
}
