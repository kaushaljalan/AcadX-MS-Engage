import {Controller, Get, Post, Body, Patch, Param, Delete, Query, Req} from '@nestjs/common';
import { AssignmentSubmissionService } from './assignment-submission.service';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment-submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment-submission.dto';
import { mongo } from 'mongoose';

@Controller('assignment-submissions')
export class AssignmentSubmissionController {
  constructor(private readonly assignmentSubmissionService: AssignmentSubmissionService) {}

  @Post()
  create(@Body() createAssignmentSubmissionDto: CreateAssignmentSubmissionDto, @Req() req) {
    return this.assignmentSubmissionService.create({
      ...createAssignmentSubmissionDto,
      user: req.user.uid,
    });
  }

  @Get()
  findAll(@Query() query, @Req() req) {
      if (req.user.role === 'student')
        query['user'] = req.user.uid;
      if (query.assignment)
        query['assignment'] = new mongo.ObjectId(query.assignment);
    return this.assignmentSubmissionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentSubmissionService.findOne(id);
  }

  @Patch(':id/grade')
  update(@Param('id') id: string, @Body() updateAssignmentSubmissionDto: UpdateAssignmentSubmissionDto) {
    return this.assignmentSubmissionService.grade(id, updateAssignmentSubmissionDto.grades);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentSubmissionService.remove(+id);
  }
}
