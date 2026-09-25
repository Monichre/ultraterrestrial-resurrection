// Stub for db client when running Storybook

class Chainable {
  filter(_: any = {}) { return this }
  sort(_: any = null, __: any = null) { return this }
  select(_: any = null) { return this }
  async getPaginated(_: any = {}) { return { records: [], aggs: {} } }
  async getAll() { return [] as any }
  async aggregate(_: any = {}, __: any = {}) { return { aggs: {} } as any }
}

const table = () => new Chainable()

export const xata = {
  db: new Proxy({}, {
    get: () => table()
  }),
  records: {
    async search(_: any) { return { records: [] } }
  }
}

export default xata

