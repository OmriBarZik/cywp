# cypress-for-wordpress
Help you create testing environments to your wordpress plugins and themes.
## prerequirement
1. you must have cypress 6.7 or above
2. you must have docker up and running on your system.
## installation
```bash
npm install --dave-save cypress-for-wordpress
```

## Configuration
you can constomize your site by using the folling configeration in youe `cypress.json` file.
#### example
```jsonc
{
  "wordpressVersion": "latest", // WordPress version of the site.
  "wordpressPort": "8000", // On waht port the site will be expose.
  "wordpressTheme": "twentytwenty", // The theme ofthe site.
  "wordpressThemeVersion": "latest", // Version of the theme.
  "wordpressThemePath": "/path/to/theme", // Make the Site to use localy installed theme.
  "wordpressPlugins": { // List of the plugin you want to install on your site.
     "LocalPlugin": "./",
     "OtherLocalPlugin": "/path/to/plugin/LocalPlugin", // Path to locally installed plugin.
     "RemotePlugin": "1.0.0", // Version of the plugins the runner will install automatically.
     "OtherRemotePlugin": "latest"
  }
}
```
### wordpressVersion
#### default `latest`
This set the wordpress version your site will run on. 
### wordpressPort
#### default `8000`
Sets what port your site will be expose.
### wordpressTheme
#### default `twentytwenty`
What theme should the site run on.
### wordpressThemePath
#### default `latest`
What version of the theme run on.
### wordpressThemePath
#### default `none`
Path to localy installed theme.
this option enebale you to test your own theme on a vertual site.

If this config is set the pluign will create a bind betwin the given path and the docker container and ignore the `wordpressThemePath` config. 
this path must contain a theme with the same name as you set at `wordpressTheme`
### wordpressPlugins
#### default `none`
Object the that containes two types of plugins.
#### Local Plugins
You set local plugin by passing its path. Its very importent that the plugin's name wiil be the same as the parameter

you can use relative and absolute paths. 
```jsonc
{
  "wordpressPlugins": {
    "LocalPath": "./", // To expose current project to the docker contianer.
    "otherLocalPath": "/path/to/plugin/" // this path contians otherLocalPath.php
}
```

#### Remote Plugins
Remote plugins are plugins that will be download from wordpress official site, install and activate on the site.

You set remote plugins by passeing the wanted version
```jsonc
{
  "wordpressPlugins": {
    "remotePlugin": "latest", // To install latest version available. 
    "otherRemotePlugin": "1.3.5" // To install spesific version.
  }
}
```
