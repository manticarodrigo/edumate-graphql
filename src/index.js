const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const resolvers = require('./resolvers')
const cors = require('cors')

const { S3, Endpoint } = require('aws-sdk')
const fileApi = require('./modules/fileApi')

const s3client = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  params: {
    Bucket: process.env.S3_BUCKET
  },
  endpoint: new Endpoint('http://localhost:4569')
})

getPrismaInstance = () => {
  return new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma DB service (value is set in .env)
    secret: process.env.PRISMA_SECRET, // taken from database/prisma.yml (value is set in .env)
    debug: true, // log all GraphQL queries & mutations
  })
}

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: getPrismaInstance()
  })
})

server.express.use('/*', cors())

server.express.post(
  '/upload',
  fileApi({
    s3: s3client,
    prisma: getPrismaInstance()
  })
)

server.start(() => console.log('Server is running on http://localhost:4000'))