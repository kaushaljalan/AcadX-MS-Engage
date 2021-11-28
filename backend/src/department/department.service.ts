import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import { DepartmentDocument, Department } from './department.schema';

@Injectable()
export class DepartmentService {
  constructor(@InjectModel(Department.name) private Department: Model<DepartmentDocument>) {
  }
  create(createDepartmentDto: CreateDepartmentDto) {
    return new this.Department(createDepartmentDto).save();
  }

  findAll() {
    return this.Department.find().lean();
  }

  findOne(id: string) {
    return this.Department.findById(id).lean();
  }

  update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return this.Department.findByIdAndUpdate(id, updateDepartmentDto, { new: true }).lean();
  }


}
