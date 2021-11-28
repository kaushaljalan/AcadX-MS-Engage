import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import {InjectModel} from '@nestjs/mongoose';
import {Assignment, AssignmentDocument} from './assignment.schema';
import {Model} from 'mongoose';

@Injectable()
export class AssignmentService {
  constructor(@InjectModel(Assignment.name) private Assignment: Model<AssignmentDocument>) {}
  
  create(createAssignmentDto: CreateAssignmentDto) {
    return this.Assignment.create(createAssignmentDto);
  }

  findAll(query: any) {
    return this.Assignment.find(query);
  }

  findOne(id: string) {
    return this.Assignment.findById(id);
  }

  update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    return `This action updates a #${id} assignment`;
  }

  remove(id: string) {
    return this.Assignment.findByIdAndDelete(id);
  }
}
