import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {FirebaseService} from './firebase/firebase.service';
import {sendMail} from '../common/mailer';

@Injectable()
export class UserService {
  constructor(private firebaseService: FirebaseService) {}
  
  async create(user: CreateUserDto, role: string) {
    const { email, password, name, department } = user;
    const allowedEmailDomain = '@bmsce.ac.in';
    if (!email.endsWith(allowedEmailDomain))
      throw new Error('Domain not allowed')
    const customClaims = { role }
    if (department) customClaims['department'] = department;
  return this.firebaseService.signupWithRole({ email, password, customClaims, name })
  }
  
  async createTeacher(user: CreateUserDto) {
    user.password = Math.random().toString().substring(2, 8);
    const token = await this.create(user, 'teacher')
    // @ts-ignore
    await sendMail({
      text: 'Login to AcadX with your EmailID. Your password is ' + user.password,
      to: user.email,
      subject: 'AcadX Login Credentials'
    });
    return token
  }
 
  async findAllTeachers() {
    return this.firebaseService.getAllTeachers();
  }
  
  async findAllStudents() {
    return this.firebaseService.getAllStudents();
  }
  
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
