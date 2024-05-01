import * as uuid from 'uuid'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { parseUserId } from '../../auth/utils.mjs'
import { deleteTodo } from '../../business/ToDo.js'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('DeleteTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async function handler(event) {
    const { todoId } = event.pathParameters
    const authHeader =
      event.headers.Authorization || event.headers.authorization
    const userId = parseUserId(authHeader)
    try {
      const result = await deleteTodo(userId, todoId)
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    } catch (e) {
      logger.error(e)
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: e.message
        })
      }
    }
  })
