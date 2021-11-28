import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookedSlotService } from './booked-slot.service';
import { BookedSlotController } from './booked-slot.controller';
import { BookedSlot, BookedSlotSchema } from './booked-slot.schema';

const ModuleDefinition = MongooseModule.forFeature([{ name: BookedSlot.name, schema: BookedSlotSchema }])
@Module({
  imports: [ModuleDefinition],
  controllers: [BookedSlotController],
  providers: [BookedSlotService],
  exports: [BookedSlotService],
})
export class BookedSlotModule {}
