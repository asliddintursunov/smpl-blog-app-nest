import { UserRole } from 'generated/prisma';

export interface IRequest {
  user: {
    userId: string;
    email: string;
    role: UserRole;
  };
}
