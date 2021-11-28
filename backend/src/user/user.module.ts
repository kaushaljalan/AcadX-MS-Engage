import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FirebaseService } from './firebase/firebase.service';

@Module({
  controllers: [UserController],
  providers: [UserService, FirebaseService],
  exports: [FirebaseService]
})
export class UserModule {}
