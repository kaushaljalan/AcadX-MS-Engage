import {Controller, Get, Post, Body, Patch, Param, Delete, Query, Req} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  create(@Body() createAssignmentDto: CreateAssignmentDto, @Req() req) {
    return this.assignmentService.create({
      ...createAssignmentDto,
      faculty: req.user.uid,
    });
  }

  @Get()
  findAll(@Query() query, @Req() req) {
    if (req.user.role === 'teacher')
      query['faculty'] = req.user.uid;
    else
      query['department'] = req.user.department;
    return this.assignmentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentService.update(+id, updateAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentService.remove(id);
  }
}
