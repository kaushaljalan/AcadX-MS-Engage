import { Prop, Schema, SchemaFactory,raw } from '@nestjs/mongoose';
import { Document,  Schema as MongooseSchema } from 'mongoose';
const { Types } = MongooseSchema;
export type AssignmentDocument = Assignment & Document;

@Schema()
export class Questions extends Document {
	@Prop({ required: true })
	question: string;
	
	@Prop({ required: true })
	marks: number;
}
export const QuestionsSchema = SchemaFactory.createForClass(Questions);

@Schema({ timestamps: true })
export class Assignment {
	@Prop({
		required: true,
		type: Types.String,
	})
	name: string;
	
	@Prop()
	details: string;
	
	@Prop({
		required: true,
		type: Types.Date
	})
	deadline: Date;
	
	@Prop({
		required: true,
		type: Types.String,
	})
	faculty: string;
	
	@Prop({
		required: true,
		ref: 'Department',
		type: Types.ObjectId,
	})
	department: MongooseSchema.Types.ObjectId;
	
 @Prop({ type: [QuestionsSchema], default: [] })
 questions: Questions[];
	
	@Prop({
		type: [Types.String]
	})
	attachments: string[];
	
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);