import { StringUtils } from "@/utils/string-utils.js"
import { s3 } from "bun"

export class S3Service {
  constructor() {}

  static async uploadIndexFile(
    userName: string,
    repositoryName: string,
    content: string,
  ) {
    const fileName = StringUtils.getRepositoryStorageKey(
      userName,
      repositoryName,
      "txt",
    )

    const s3file = s3.file(fileName)

    await s3file.write(content, {
      type: "text/plain",
    })

    // Return the CloudFront URL for the uploaded file
    return `https://d33aluc0l6cahu.cloudfront.net/${fileName}`
  }
}
