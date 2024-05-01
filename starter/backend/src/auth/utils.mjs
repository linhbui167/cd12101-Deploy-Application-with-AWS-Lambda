import { decode } from 'jsonwebtoken'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('utils')

export function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
/**
 * Parse a JWT token and return a user id
 * @param authHeader
 * @returns a user id from the JWT token
 */
export function parseUserId(authHeader) {
  const jwtToken = getToken(authHeader)
  const decodedJwt = decode(jwtToken)
  return decodedJwt.sub
}

export async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = decode(token, { complete: true })

  return jwt
}
