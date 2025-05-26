import { createId } from "@paralleldrive/cuid2"

export class StringUtils {
  static createRepoUrl(userName: string, repositoryName: string) {
    return `https://github.com/${userName}/${repositoryName}.git`
  }

  static createRepoPath(userName: string, repositoryName: string) {
    return `../../../repository/${userName.toLowerCase()}/${repositoryName}`
  }

  static getRepositoryStorageKey(userName: string, repositoryName: string) {
    return `repositories/${userName.toLowerCase()}-${repositoryName}/${createId()}.txt`
  }
}
