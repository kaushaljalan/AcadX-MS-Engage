import { Module } from '@nestjs/common';
import { PreferredSlotService } from './preferred-slot.service';
import { PreferredSlotController } from './preferred-slot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PreferredSlot, PreferredSlotSchema } from './preferred-slot.schema'

const ModuleDef = MongooseModule.forFeature([{ name: PreferredSlot.name, schema: PreferredSlotSchema }]);
@Module({
  imports: [ModuleDef],
  controllers: [PreferredSlotController],
  providers: [PreferredSlotService],
  exports: [PreferredSlotService]
})
export class PreferredSlotModule {}
