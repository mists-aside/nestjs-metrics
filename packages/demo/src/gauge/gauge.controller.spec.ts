import { Test, TestingModule } from '@nestjs/testing';
import { GaugeController } from './gauge.controller';

describe('GaugeController', () => {
  let controller: GaugeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GaugeController],
    }).compile();

    controller = module.get<GaugeController>(GaugeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
