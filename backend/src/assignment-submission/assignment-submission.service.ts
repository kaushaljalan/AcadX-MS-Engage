import { Injectable } from '@nestjs/common';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment-submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment-submission.dto';
import {InjectModel} from '@nestjs/mongoose';
import {AssignmentSubmission, AssignmentSubmissionDocument} from './assignment-submission.schema';
import {Model} from 'mongoose';

@Injectable()
export class AssignmentSubmissionService {
  constructor(@InjectModel(AssignmentSubmission.name) private AssignmentSubmission: Model<AssignmentSubmissionDocument>) {
  }
  async create(createAssignmentSubmissionDto: CreateAssignmentSubmissionDto) {
      if (await this.AssignmentSubmission.exists({
        user: createAssignmentSubmissionDto.user,
        assignment: createAssignmentSubmissionDto.assignment
      }))
        return 'Already Submitted'
    return this.AssignmentSubmission.create(createAssignmentSubmissionDto);
  }

  findAll(query: any) {
    return this.AssignmentSubmission.find(query);
  }

  findOne(id: string) {
    return this.AssignmentSubmission.findById(id);
  }

  grade(id: string, grades: any[]) {
    return this.AssignmentSubmission.findByIdAndUpdate(id, { grades, graded: true });
  }
  update(id: number, updateAssignmentSubmissionDto: UpdateAssignmentSubmissionDto) {
    return `This action updates a #${id} assignmentSubmission`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignmentSubmission`;
  }
}
