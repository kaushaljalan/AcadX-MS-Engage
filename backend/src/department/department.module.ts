import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Department, DepartmentDocument, DepartmentSchema } from './department.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }])],
  controllers: [DepartmentController],
  providers: [DepartmentService]
})
export class DepartmentModule {}
