import { Test, TestingModule } from '@nestjs/testing';
import { PreferredSlotController } from './preferred-slot.controller';
import { PreferredSlotService } from './preferred-slot.service';

describe('PreferredSlotController', () => {
  let controller: PreferredSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferredSlotController],
      providers: [PreferredSlotService],
    }).compile();

    controller = module.get<PreferredSlotController>(PreferredSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
