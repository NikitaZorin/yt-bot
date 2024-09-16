import { Module } from '@nestjs/common';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService, MongooseModule],
  controllers: [UserController],
})
export class UserModule {}

