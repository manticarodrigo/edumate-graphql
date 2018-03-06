const uuid = require('uuid/v1')
const mime = require('mime-types')
const AWS = require('aws-sdk')
var fs =  require('fs')

const s3client = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  params: {
    Bucket: process.env.S3_BUCKET
  },
  endpoint: new AWS.Endpoint('http://localhost:4569')
})

exports.processUpload = async ( file, ctx ) => {
  console.log('processing upload')
  if (!file) {
    return 'No file received.'
  }

  const name = file.filename
  const secret = uuid()
  const size = ctx.request.rawHeaders[ctx.request.rawHeaders.indexOf('Content-Length') + 1]
  const contentType = mime.lookup(file.filename)

  console.log(name)
  console.log(secret)
  console.log(size)
  console.log(contentType)

  // Upload to S3
  const response = await s3client
    .upload({
      Key: secret,
      ACL: 'public-read',
      Body: file.stream,
      ContentLength: size,
      ContentType: contentType,
    })
    .promise()

  const url = response.Location
  console.log('received s3 file with url:')
  console.log(url)

  // Sync with Prisma
  const data = {
    name,
    size,
    secret,
    contentType,
    url,
  }

  const { id } = await ctx.db.mutation.createFile({ data }, ` { id } `)

  const newFile = {
    id,
    name,
    secret,
    contentType,
    size,
    url,
  }
  console.log('saved prisma file:')
  console.log(newFile)

  return newFile
}