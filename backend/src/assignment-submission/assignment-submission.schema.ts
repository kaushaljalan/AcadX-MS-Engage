import { Prop, Schema, SchemaFactory,raw } from '@nestjs/mongoose';
import { Document,  Schema as MongooseSchema } from 'mongoose';
const { Types } = MongooseSchema;
export type AssignmentSubmissionDocument = AssignmentSubmission & Document;

@Schema()
export class Answers extends Document {
	@Prop({
		required: true,
		type: Types.ObjectId,
	})
	question: MongooseSchema.Types.ObjectId;
	
	@Prop({ required: true })
	answer: string;
}
export const AnswersSchema = SchemaFactory.createForClass(Answers);

@Schema()
export class Grades extends Document {
	@Prop({
		required: true,
		type: Types.ObjectId,
	})
	question: MongooseSchema.Types.ObjectId;
	
	@Prop({ required: true })
	marks: number;
}
export const GradesSchema = SchemaFactory.createForClass(Grades);



@Schema({ timestamps: true })
export class AssignmentSubmission {
	@Prop({
		required: true,
		type: Types.String,
	})
	user: string;
	
	@Prop({
		required: true,
		ref: 'Assignment',
		type: Types.ObjectId,
	})
	assignment: MongooseSchema.Types.ObjectId;


	@Prop({ type: [AnswersSchema], default: [] })
	answers: Answers[];
	
	@Prop({ type: [GradesSchema], default: [] })
	grades: Grades[];
	
	@Prop({ type: Types.Boolean, default: false })
	graded: boolean;
	
	@Prop({
		type: [Types.String]
	})
	attachments: string[];
	
}

export const AssignmentSubmissionSchema = SchemaFactory.createForClass(AssignmentSubmission);