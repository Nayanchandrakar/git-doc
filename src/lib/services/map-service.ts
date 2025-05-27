export class MapService {
  constructor() {}

  static async estimateTokens(content: string) {
    return content.split(/\s+/).filter((word) => word.length > 0).length
  }
}
