import { Injectable } from '@nestjs/common';
import { CreatePreferredSlotDto } from './dto/create-preferred-slot.dto';
import { UpdatePreferredSlotDto } from './dto/update-preferred-slot.dto';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import { PreferredSlotDocument, PreferredSlot } from './preferred-slot.schema';
import {Class} from '../class/class.schema';

@Injectable()
export class PreferredSlotService {
  constructor(@InjectModel(PreferredSlot.name) private PreferredSlot: Model<PreferredSlotDocument>) {}
  
  create(createPreferredSlotDto: CreatePreferredSlotDto) {
    return this.PreferredSlot.create(createPreferredSlotDto);
  }

  findAll(user: string | any) {
    return this.PreferredSlot.find({ user }).lean();
  }
  
  find(query: any) {
    return this.PreferredSlot.find(query);
  }
  
  async getAvailableStudentsForClass(classRecord: Class, users: string[]) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    console.log({
      user: { $nin: users },
      department: classRecord.department,
      slot: classRecord.slot,
      weekDay: days[new Date(classRecord.date).getDay()]
    })
    return (await this.PreferredSlot.find({
      user: { $nin: users },
      department: classRecord.department,
      slot: classRecord.slot,
      weekDay: days[new Date(classRecord.date).getDay()]
    })).map(u => u.user)
  }
  update(id: string, updatePreferredSlotDto: UpdatePreferredSlotDto) {
    return this.PreferredSlot.findByIdAndUpdate(id, updatePreferredSlotDto, { new: true, lean: true});
  }

  remove(id: string) {
    return this.PreferredSlot.findByIdAndDelete(id);
  }
}
