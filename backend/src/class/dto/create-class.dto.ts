import { IsNotEmpty } from 'class-validator';

export class CreateClassDto {
	@IsNotEmpty()
	name: string;
	
	@IsNotEmpty()
	details: string;
	
	@IsNotEmpty()
	modeOfDelivery: string;
	
	@IsNotEmpty()
	department: string;
	
	@IsNotEmpty()
	date: string;
	
	@IsNotEmpty()
	slot: string;
	
	faculty: string | any;
	
	attachments: string[];
}
