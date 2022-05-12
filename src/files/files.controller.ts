import { Controller, Get, Param, Post, Query, Res, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { ApiFileFields } from 'src/decorators/api-file-fields.decorator';
import { ApiFile } from 'src/decorators/api-file.decorator';
import { ApiFiles } from 'src/decorators/api-files.decorator';
import { v4 as uuidv4 } from 'uuid';
import { fileMimetypeFilter } from './file-mimetype-filter';
import { FilesService } from './files.service';
import path = require('path');

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  // https://notiz.uat/blog/type-safe-file-uploads

  @Post('upload')
  @ApiFile('files', true, {
    storage: diskStorage({
      destination: './uploads/defaults',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
    fileFilter: fileMimetypeFilter('image'),
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { containter: file.destination.substring(10), filename: file.filename };
  }

  @Post('uploads')
  @ApiFiles('files', true, 10, {
    storage: diskStorage({
      destination: './uploads/defaults',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
  })
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    let data = files.map((item) => {
      return { containter: item.destination.substring(10), filename: item.filename };
    });
    return data;
  }

  // @Post('uploadFields')
  // @ApiFileFields([
  //   { name: 'avatar', maxCount: 1, required: true },
  //   { name: 'background', maxCount: 1 },
  // ])
  // uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
  //   console.log(files);
  // }

  // @Post('avatar')
  // @ApiImageFile('avatar', true)
  // uploadAvatar(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }

  // @Post('document')
  // @ApiPdfFile('document', true)
  // uploadDocument(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }

  @Get('/download/:container')
  getFile(@Param('container') container: string, @Res() response: Response, @Query('file') file: string) {    
    return response.sendFile(file, { root: `./uploads/${container}` });
  }

  @Post('/upload/courses')
  @ApiFile('files', true, {
    storage: diskStorage({
      destination: './uploads/courses',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
  })
  uploadSources(@UploadedFile() file: Express.Multer.File) {
    return { containter: file.destination.substring(10), filename: file.filename };
  }

  @Post('/upload/avatars')
  @ApiFile('files', true, {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
  })
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return { containter: file.destination.substring(10), filename: file.filename };
  }

  @Post('/uploads/courses')
  @ApiFileFields(
    [
      { name: 'thumbnail', maxCount: 1, required: true },
      { name: 'attack', maxCount: 1, required: false },
    ],
    {
      storage: diskStorage({
        destination: './uploads/courses',
        filename: (req, file, cb) => {
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    },
  )
  uploadsSources(@UploadedFiles() files: { thumbnail: Express.Multer.File[]; attack: Express.Multer.File[] }) {
    let data: { thumbnail?: string; attack?: string } = {};
    if (files.thumbnail && files.thumbnail.length) {
      data.thumbnail = files.thumbnail[0].filename;
    }

    if (files.attack && files.attack.length) {
      data.attack = files.attack[0].filename;
    }
    return data;
  }

  @Post('/upload/lessons')
  @ApiFile('files', true, {
    storage: diskStorage({
      destination: './uploads/lessons',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
  })
  uploadLessons(@UploadedFile() file: Express.Multer.File) {
    return { containter: file.destination.substring(10), filename: file.filename };
  }

  @Post('/uploads/lessons')
  @ApiFileFields(
    [
      { name: 'videoPreview', maxCount: 1, required: false },
      { name: 'uploadMedia', maxCount: 1, required: false },
    ],
    {
      storage: diskStorage({
        destination: './uploads/lessons',
        filename: (req, file, cb) => {
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    },
  )
  uploadsLesson(@UploadedFiles() files: { videoPreview: Express.Multer.File[]; uploadMedia: Express.Multer.File[] }) {
    let data: { videoPreview?: string; uploadMedia?: string } = {};
    if (files.videoPreview && files.videoPreview.length) {
      data.videoPreview = files.videoPreview[0].filename;
    }

    if (files.uploadMedia && files.uploadMedia.length) {
      data.uploadMedia = files.uploadMedia[0].filename;
    }
    return data;
  }
}
