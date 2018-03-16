const { getUserId } = require('../utils')

const Query = {
  user(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },

  file(parent, { id }, context, info) {
    return context.db.query.file({ where: { id } }, info)
  },
  
  files(parent, args, context, info) {
    return context.db.query.files(args, info)
  },

  feed(parent, args, ctx, info) {
    return ctx.db.query.posts({ orderBy: 'createdAt_DESC' }, info)
  },

  post(parent, { id }, ctx, info) {
    return ctx.db.query.post({ where: { id } }, info)
  },
}

module.exports = { Query }