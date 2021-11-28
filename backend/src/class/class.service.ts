import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import {Class, ClassDocument} from './class.schema';
import {Model} from 'mongoose';

@Injectable()
export class ClassService {
  constructor(@InjectModel(Class.name) private Class: Model<ClassDocument>) {}
  
  async create(createClassDto: CreateClassDto): Promise<Class> {
    const newClass = new this.Class(createClassDto)
    return newClass.save();
  }

  findAll(params) {
    return this.Class.find(params);
  }
  findAllBookedSlots (query) {
    return this.Class.find(query).select('slot').lean()
  }
  findOne(id: string) {
    return this.Class.findById(id).lean();
  }

  update(id: string, updateClassDto: UpdateClassDto) {
    return this.Class.findByIdAndUpdate(id, updateClassDto);
  }

}
