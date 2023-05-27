`shelly serve`
==============

start the Shelly web service

* [`shelly serve`](#shelly-serve)

## `shelly serve`

start the Shelly web service

```
USAGE
  $ shelly serve -c <value> [--json] [--log-level debug|info|warn|error] [-v] [-p <value>]

FLAGS
  -c, --collection=<value>  (required) vector collection to use
  -p, --port=<value>        [default: 3000] the port number to run the server on
  -v, --verbose             enable verbose mode

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>

DESCRIPTION
  start the Shelly web service

EXAMPLES
  $ shelly serve
```

_See code: [dist/commands/serve/index.ts](https://github.com/rpidanny/shelly/blob/v1.14.0/dist/commands/serve/index.ts)_
