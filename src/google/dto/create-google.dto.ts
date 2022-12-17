import {IsOptional} from "class-validator";

export class CreateGoogleDto {
    @IsOptional()
    domain: string;

    @IsOptional()
    codeAnalytics: string;

    @IsOptional()
    codeAds?: string;
}
