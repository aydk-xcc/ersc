import * as fs from 'fs';
import * as path from 'path';

/**
 * 如果目录不存在，则创建目录
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 如果目录存在，则删除目录
 */
export function removeDirectoryIfExists(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

/**
 * 复制文件
 */
export function copyFile(sourcePath: string, targetPath: string): void {
  // 确保目标目录存在
  const targetDir = path.dirname(targetPath);
  ensureDirectoryExists(targetDir);
  
  // 复制文件
  fs.copyFileSync(sourcePath, targetPath);
}

/**
 * 获取目录下的所有文件
 */
export function getAllFiles(basePath: string, dirPath: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) {
    return fileList;
  }

  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules') {
      getAllFiles(basePath, filePath, fileList);
    } else if (file !== 'node_modules') {
      fileList.push(filePath.replace(basePath, ''));
    }
  });
  
  return fileList;
}