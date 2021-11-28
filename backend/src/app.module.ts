import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {ClassModule} from './class/class.module';
import {DepartmentModule} from './department/department.module';
import {Authorize, AuthorizeTeacher} from './common/middlewares';
import {PreferredSlotModule} from './preferred-slot/preferred-slot.module';
import {BookedSlotModule} from './booked-slot/booked-slot.module';
import {AssignmentModule} from './assignment/assignment.module';
import {AssignmentSubmissionModule} from './assignment-submission/assignment-submission.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UserModule,
    ClassModule,
    DepartmentModule,
    PreferredSlotModule,
    BookedSlotModule,
    AssignmentModule,
    AssignmentSubmissionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizeTeacher).forRoutes(
      { path: 'classes', method: RequestMethod.POST },
      { path: 'users/basic', method: RequestMethod.GET },
      { path: 'assignments', method: RequestMethod.POST })
    consumer.apply(Authorize).forRoutes(
      { path: 'classes', method: RequestMethod.GET },
      { path: 'assignments', method: RequestMethod.GET },
      { path: '/assignment-submissions', method: RequestMethod.GET },
      { path: '/assignment-submissions', method: RequestMethod.POST },
      { path: 'preferred-slots*', method: RequestMethod.ALL },
      { path: 'booked-slots', method: RequestMethod.GET })
  }
}
