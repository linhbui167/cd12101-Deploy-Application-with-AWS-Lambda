import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class ImageAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    imageTable = process.env.TODO_IMAGE_TABLE
  ) {
    this.documentClient = documentClient
    this.imageTable = imageTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async createTodoImage(Item) {
    const result = await this.dynamoDbClient.put({
      TableName: this.imageTable,
      Item
    })
    return Item
  }

  async getTodoImages(todoIdsQuery) {
    const result = await this.dynamoDbClient.batchGet({
      RequestItems: {
        [this.imageTable]: {
          Keys: todoIdsQuery
        }
      }
    })
    return result.Items
  }
}
