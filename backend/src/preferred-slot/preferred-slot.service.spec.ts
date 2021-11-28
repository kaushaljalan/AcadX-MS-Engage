import { Test, TestingModule } from '@nestjs/testing';
import { PreferredSlotService } from './preferred-slot.service';

describe('PreferredSlotService', () => {
  let service: PreferredSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreferredSlotService],
    }).compile();

    service = module.get<PreferredSlotService>(PreferredSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
