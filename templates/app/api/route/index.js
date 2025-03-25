module.exports = {
  description: 'NextJS Api Route Generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'api route/resource name',
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'src/app/api/{{name}}/route.ts',
      templateFile: './templates/api/route/api.route.hbs',
    },
  ],
}
