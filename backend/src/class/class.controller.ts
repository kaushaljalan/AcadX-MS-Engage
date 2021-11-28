import {Controller, Get, Post, Body, Patch, Param, Res, Req, Query} from '@nestjs/common';
import { mongo } from 'mongoose';
import { ClassService } from './class.service';
import { BookedSlotService } from '../booked-slot/booked-slot.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { FindAllDto } from './dto/find-all.dto';
import {PreferredSlotService} from '../preferred-slot/preferred-slot.service';
import { FirebaseService } from '../user/firebase/firebase.service';
import {sendMail} from '../common/mailer';

@Controller('classes')
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly bookedSlotService: BookedSlotService,
    private readonly preferredSlotService: PreferredSlotService,
    private readonly firebaseService: FirebaseService
  ) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto, @Req() req) {
    const newClass = await this.classService.create({
      ...createClassDto,
      faculty: req.user.uid,
    });
    // const
    const bookedStudentsAtTheSlotAndDay = await this.bookedSlotService.getUnavailableUsersForClass(newClass);
    console.log({ bookedStudentsAtTheSlotAndDay })
    // get available students for the slot
    const { date, department, modeOfDelivery, slot } = newClass;
    const availableStudents = await this.preferredSlotService.getAvailableStudentsForClass(newClass, bookedStudentsAtTheSlotAndDay)
    // book slots for that
    console.log({ availableStudents })
  
    const bookedSlots = await this.bookedSlotService.bookClasses(newClass, availableStudents);
    // const users = (await this.firebaseService.getAllStudents())
    //   .filter(u => availableStudents.includes(u.uid))
    //   //@ts-ignore
    //   .map(u => u.email);
    // console.log({ users })
    // if (users.length > 0)
    //   //@ts-ignore
    //   await sendMail({
    //   subject: 'Class Scheduled',
    //   text: 'Class ' + newClass.name + 'has been scheduled on ' + newClass.date + ' at ' + newClass.slot + ' Visit your dashboard to know more',
    //   to: users.join(',')
    // })
    console.log({ bookedSlots })
    return newClass;
  }

  @Get()
  findAll(@Query() query: FindAllDto, @Req() req) {
    if (req.user.role === 'teacher')
      query['faculty'] = req.user.uid;
    else
      query['department'] = new mongo.ObjectId(req.user.department);
    return this.classService.findAll(query);
  }
  
  @Get('/booked')
  getBookedSlots(@Param() params: FindAllDto) {
    return this.classService.findAllBookedSlots(params);
  }
  
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(id, updateClassDto);
  }

}
