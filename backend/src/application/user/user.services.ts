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

  public async fetchUserDetailsForAdmin() {
    const result = await this.userRepository.findManyUser({
      select: {
        id: true,
        name: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            createdAt: true,
            discountCode: {
              select: {
                id: true,
                discountValue: true,
              },
            },
            cart: {
              select: {
                items: {
                  select: {
                    quantity: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (result?.length) {
      const data = result.map((user: any) => {
        let totalItemsPurchased = 0;
        let totalAmountSpent = 0;
        let totalDiscount = 0;
        const discountCodes = new Set<string>();
        user.orders.forEach((order: any) => {
          order.cart.items.forEach((item: any) => {
            totalItemsPurchased += item.quantity;
          });
          if (order.discountCode) {
            totalAmountSpent += order.amountAfterDiscount;
            totalDiscount += order.totalAmount - order.amountAfterDiscount;
            discountCodes.add(order.discountCode.name);
          } else {
            totalAmountSpent += order.totalAmount;
          }
        });
        return {
          user: { id: user.id, name: user.name },
          totalItemsPurchased,
          totalAmountSpent,
          discountCodes: Array.from(discountCodes),
          totalDiscount,
        };
      });
      return data;
    }
  }
}
