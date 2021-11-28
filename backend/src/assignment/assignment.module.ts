import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import{ Assignment, AssignmentSchema } from './assignment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Assignment.name, schema: AssignmentSchema }])],
  controllers: [AssignmentController],
  providers: [AssignmentService]
})
export class AssignmentModule {}
