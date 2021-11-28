import { PartialType } from '@nestjs/mapped-types';
import { CreateBookedSlotDto } from './create-booked-slot.dto';

export class UpdateBookedSlotDto extends PartialType(CreateBookedSlotDto) {}
