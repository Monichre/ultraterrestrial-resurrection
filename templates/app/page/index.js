module.exports = {
  description: 'Page Generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Page name',
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'src/app/{{name}}/page.tsx',
      templateFile: './templates/page/page.hbs',
    },
  ],
}
