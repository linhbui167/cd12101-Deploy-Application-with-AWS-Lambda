import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { parseUserId } from '../../auth/utils.mjs'
import { getAllTodos } from '../../business/ToDo.js'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('GetTodos')
export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async function handler(event) {
    try {
      const authHeader =
        event.headers.Authorization || event.headers.authorization
      const userId = parseUserId(authHeader)
      const items = await getAllTodos(userId)
      const response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: items.map(item => {
            if (item.hasAttachment) {
              item.attachmentUrl = `https://${process.env.IMAGES_S3_BUCKET}.s3.amazonaws.com/${item.id}`
            }
            return item
          })
        })
      }
      return response
    } catch (e) {
      logger.error(e)
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: e.message
        })
      }
    }
  })
