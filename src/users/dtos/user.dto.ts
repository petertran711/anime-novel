import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  fullName: string;

  @Expose()
  description: string; 

  @Expose()
  phoneNumber: string;

  @Expose()
  isCreateContent: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  roles: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;


  @Expose()
  birthday: Date;

  @Expose()
  city: string;
}
