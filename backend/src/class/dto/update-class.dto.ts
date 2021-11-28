import { IsNotEmpty } from 'class-validator';

export class UpdateClassDto {
	@IsNotEmpty()
	name: string;
	
	@IsNotEmpty()
	description: string;
	
	attachments: string[];
	cancelled: boolean;
}
