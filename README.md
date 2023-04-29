Shelly
=================

A command-line tool that ingests data into a vector store and generates GPT-based answers, giving you the Sheldon Cooper you never had at your fingertips.

# Installation

You can install Shelly using npm by running the following command:

```bash
npm i -g @rpidanny/shelly
```

Alternatively, you can download the installer for your operating system (Windows, Linux, or Mac) from the release page.

# Configuration

After installing Shelly, you need to configure it using the following command:

```bash
shelly configure
```

This command will prompt you to add your OpenAI keys and vector store configurations. 

## Vector Store Options

Shelly provides two options for the vector store - Pinecone and Milvus. If you choose Milvus, you can create a local Milvus instance using the docker-compose.yml file located in the `docker/milvus` directory. To create the local Milvus instance, run the following command:

```bash
cd docker/milvus
docker-compose up -d
```

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g shelly
$ shelly COMMAND
running command...
$ shelly (--version)
shelly/0.0.0 darwin-arm64 node-v18.14.0
$ shelly --help [COMMAND]
USAGE
  $ shelly COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`shelly hello PERSON`](#shelly-hello-person)
* [`shelly hello world`](#shelly-hello-world)
* [`shelly help [COMMANDS]`](#shelly-help-commands)
* [`shelly plugins`](#shelly-plugins)
* [`shelly plugins:install PLUGIN...`](#shelly-pluginsinstall-plugin)
* [`shelly plugins:inspect PLUGIN...`](#shelly-pluginsinspect-plugin)
* [`shelly plugins:install PLUGIN...`](#shelly-pluginsinstall-plugin-1)
* [`shelly plugins:link PLUGIN`](#shelly-pluginslink-plugin)
* [`shelly plugins:uninstall PLUGIN...`](#shelly-pluginsuninstall-plugin)
* [`shelly plugins:uninstall PLUGIN...`](#shelly-pluginsuninstall-plugin-1)
* [`shelly plugins:uninstall PLUGIN...`](#shelly-pluginsuninstall-plugin-2)
* [`shelly plugins update`](#shelly-plugins-update)

## `shelly hello PERSON`

Say hello

```
USAGE
  $ shelly hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/rpidanny/shelly/blob/v0.0.0/dist/commands/hello/index.ts)_

## `shelly hello world`

Say hello world

```
USAGE
  $ shelly hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ shelly hello world
  hello world! (./src/commands/hello/world.ts)
```

## `shelly help [COMMANDS]`

Display help for shelly.

```
USAGE
  $ shelly help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for shelly.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `shelly plugins`

List installed plugins.

```
USAGE
  $ shelly plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ shelly plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.6/src/commands/plugins/index.ts)_

## `shelly plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ shelly plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ shelly plugins add

EXAMPLES
  $ shelly plugins:install myplugin 

  $ shelly plugins:install https://github.com/someuser/someplugin

  $ shelly plugins:install someuser/someplugin
```

## `shelly plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ shelly plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ shelly plugins:inspect myplugin
```

## `shelly plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ shelly plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ shelly plugins add

EXAMPLES
  $ shelly plugins:install myplugin 

  $ shelly plugins:install https://github.com/someuser/someplugin

  $ shelly plugins:install someuser/someplugin
```

## `shelly plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ shelly plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ shelly plugins:link myplugin
```

## `shelly plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ shelly plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ shelly plugins unlink
  $ shelly plugins remove
```

## `shelly plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ shelly plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ shelly plugins unlink
  $ shelly plugins remove
```

## `shelly plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ shelly plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ shelly plugins unlink
  $ shelly plugins remove
```

## `shelly plugins update`

Update installed plugins.

```
USAGE
  $ shelly plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->

## License

Shelly is released under the MIT License. See the [LICENSE](LICENSE) file for details.
