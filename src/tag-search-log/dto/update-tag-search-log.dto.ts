import { PartialType } from '@nestjs/swagger';
import { CreateTagSearchLogDto } from './create-tag-search-log.dto';

export class UpdateTagSearchLogDto extends PartialType(CreateTagSearchLogDto) {}
