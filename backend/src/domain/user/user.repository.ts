import { BaseRepository } from '../../database/base.repository';
import { Prisma, User } from '@prisma/client';
import { PasswordService } from '../../utils/hashPassword';
import { UserWithoutPassword } from './types';

export class UserRepository extends BaseRepository {
  private passwordService: PasswordService;

  constructor() {
    super(Prisma.ModelName.User);
    this.passwordService = new PasswordService();
  }

  async findUniqueUser(props: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return this.prisma.user.findUnique(props);
  }

  public async compareUserPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await this.passwordService.comparePassword(password, hashedPassword);
  }

  async updateUser(userUpdateArgs: Prisma.UserUpdateArgs): Promise<UserWithoutPassword | null> {
    const updatedUser = await this.prisma.user.update(userUpdateArgs);
    return updatedUser;
  }

  async createUserWithPasswordEncryption(payload: Prisma.UserCreateInput): Promise<User | null> {
    if (!payload?.password) {
      return null;
    }
    payload.password = await this.passwordService.generateHashPassword(payload.password);
    return this.prisma.user.create({
      data: payload,
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public async createPassword(password: string): Promise<string> {
    return await this.passwordService.generateHashPassword(password);
  }

  async getUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (await this.passwordService.comparePassword(password, user?.password ?? '')) {
      return user;
    } else {
      return null;
    }
  }
}
