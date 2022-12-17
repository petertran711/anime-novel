import { PartialType } from '@nestjs/swagger';
import { CreateGoogleDto } from './create-google.dto';
import {IsOptional} from "class-validator";

export class UpdateGoogleDto extends PartialType(CreateGoogleDto) {}
