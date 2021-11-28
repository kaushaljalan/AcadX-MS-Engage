import { Test, TestingModule } from '@nestjs/testing';
import { BookedSlotService } from './booked-slot.service';

describe('BookedSlotService', () => {
  let service: BookedSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookedSlotService],
    }).compile();

    service = module.get<BookedSlotService>(BookedSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
