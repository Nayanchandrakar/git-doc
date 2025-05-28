import {
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3"

type UploadObjectProps = Omit<PutObjectCommandInput, "Bucket">

class S3Service {
  private static instance: S3Service
  private client: S3Client

  private constructor() {
    this.client = new S3Client({
      region: process.env.S3_REGION!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })
  }

  static getInstance(): S3Service {
    if (!S3Service.instance) {
      S3Service.instance = new S3Service()
    }
    return S3Service.instance
  }

  getClient(): S3Client {
    return this.client
  }

  async uploadObjects(props: UploadObjectProps) {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      ...props,
    })

    await this.client.send(command)
  }
}

export const s3Service = S3Service.getInstance()
