const { getUserId } = require('../../utils')

const post = {
  async createPost(parent, { text, imageUrl, poll }, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createPost({
      data: {
        text,
        imageUrl,
        poll,
        author: {
          connect: {
            id: userId
          },
        },
      },
    }, info)
  },

  async deletePost(parent, { id }, ctx, info) {
    const userId = getUserId(ctx)
    const postExists = await ctx.db.exists.Post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return ctx.db.mutation.deletePost({ where: { id } })
  },
}

module.exports = { post }
