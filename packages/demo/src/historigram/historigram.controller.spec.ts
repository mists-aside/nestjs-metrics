import { Test, TestingModule } from '@nestjs/testing';
import { HistorigramController } from './historigram.controller';

describe('HistorigramController', () => {
  let controller: HistorigramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorigramController],
    }).compile();

    controller = module.get<HistorigramController>(HistorigramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
