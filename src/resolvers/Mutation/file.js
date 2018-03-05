const { getUserId } = require('../../utils')

const file = {
  async renameFile(parent, { id, name }, ctx, info) {
    return ctx.db.mutation.updateFile({ data: { name }, where: { id } }, info)
  },

  async deleteFile(parent, { id }, ctx, info) {
    return await ctx.db.mutation.deleteFile({ where: { id } }, info)
  },
}

module.exports = { file }