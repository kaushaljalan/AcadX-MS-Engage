import {Controller, Get, Post, Body, Patch, Param, Delete, Req, Query} from '@nestjs/common';
import { BookedSlotService } from './booked-slot.service';
import { CreateBookedSlotDto } from './dto/create-booked-slot.dto';
import { UpdateBookedSlotDto } from './dto/update-booked-slot.dto';
import { mongo } from 'mongoose';

@Controller('booked-slots')
export class BookedSlotController {
  constructor(private readonly bookedSlotService: BookedSlotService) {}

  @Post()
  create(@Body() createBookedSlotDto: CreateBookedSlotDto) {
    return this.bookedSlotService.create(createBookedSlotDto);
  }

  @Get()
  findAll(@Req() req, @Query() query) {
    if (query && Object.entries(query).length > 0) {
      if (query.class) {
        query['class'] = new mongo.ObjectId(query.class)
        return this.bookedSlotService.findAll(query);
      }
    }
    return this.bookedSlotService.findAll({ user: req.user.uid });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookedSlotService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookedSlotDto: UpdateBookedSlotDto) {
    return this.bookedSlotService.update(+id, updateBookedSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookedSlotService.remove(+id);
  }
}
