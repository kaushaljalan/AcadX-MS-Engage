import {Controller, Get, Post, Body, Patch, Param, Delete, Res} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      const token = await this.userService.create(createUserDto, 'student');
      res.send(token);
    } catch (e) {
      res.status(400).send(e.message)
    }
  }
  @Get('/basic')
  async findAll() {
    return this.userService.findAllStudents();
  }
  @Post('/teachers')
  createTeacher(@Body() createUserDto: CreateUserDto) {
    return this.userService.createTeacher(createUserDto);
  }
  
  @Get('/teachers')
  getTeachers() {
    return this.userService.findAllTeachers()
  }
  
}
