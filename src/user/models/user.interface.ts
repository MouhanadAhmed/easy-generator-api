import { Document } from 'mongoose';

export interface User extends Document {
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly isActive: boolean;
  readonly loggedOutAt: Date;
  readonly verified: boolean;
  readonly role?: string;
}
