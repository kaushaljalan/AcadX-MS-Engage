import { Test, TestingModule } from '@nestjs/testing';
import { BookedSlotController } from './booked-slot.controller';
import { BookedSlotService } from './booked-slot.service';

describe('BookedSlotController', () => {
  let controller: BookedSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookedSlotController],
      providers: [BookedSlotService],
    }).compile();

    controller = module.get<BookedSlotController>(BookedSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
