import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,  Schema as MongooseSchema } from 'mongoose';
const { Types } = MongooseSchema;

export type DepartmentDocument = Department & Document;

@Schema()
export class Department {
	@Prop({
		required: true,
		type: Types.String,
	})
	name: string;
	
	@Prop()
	abbreviation: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);