module.exports = {
  description: 'Feature Generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Feature name',
    },
  ],
  actions: function (data) {
    const subDir = 'features'
    const basePath = `src/${subDir}`
    const actions = [
      {
        type: 'add',
        path: `${basePath}/{{dashCase name}}/index.tsx`,
        templateFile: './templates/feature/index.hbs',
      },
      {
        type: 'add',
        path: `${basePath}/{{dashCase name}}/{{properCase name}}.tsx`,
        templateFile: './templates/feature/feature.hbs',
      },
    ]
    return actions
  },
}
