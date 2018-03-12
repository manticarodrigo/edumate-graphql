const { getUserId } = require('../../utils')

const poll = {
  async createVote(parent, { optionId }, ctx, info) {
    const userId = getUserId(ctx)
    console.log('received vote mutation for option with id:')
    console.log(optionId)
    return ctx.db.mutation.updatePollOption({
      where: { id: optionId },
      data: {
        votes: {
          connect: [{
            id: userId
          }],
        },
      },
    }, info)
  },
}

module.exports = { poll }
