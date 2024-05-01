import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import * as uuid from 'uuid'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ImageAccess } from '../dataLayer/image.js'

const imgAccess = new ImageAccess
const s3Client = new S3Client()
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)


export async function createTodoImg(imageItem) {
  const timestamp = new Date().toISOString()
  const newItem = {
    ...imageItem,
    timestamp,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageItem.imageId}`,
  }
  return imgAccess.createTodoImage(newItem)
}

export async function getUploadUrl(imageId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  return url
}