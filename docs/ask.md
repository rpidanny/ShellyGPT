`shelly ask`
============

Ask questions or instruct shelly to do something.

* [`shelly ask QUESTION`](#shelly-ask-question)

## `shelly ask QUESTION`

Ask questions or instruct shelly to do something.

```
USAGE
  $ shelly ask QUESTION [--json] [--log-level debug|info|warn|error] [-v] [-c <value>]

ARGUMENTS
  QUESTION  The question you want answered

FLAGS
  -c, --collection=<value>  [default: ShellyDefault] vector collection to use
  -v, --verbose             enable verbose mode

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>

DESCRIPTION
  Ask questions or instruct shelly to do something.

EXAMPLES
  $ shelly ask --collection=foo "how do i do something?"
```

_See code: [dist/commands/ask/index.ts](https://github.com/rpidanny/shelly/blob/v1.7.7/dist/commands/ask/index.ts)_
