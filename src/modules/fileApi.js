const uuid = require('uuid/v1')
const aws = require('aws-sdk')

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  params: {
    Bucket: process.env.S3_BUCKET
  },
  endpoint: new aws.Endpoint('http://localhost:4569')
})

exports.processUpload = async ( file, ctx ) => {
  console.log('processing upload')

  if (!file) {
    return console.log('ERROR: No file received.')
  }
  
  const { stream, filename, mimetype, encoding } = await file
  const key = uuid() + '-' + filename

  // Upload to S3
  const response = await s3
    .upload({
      Key: key,
      ACL: 'public-read',
      Body: stream
    }).promise()

  const url = response.Location

  // Prisma data
  const data = {
    filename,
    mimetype,
    encoding,
    url,
  }

  return data
}