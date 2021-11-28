import { Injectable } from '@nestjs/common';
import { CreateBookedSlotDto } from './dto/create-booked-slot.dto';
import { UpdateBookedSlotDto } from './dto/update-booked-slot.dto';
import { BookedSlotDocument, BookedSlot } from './booked-slot.schema';
import { ClassDocument, Class } from '../class/class.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BookedSlotService {
  constructor(@InjectModel(BookedSlot.name) private BookedSlot: Model<BookedSlotDocument>) {}
  create(createBookedSlotDto: CreateBookedSlotDto) {
    return 'This action adds a new bookedSlot';
  }

  findAll(query: any) {
    return this.BookedSlot.find(query).populate('class')
  }
  
  async getUnavailableUsersForClass(scheduledClass: Class) {
    const { modeOfDelivery, slot, date, department } = scheduledClass;
    const occupiedSlots: BookedSlotDocument[] = await this.findAll({
      modeOfDelivery,
      slot,
      date,
      department
    }).select('user')
    return occupiedSlots.map(oc => oc.user);
  }
  async bookClasses(classRecord: Class, availableUsers: string[]) {
    const {   modeOfDelivery,
      slot,
      date,
      department,
      // @ts-ignore
      _id,
    } = classRecord;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
    return this.BookedSlot.insertMany(availableUsers.map(user => ({
      user,
      weekDay: days[new Date(classRecord.date).getDay()],
      modeOfDelivery,
      slot,
      date,
      department,
      class: _id,
    })))
  }
  findOne(id: string) {
    return `This action returns a #${id} bookedSlot`;
  }

  update(id: number, updateBookedSlotDto: UpdateBookedSlotDto) {
    return `This action updates a #${id} bookedSlot`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookedSlot`;
  }
}
