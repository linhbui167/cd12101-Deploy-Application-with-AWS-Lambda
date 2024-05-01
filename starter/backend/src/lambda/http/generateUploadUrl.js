import * as uuid from 'uuid'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { parseUserId } from '../../auth/utils.mjs'
import { getAllTodos, updateTodo } from '../../business/ToDo.js'
import { createLogger } from '../../utils/logger.mjs'
import { createTodoImg, getUploadUrl } from '../../business/imageTodo.js'

const logger = createLogger('GenerateUploadUrl')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async function handler(event) {
    const todoId = event.pathParameters.todoId
    const authHeader =
      event.headers.Authorization || event.headers.authorization
    const userId = parseUserId(authHeader)
    const todoExist = await getAllTodos(userId, todoId)
    if (!todoExist?.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Item does not exist'
        })
      }
    }

    const imageId = uuid.v4()

    const url = await getUploadUrl(todoId)
    await updateTodo(
      userId,
      {
        id: todoId,
        hasAttachment: true
      },
      true
    )

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  })
