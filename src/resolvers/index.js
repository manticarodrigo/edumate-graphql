const { Query } = require('./Query')
const { auth } = require('./Mutation/auth')
const { file } = require('./Mutation/file')
const { post } = require('./Mutation/post')
const { AuthPayload } = require('./AuthPayload')

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...file,
    ...post,
  },
  AuthPayload,
}