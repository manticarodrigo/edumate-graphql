const { getUserId } = require('../../utils')

const poll = {
  async createVote(parent, { optionId }, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createPollOptionVote({
      data: {
        option: {
          connect: {
            id: optionId
          }
        },
        user: {
          connect: {
            id: userId
          },
        },
      }
    })
  },
}

module.exports = { poll }
