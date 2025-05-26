import { simpleGit } from "simple-git"
import type { SimpleGit, SimpleGitOptions } from "simple-git"

class GitService {
  private static instance: GitService
  private git: SimpleGit

  private constructor() {
    const options: Partial<SimpleGitOptions> = {
      baseDir: process.cwd(),
      binary: "git",
      maxConcurrentProcesses: 6,
    }
    this.git = simpleGit(options)
  }

  public static getInstance() {
    if (!GitService.instance) {
      GitService.instance = new GitService()
    }
    return GitService.instance
  }

  getGit() {
    return this.git
  }
}

const gitService = GitService.getInstance()
export const git = gitService.getGit()
