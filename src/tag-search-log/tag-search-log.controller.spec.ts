import { Test, TestingModule } from '@nestjs/testing';
import { TagSearchLogController } from './tag-search-log.controller';
import { TagSearchLogService } from './tag-search-log.service';

describe('TagSearchLogController', () => {
  let controller: TagSearchLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagSearchLogController],
      providers: [TagSearchLogService],
    }).compile();

    controller = module.get<TagSearchLogController>(TagSearchLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
