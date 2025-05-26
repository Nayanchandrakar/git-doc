import * as fs from 'fs/promises';
import * as path from 'path';
import { EXCLUDED_FILES } from '../../constants/exclude-files.js';
import pLimit from 'p-limit';
import { StringUtils } from '../../utils/string-utils.js';
import { git } from '../services/git-service.js';
import { MapService } from '../services/map-service.js';
import { fileURLToPath } from 'url';

const CONCURRENCY_LIMIT = Number(process.env.CONCURRENCY_LIMIT) || 10;
const concurrencyLimiter = pLimit(CONCURRENCY_LIMIT);
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

interface FileInfo {
  path: string;
  content: string;
}

export class GitRepositoryAnalyzer {
  private constructor() {}

  static async collectFiles(directory: string, baseDirectory: string) {
    const filePaths: string[] = [];
    const entries = await fs.readdir(directory, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name);
        if (this.isFileExcluded(fullPath, entry.name)) return;

        const relativePath = path.relative(baseDirectory, fullPath);
        if (entry.isDirectory()) {
          filePaths.push(...(await this.collectFiles(fullPath, baseDirectory)));
        } else {
          filePaths.push(relativePath);
        }
      })
    );

    return filePaths;
  }

  static async generateDirectoryTree(directory: string, baseDirectory: string, indent = ''): Promise<string> {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    let treeStructure = '';

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (this.isFileExcluded(fullPath, entry.name)) continue;

      treeStructure += `${indent}└── ${entry.name}${entry.isDirectory() ? '/' : ''}\n`;
      if (entry.isDirectory()) {
        treeStructure += await this.generateDirectoryTree(fullPath, baseDirectory, indent + '    ');
      }
    }

    return treeStructure;
  }

  static async readFileContents(directory: string, filePaths: string[]): Promise<FileInfo[]> {
    const fileContents: FileInfo[] = [];
    const readTasks = filePaths.map((filePath) =>
      concurrencyLimiter(async () => {
        try {
          const content = await fs.readFile(path.join(directory, filePath), 'utf-8');
          fileContents.push({ path: filePath, content });
        } catch (error) {
          console.error(`Error reading file ${filePath}:`, error);
        }
      })
    );

    await Promise.all(readTasks);
    return fileContents;
  }

  static async analyzeGitRepository(userName: string, repositoryUrl: string, repositoryName: string) {
    const repoPath = StringUtils.createRepoPath(userName, repositoryName);
    const cloneDirectory = path.join(currentDirPath, repoPath);

    try {
      await git.clone(repositoryUrl, cloneDirectory, ['--depth', '1']);
      const filesToAnalyze = await this.collectFiles(cloneDirectory, cloneDirectory);
      const fileContents = await this.readFileContents(cloneDirectory, filesToAnalyze);
      const totalTokenCount = await this.calculateTokenCount(fileContents);
      const directoryTree = await this.generateDirectoryTree(cloneDirectory, cloneDirectory);

      return this.formatAnalysisOutput(userName, repositoryName, fileContents, totalTokenCount, directoryTree);
    } catch (error) {
      throw new Error(`Failed to analyze repository: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      await this.removeCloneDirectory(cloneDirectory);
    }
  }

  private static isFileExcluded(fullPath: string, fileName: string){
    return EXCLUDED_FILES.some((pattern) => fullPath.includes(pattern) || fileName === pattern);
  }

  private static async calculateTokenCount(fileContents: FileInfo[]) {
    const tokenPromises = fileContents.map((file) => MapService.estimateTokens(file.content));
    const tokenCounts = await Promise.all(tokenPromises);
    return tokenCounts.reduce((sum, tokens) => sum + tokens, 0);
  }

  private static formatAnalysisOutput(
    userName: string,
    repositoryName: string,
    fileContents: FileInfo[],
    totalTokenCount: number,
    directoryTree: string
  ): string {
    let output = `Repository: ${userName}/${repositoryName}\n\n`;
    output += `Files analyzed: ${fileContents.length}\n\n`;
    output += `Estimated tokens: ${totalTokenCount}\n\n`;
    output += `Repository structure:\n`;
    output += `└── ${userName}/${repositoryName}/\n`;
    output += directoryTree
      .split('\n')
      .map((line) => `    ${line}`)
      .join('\n') + '\n\n';

    for (const file of fileContents) {
      output += `================================================\n`;
      output += `File: ${file.path}\n`;
      output += `================================================\n`;
      output += `${file.content}\n\n`;
    }

    return output;
  }

  private static async removeCloneDirectory(cloneDirectory: string) {
    await fs.rm(cloneDirectory, { recursive: true, force: true });
  }
}