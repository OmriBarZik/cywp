# cypress-for-wordpress [![Test](https://github.com/OmriBarZik/cywp/actions/workflows/tests.yml/badge.svg)](https://github.com/OmriBarZik/cywp/actions/workflows/tests.yml)[![Known Vulnerabilities](https://snyk.io/test/github/OmriBarZik/cywp/badge.svg)](https://snyk.io/test/github/OmriBarZik/cywp)

Cypress-for-wordpres helps you create testing environments for your WordPress plugins and themes.

Cypress is an end-to-end tool. WordPress is the most popular system for building sites. *cypress-for-WordPress* (CYWP) is a wrapper that helps build an entire local WordPress environment with docker and run an end-to-end flow. It is helpful for continuous integration processes and builds.

## Requirement

1. You must have cypress 6.7 or above
2. You must have docker up and running on your system.

## Installation

```bash
npm install --save-dev cypress-for-wordpress
```

Add this at the `index.js` file in the plugin folder.
```js
module.exports = (on, config) => {
  return require('cypress-for-wordpress')(on, config)
}
```

cypress-for-wordpress will analyze the plugin configuration and will set the `baseUrl`. for more info [see Cypress configuration documentation](https://docs.cypress.io/guides/references/configuration#Global).


## Usage 

you can control the wordrpess site and the database right from your tests by using [`cy.task()`](https://docs.cypress.io/api/commands/task).

### General Commands
You can use the general tasks to control the docker containers. please notest that you can only run one process at a time, no process chaining (`&`, `&&`, `|`, or `||`).
#### `wordpress`
the wordpress task connect to the [wordpress contianer](https://hub.docker.com/_/wordpress), execute the given commands and return the stdout and stderr.
##### Example

```js
cy.task('wordpress', ['ls', '/']).then(output => {
  console.log(output.stdout)
  console.log(output.stderr)
})
```
#### `mysql`
the mysql task connect to the [mysql contianer](https://hub.docker.com/_/mysql), execute the given commands and return the stdout and stderr.
##### Example

```js
cy.task('mysql', ['ls', '/']).then(output => {
  console.log(output.stdout)
  console.log(output.stderr)
})
```

#### `wp`
the wp task create a [wp-cli container](https://hub.docker.com/_/wordpress) that connect to the wordpress container, execute the given commands with the `wp` prefix and return the stdout and stderr.
wp-cli contianer is a normal wordpress container with the [wp-cli](https://wp-cli.org/) tool available. for more more info about how to use wp cli please see the [WP CLI documentation site](https://developer.wordpress.org/cli/commands/)
##### Example

```js
cy.task('wp', ['cli', 'info']).then(output => {
  console.log(output.stdout)
  console.log(output.stderr)
})
```

### WP-CLI Tasks
We have made a tasks presets for some of WP-CLI commansds.

there are 3 types of presets

1. general command prestes (plugin, theme, user, etc...) with the prefix `wp:`
   those commands are like
#### Plugins
The `wp:plugin` task will create a wp-cli container with the plugin preset

#### Examples
```js
describe('wordpress check', () => {
  it('should execute commands on wordpress',() => {

    cy.task('wordpress', ['ls', '/']).then(files => {
      cy.log(files);
    });

    cy.task('wp:plugin:install', {plugin: 'elementor', activate: true})


    cy.task('wp:theme:isInstalled', 'twentytwenty')
  })
```
for the full list of apis please check out the [API section](#API)

## Configuration

You can configure your site by using the following configuration in your `cypress.json` file.

#### Example
```jsonc
{
  "wordpressVersion": "latest", // WordPress version of the site.
  "wordpressPort": "8000", // On waht port the site will be expose.
  "wordpressTheme": "twentytwenty", // The theme of the site.
  "wordpressThemeVersion": "latest", // Version of the theme.
  "wordpressThemePath": "/path/to/theme", // Uses localy installed theme.
  "wordpressPlugins": { // List of plugins you want to be installed on the site.
     "LocalPlugin": "./", // Relative path to localy installed plugin.
     "OtherLocalPlugin": "/path/to/plugin/LocalPlugin", // Absulute Path to localy installed plugin.
     "RemotePlugin": "1.0.0", // Version of the plugins the runner will install automatically.
     "OtherRemotePlugin": "latest" // Use the latest version available.
  }
}
```
### wordpressVersion
#### Default `latest`
Sets the WordPress version on the site. 
### wordpressPort
#### Default `8000`
Sets on which port the site will be expose.
### wordpressTheme
#### Default `twentytwenty`
Sets the theme of the site.
### wordpressThemePath
#### Default `latest`
Sets the theme's version.
### wordpressThemePath
#### Default `none`
Path to localy installed theme.
This option enebale you to test your own theme on a vertual site.

If this config is set, the plugin will create a bind between the given path and the docker container. The `wordpressThemePath` config will be ignored.
This path must contain a theme with the same name as mentioned at `wordpressTheme`.
### wordpressPlugins
#### Default `none`
Object the that contains two types of plugins.
#### Local Plugins
You set the local plugins bypassing its path. The plugin's name must be the same as the parameter.

You can use relative and absolute paths.
```jsonc
{
  "wordpressPlugins": {
    "LocalPath": "./", // To expose current project to the docker contianer.
    "otherLocalPath": "/path/to/plugin/" // This path contians otherLocalPath.php
}
```

#### Remote Plugins
Remote plugins are plugins that will be downloaded from the WordPress official site, installed, and activated on the site.

You add remote plugins bypassing the wanted version.
```jsonc
{
  "wordpressPlugins": {
    "remotePlugin": "latest", // Install the latest version available. 
    "otherRemotePlugin": "1.3.5" // Install a spesific version.
  }
}
```

### Docker Pull Skip
To skip docker pull just need to set the environment variable `cypress_skip_pull` to 1.
```bash
cypress_skip_pull=1 npm run test
```

## API
this aria sohw the full list of API avilble.
### contianers
Controlling the docker contianers
#### wordpress
exsecute commands on the wordpress contianer.
```js 
cy.task('wordpress', <commands>)
```
##### arguments
1. {string[]} commands - commands to exsecute on the container

#### mysql
exsecute commands on the wordpress contianer.
```js 
cy.task('mysql', <commands>)
```
##### arguments
1. {string[]} commands - commands to exsecute on the container

#### wp
create a temperery wp-cli contianer that connect to the wordpress contianer and excexute the give commands. 
```js 
cy.task('wp', <commands>)
```
##### arguments
1. {string[]} commands - commands to exsecute on the container
