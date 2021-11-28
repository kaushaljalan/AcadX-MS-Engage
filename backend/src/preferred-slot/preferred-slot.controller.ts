import {Controller, Get, Post, Body, Patch, Param, Delete, Req} from '@nestjs/common';
import { PreferredSlotService } from './preferred-slot.service';
import { CreatePreferredSlotDto } from './dto/create-preferred-slot.dto';
import { UpdatePreferredSlotDto } from './dto/update-preferred-slot.dto';

@Controller('preferred-slots')
export class PreferredSlotController {
  constructor(private readonly preferredSlotService: PreferredSlotService) {}

  @Post()
  create(@Body() createPreferredSlotDto: CreatePreferredSlotDto, @Req() req) {
    return this.preferredSlotService.create({
      ...createPreferredSlotDto,
      user: req.user.uid,
      department: req.user.department
    });
  }

  @Get()
  findAll(@Req() req) {
    return this.preferredSlotService.findAll(req.user.uid);
  }
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreferredSlotDto: UpdatePreferredSlotDto) {
    return this.preferredSlotService.update(id, updatePreferredSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preferredSlotService.remove(id);
  }
}
