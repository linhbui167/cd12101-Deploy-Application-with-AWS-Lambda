import * as uuid from 'uuid'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { parseUserId } from '../../auth/utils.mjs'
import { createTodo } from '../../business/ToDo.js'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('CreateTodos')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async function handler(event) {
    const newTodo = JSON.parse(event.body)
    const authHeader =
      event.headers.Authorization || event.headers.authorization
    const userId = parseUserId(authHeader)

    try {
      const result = await createTodo(userId, {
        ...newTodo,
        id: uuid.v4()
      })
      logger.log('Created todo: ', JSON.stringify(result))
      return {
        statusCode: 201,
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
