import * as fs from 'fs';
import * as path from 'path';
import readline from 'readline';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
import structure from './modules.config.json';
const rootDir = path.resolve(__dirname, '..'); // Adjusted to refer to 'src' directory
const moduleStructure = structure as any;

// Function to create directory recursively if it does not exist
const ensureDirectoryExistsOrCreate = (filePath: string) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createFile = (filePath: string, content: string = '') => {
  ensureDirectoryExistsOrCreate(filePath);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, { flag: 'w' });
  }
};

const createDirectory = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const generateFilesAndDirectories = (baseDir: string, structure: any, moduleName: string) => {
  Object.keys(structure).forEach((key) => {
    if (key === 'files') {
      // Create all the files defined in the "files" array
      structure[key].forEach((file: string) => {
        const fileName = file.replace('<moduleName>', moduleName);
        const filePath = path.join(baseDir, fileName);
        createFile(filePath);
      });
    } else {
      // Create a directory and recursively generate files/directories inside it
      const newBaseDir = path.join(baseDir, key);
      createDirectory(newBaseDir);
      generateFilesAndDirectories(newBaseDir, structure[key], moduleName);
    }
  });
};

const generateModule = (moduleName: string) => {
  const baseDir = rootDir; // src directory as the base
  Object.keys(moduleStructure).forEach((section) => {
    const sectionDir = path.join(baseDir, section, moduleName);
    createDirectory(sectionDir);
    generateFilesAndDirectories(sectionDir, moduleStructure?.[section], moduleName);
  });
  console.log(`Modules '${moduleName}' generated successfully!`);
  process.exit(1);
};

rl.question('Enter Module Name:', (answer) => {
  if (!answer) {
    console.error('Please provide a module name. Example: npm run generate <module-name>');
    process.exit(1);
  }
  generateModule(answer);
});
