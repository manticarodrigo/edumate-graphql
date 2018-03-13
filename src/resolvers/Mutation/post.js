const { getUserId } = require('../../utils')
const { processUpload } = require('../../modules/fileApi')

const post = {
  async createPost(parent, { text, files, pollOptions }, ctx, info) {
    const userId = getUserId(ctx)
    const images = files && files.length > 0 ? { create: await Promise.all(files.map(file => processUpload(file, ctx))) } : null
    const poll = pollOptions && pollOptions.length > 0 ? { create: { options: { create: pollOptions.map(option => { return { name: option } }) } } } : null
    return ctx.db.mutation.createPost({
      data: {
        text,
        images,
        poll,
        author: { connect: { id: userId },
        },
      },
    }, info)
    return null
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
