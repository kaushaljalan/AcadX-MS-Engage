import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { Class, ClassSchema } from './class.schema';
import { PreferredSlotService } from '../preferred-slot/preferred-slot.service';
// import { PreferredSlot } from '../preferred-slot/preferred-slot.schema';
import { BookedSlotModule } from '../booked-slot/booked-slot.module';
import { PreferredSlotModule } from '../preferred-slot/preferred-slot.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),PreferredSlotModule,  BookedSlotModule, UserModule],
  controllers: [ClassController],
  providers: [ClassService]
})
export class ClassModule {}
