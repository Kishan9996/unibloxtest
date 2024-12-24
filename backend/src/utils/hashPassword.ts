// services/AuthService.ts
import bcrypt from 'bcrypt';
import { PASSWORD_SALT_ROUND, passwordCarSet } from '../config';

export class PasswordService {
    private saltRounds: number;

    constructor() {
      this.saltRounds = PASSWORD_SALT_ROUND;
    }
  
    // Method to hash a password
    public async generateHashPassword(password: string): Promise<string> {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    }
  
    // Method to check a password against a hashed password
    public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    }
  
    // Method to generate a random password
    private generateRandomPassword(length: number = 12): string {
      const charset = passwordCarSet;
      let password = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
      return password;
    }
  
    // Method to generate a random hashed password
    public async generateRandomHashedPassword(length: number = 12): Promise<string> {
      const randomPassword = this.generateRandomPassword(length);
      return await this.generateHashPassword(randomPassword);
    }
  }
  