`shelly history`
================

Print history

* [`shelly history`](#shelly-history)

## `shelly history`

Print history

```
USAGE
  $ shelly history [--log-level debug|info|warn|error] [-c <value>]

FLAGS
  -c, --collection=<value>  [default: ShellyDefault] vector collection to use

GLOBAL FLAGS
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>

DESCRIPTION
  Print history

EXAMPLES
  $ shelly history

  $ shelly history --collection=foo
```

_See code: [dist/commands/history/index.ts](https://github.com/rpidanny/shelly/blob/v1.4.0/dist/commands/history/index.ts)_
