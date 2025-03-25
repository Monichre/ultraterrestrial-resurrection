module.exports = {
  description: 'NextJS Webhook Generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'webhook resource name',
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'src/app/api/webhooks/{{name}}/route.ts',
      templateFile: './templates/api/webhook/api.webhook.hbs',
    },
  ],
}
