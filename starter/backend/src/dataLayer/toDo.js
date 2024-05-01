import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class ToDoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todoTable = process.env.TODOS_TABLE
  ) {
    this.documentClient = documentClient
    this.todoTable = todoTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async getAllTodos(userId, todoId) {
    const getQuery = {
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }
    if (todoId) {
      getQuery.KeyConditionExpression = 'userId = :userId AND id = :todoId'
      getQuery.ExpressionAttributeValues = {
        ':userId': userId,
        ':todoId': todoId
      }
    }
    const result = await this.dynamoDbClient.query(getQuery)
    return result.Items
  }

  async createTodo(Item) {
    const result = await this.dynamoDbClient.put({
      TableName: this.todoTable,
      Item
    })
    return Item
  }

  async deleteTodo(userId, todoId) {
    const result = await this.dynamoDbClient.delete({
      TableName: this.todoTable,
      Key: {
        id: todoId,
        userId: userId
      },
      ReturnValues: 'ALL_OLD'
    })
    return result
  }

  async updateTodo(userId, Item) {
    const result = await this.dynamoDbClient.update({
      TableName: this.todoTable,
      Key: {
        id: Item.id,
        userId
      },
      UpdateExpression: 'set done = :d',
      ExpressionAttributeValues: {
        ':d': Item.done
      },
      ReturnValues: 'UPDATED_NEW'
    })
    return result
  }
  async updateTodoAttachment(userId, Item) {
    console.log(Item);
    const result = await this.dynamoDbClient.update({
      TableName: this.todoTable,
      Key: {
        id: Item.id,
        userId
      },
      UpdateExpression: 'set hasAttachment = :d',
      ExpressionAttributeValues: {
        ':d': Item.hasAttachment
      },
      ReturnValues: 'UPDATED_NEW'
    })
    return result
  }
}
