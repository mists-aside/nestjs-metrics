import { Test, TestingModule } from '@nestjs/testing';
import { HistogramController } from './histogram.controller';

describe('HistogramController', () => {
  let controller: HistogramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistogramController],
    }).compile();

    controller = module.get<HistogramController>(HistogramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
