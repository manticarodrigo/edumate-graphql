const { getUserId } = require('../utils')

const Query = {
  feed(parent, args, ctx, info) {
    return ctx.db.query.posts(null, info)
  },

  post(parent, { id }, ctx, info) {
    return ctx.db.query.post({ where: { id } }, info)
  },

  me(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },
}

module.exports = { Query }