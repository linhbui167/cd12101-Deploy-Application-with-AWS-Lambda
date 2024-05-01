import * as uuid from 'uuid'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { parseUserId } from '../../auth/utils.mjs'
import { updateTodo } from '../../business/ToDo.js'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('UpdateTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async function handler(event) {
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)
    const authHeader =
      event.headers.Authorization || event.headers.authorization
    const userId = parseUserId(authHeader)
    try {
      logger.log('update Todo: ', updatedTodo)
      const result = await updateTodo(userId, {
        ...updatedTodo,
        id: todoId,
      })
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
