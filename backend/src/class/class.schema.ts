import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,  Schema as MongooseSchema } from 'mongoose';
const { Types } = MongooseSchema;
export type ClassDocument = Class & Document;

@Schema()
export class Class {
	@Prop({
		required: true,
		type: Types.String,
	})
	name: string;
	
	@Prop()
	details: string;

	@Prop({ required: true })
	faculty: string; // userId of the teacher
	
	@Prop({
		required: true,
		type: Types.String,
	})
	date: string;
	
	@Prop({
		required: true,
		type: Types.String,
	})
	slot: string; // eg: "10-11"

	@Prop({
		required: true,
		ref: 'Department',
		type: Types.ObjectId,
	})
	department: MongooseSchema.Types.ObjectId;



	@Prop({
		required: 'true',
		type: Types.String,
		enum: ['virtual', 'in-person']
	})
	modeOfDelivery: string;

	@Prop({
		type: [Types.String]
	})
	attachments: string[];
	
	@Prop({
		type: Types.Boolean,
		default: false,
	})
	cancelled: boolean
	
	
}

export const ClassSchema = SchemaFactory.createForClass(Class);