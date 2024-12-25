import { User, Prisma } from '@prisma/client';
import { UserRepository } from '../../domain/user';
import { UserWithoutPassword } from '../../domain/user/types';
import { UserSignUpSchemaType } from '../../interface/auth/schema';

export class UserServices {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
  async getUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
    return await this.userRepository.getUserByEmailAndPassword(email, password);
  }

  async updateUserDetails(userUpdateArgs: Prisma.UserUpdateArgs): Promise<UserWithoutPassword | null> {
    return await this.userRepository.updateUser(userUpdateArgs);
  }
  async updateUserLoggedInDetails(userId: string, data: Record<any, any>): Promise<UserWithoutPassword | null> {
    return await this.updateUserDetails({
      where: { id: userId },
      data: {
        ...data,
        isLoggedIn: true,
      },
    });
  }

  async checkPassportJwtUserIsValid(
    userUniqueProps: Prisma.UserWhereUniqueInput,
    jwtPayload: { loginSecrete: string }
  ): Promise<Omit<User, 'password'>> {
    try {
      const { password, ...user } = (await this.userRepository.findUniqueUser({
        where: userUniqueProps,
      })) as User;
      if (user) {
        const isLoginSecreteValid = await this.compareLoginSecrete(password ?? '', jwtPayload.loginSecrete);
        if (isLoginSecreteValid && user?.loginSecrete) {
          return user;
        } else {
          throw Error('User is not logged in');
        }
      } else {
        throw Error('User is not logged in');
      }
    } catch (error) {
      throw Error('User is unauthorized');
    }
  }

  public async compareLoginSecrete(secrete: string, encryptedSecrete: string): Promise<boolean> {
    return await this.userRepository.compareUserPassword(secrete, encryptedSecrete);
  }

  async createUser(payload: UserSignUpSchemaType): Promise<User | null> {
    const user = await this.userRepository.createUserWithPasswordEncryption({
      ...payload,
      role: 'USER',
      isLoggedIn: false,
    });
    return user;
  }
  async setLoginUser(userId: string, data: Record<any, any>): Promise<UserWithoutPassword | null> {
    return await this.updateUserLoggedInDetails(userId, data);
  }

  public async creteLoginSecrete(secrete: string): Promise<string> {
    return await this.userRepository.createPassword(secrete);
  }

  public async findUserById(id: string): Promise<User | null> {
    return await this.userRepository.findUserById(id);
  }
}
