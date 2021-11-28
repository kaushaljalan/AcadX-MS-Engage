import { Module } from '@nestjs/common';
import { AssignmentSubmissionService } from './assignment-submission.service';
import { AssignmentSubmissionController } from './assignment-submission.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {AssignmentSubmission, AssignmentSubmissionSchema} from './assignment-submission.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: AssignmentSubmission.name, schema: AssignmentSubmissionSchema }])],
  controllers: [AssignmentSubmissionController],
  providers: [AssignmentSubmissionService]
})
export class AssignmentSubmissionModule {}
