import { PrismaClient } from "@prisma/client";
import readline from "readline";
import { PasswordService } from "../utils/hashPassword";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Create an interface for reading input from the command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  const passwordService = new PasswordService();
  try {
    // Ask for email
    const email = await askQuestion("Enter your email: ");
    if (!email) {
      console.error("Email is required.");
      process.exit(1);
    }

    // Ask for password
    const password = await askQuestion("Enter your password: ");
    if (!password) {
      console.error("Password is required.");
      process.exit(1);
    }

    const hashedPassword = await passwordService.generateHashPassword(password);
    // Create a new user instance in the database
    const newUser = await prisma.user.create({
      data: {
        name:"admin",
        email: email,
        password: hashedPassword,
        role:"ADMIN"
      },
    });

    console.log("User created successfully:", newUser);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
