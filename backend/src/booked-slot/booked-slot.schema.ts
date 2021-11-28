import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,  Schema as MongooseSchema } from 'mongoose';
const { Types } = MongooseSchema;
export type BookedSlotDocument = BookedSlot & Document;

@Schema()
export class BookedSlot {
	@Prop({ required: true })
	user: string; // userId of the teacher
	
	@Prop({
		required: true,
		ref: 'Class',
		type: Types.ObjectId,
	})
	class: MongooseSchema.Types.ObjectId;
	
	@Prop({
		required: true,
		ref: 'Department',
		type: Types.ObjectId,
	})
	department: MongooseSchema.Types.ObjectId;
	
	
	@Prop({
		required: true,
		type: Types.String,
		enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
	})
	weekDay: string;
	
	@Prop({
		required: true,
		type: Types.String,
	})
	slot: string; // eg: "10-11"
	
	@Prop({
		required: true,
		type: Types.String,
	})
	date: string; // eg: "10-11"
	
	
	@Prop({
		required: 'true',
		type: Types.String,
		enum: ['virtual', 'in-person']
	})
	modeOfDelivery: string;
	
}

export const BookedSlotSchema = SchemaFactory.createForClass(BookedSlot);