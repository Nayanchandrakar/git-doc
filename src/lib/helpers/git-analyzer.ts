import { exec } from "child_process"
import * as path from "path"
import { fileURLToPath } from "url"
import { promisify } from "util"
import { EXCLUDED_PATTERNS } from "@/constants/exclude-files.js"
import { git } from "@/lib/services/git-service.js"
import { MapService } from "@/lib/services/map-service.js"
import { StringUtils } from "@/utils/string-utils.js"
import * as fs from "fs/promises"
import { minimatch } from "minimatch" // Add minimatch for pattern matching
import pLimit from "p-limit"

const CONCURRENCY_LIMIT = Number(process.env.CONCURRENCY_LIMIT) || 10
const concurrencyLimiter = pLimit(CONCURRENCY_LIMIT)
const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = path.dirname(currentFilePath)
const execAsync = promisify(exec)

interface FileInfo {
  path: string
  content: string
}

export class GitRepositoryAnalyzer {
  private constructor() {}

  static async collectFiles(directory: string, baseDirectory: string) {
    const filePaths: string[] = []
    const entries = await fs.readdir(directory, { withFileTypes: true })

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name)
        const relativePath = path.relative(baseDirectory, fullPath)

        if (entry.isDirectory()) {
          filePaths.push(...(await this.collectFiles(fullPath, baseDirectory)))
        } else {
          filePaths.push(relativePath)
        }
      }),
    )

    return filePaths
  }

  static async generateDirectoryTree(baseDirectory: string, indent = "") {
    const { stdout } = await execAsync(`tree -a .`, { cwd: baseDirectory })
    const treeStructure = stdout
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => `${indent}${line}`)
      .join("\n")

    return treeStructure
  }

  static async readFileContents(directory: string, filePaths: string[]) {
    const fileContents: FileInfo[] = []
    const readTasks = filePaths.map((filePath) =>
      concurrencyLimiter(async () => {
        try {
          const content = await fs.readFile(
            path.join(directory, filePath),
            "utf-8",
          )
          fileContents.push({ path: filePath, content })
        } catch (error) {
          console.error(`Error reading file ${filePath}:`, error)
        }
      }),
    )

    await Promise.all(readTasks)
    return fileContents
  }

  static async deleteExcludedFiles(directory: string, baseDirectory: string) {
    const entries = await fs.readdir(directory, { withFileTypes: true })

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name)
        const relativePath = path.relative(baseDirectory, fullPath)

        const isExcluded = EXCLUDED_PATTERNS.some((pattern) =>
          minimatch(relativePath, pattern, { matchBase: true, nocase: false }),
        )

        if (isExcluded) {
          await fs.rm(fullPath, { recursive: true, force: true })
        } else if (entry.isDirectory()) {
          await this.deleteExcludedFiles(fullPath, baseDirectory)
        }
      }),
    )
  }

  static async analyzeGitRepository(
    userName: string,
    repositoryUrl: string,
    repositoryName: string,
  ) {
    const repoPath = StringUtils.createRepoPath(userName, repositoryName)
    const cloneDirectory = path.join(currentDirPath, repoPath)

    try {
      await git.clone(repositoryUrl, cloneDirectory, ["--depth", "1"])
      await this.deleteExcludedFiles(cloneDirectory, cloneDirectory)

      const filesToAnalyze = await this.collectFiles(
        cloneDirectory,
        cloneDirectory,
      )

      const fileContents = await this.readFileContents(
        cloneDirectory,
        filesToAnalyze,
      )
      const totalTokenCount = await this.calculateTokenCount(fileContents)
      const directoryTree = await this.generateDirectoryTree(cloneDirectory)

      return this.formatAnalysisOutput(
        userName,
        repositoryName,
        fileContents,
        totalTokenCount,
        directoryTree,
      )
    } catch (error) {
      throw new Error(
        `Failed to analyze repository: ${error instanceof Error ? error.message : String(error)}`,
      )
    } finally {
      await this.removeCloneDirectory(cloneDirectory)
    }
  }

  private static async calculateTokenCount(fileContents: FileInfo[]) {
    const tokenPromises = fileContents.map((file) =>
      MapService.estimateTokens(file.content),
    )
    const tokenCounts = await Promise.all(tokenPromises)
    return tokenCounts.reduce((sum, tokens) => sum + tokens, 0)
  }

  private static formatAnalysisOutput(
    userName: string,
    repositoryName: string,
    fileContents: FileInfo[],
    totalTokenCount: number,
    directoryTree: string,
  ): string {
    const separator = "────".repeat(24)
    const sectionBreak = "\n".repeat(2)

    let output = `${separator}\n`
    output += `Repository Analysis: ${userName}/${repositoryName}\n`
    output += `${separator}\n\n`

    output += `Summary:\n`
    output += `- Files Analyzed: ${fileContents.length}\n`
    output += `- Estimated Tokens: ${totalTokenCount}\n`
    output += `${sectionBreak}`

    output += `Repository Structure:\n`
    output += `└── ${userName}/${repositoryName}/\n`
    output += directoryTree
      .split("\n")
      .map((line) => `    ${line}`)
      .join("\n")
    output += `${sectionBreak}`

    for (const file of fileContents) {
      output += `${separator}\n`
      output += `File: ${file.path}\n`
      output += `${separator}\n\n`
      output += `${file.content}\n`
      output += `${sectionBreak}`
    }

    return output
  }

  private static async removeCloneDirectory(cloneDirectory: string) {
    await fs.rm(cloneDirectory, { recursive: true, force: true })
  }
}
