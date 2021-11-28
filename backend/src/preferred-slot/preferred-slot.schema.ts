import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,  Schema as MongooseSchema } from 'mongoose';
const { Types } = MongooseSchema;
export type PreferredSlotDocument = PreferredSlot & Document;

@Schema()
export class PreferredSlot {
	@Prop({ required: true })
	user: string; // userId of the teacher
	
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

}

export const PreferredSlotSchema = SchemaFactory.createForClass(PreferredSlot);