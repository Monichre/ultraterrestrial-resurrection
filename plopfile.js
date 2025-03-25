const fs = require('fs')
const path = require('path')
const componentTemplate = require('./templates/app/component/index')
const pageTemplate = require('./templates/app/page/index')
const featureTemplate = require('./templates/app/feature/index')
const {apiTemplate, webhookTemplate} = require('./templates/app/api')

module.exports = function (plop) {
  plop.load('plop-helper-list')

  // Get list of workspaces by reading directories
  const getWorkspaces = () => {
    const workspaces = []

    // Check packages directory
    if (fs.existsSync('packages')) {
      fs.readdirSync('packages').forEach((dir) => {
        workspaces.push(`packages/${dir}`)
      })
    }

    // Check apps directory
    if (fs.existsSync('apps')) {
      fs.readdirSync('apps').forEach((dir) => {
        workspaces.push(`apps/${dir}`)
      })
    }

    return workspaces
  }

  // Add workspace selection to each generator and pass destination directory
  const addWorkspacePrompt = (generator) => {

    console.log("🚀 ~ file: plopfile.js:35 ~ addWorkspacePrompt ~ generator:", generator)

    if (generator.prompts) {
      generator.prompts.unshift({
        type: 'list',
        name: 'workspace',
        message: 'Which workspace would you like to generate in?',
        choices: getWorkspaces(),
      })

      // Add destination directory to generator data
      // const originalActions = generator.actions || []

      // console.log(
      //   '🚀 ~ file: plopfile.js:45 ~ addWorkspacePrompt ~ originalActions:',
      //   originalActions
      // )

      // generator.actions = (data) => {
      //   data.destinationPath = path.join(process.cwd(), data.workspace)
      //   return originalActions
      // }
    }
    return generator
  }

  plop.setGenerator('component', addWorkspacePrompt(componentTemplate))
  plop.setGenerator('page', addWorkspacePrompt(pageTemplate))
  plop.setGenerator('feature', addWorkspacePrompt(featureTemplate))
  plop.setGenerator('api', addWorkspacePrompt(apiTemplate))
  plop.setGenerator('webhook', addWorkspacePrompt(webhookTemplate))
}
