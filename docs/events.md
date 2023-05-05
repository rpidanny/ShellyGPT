`shelly events`
===============

Create iCal events

* [`shelly events create DESCRIPTION`](#shelly-events-create-description)

## `shelly events create DESCRIPTION`

Create iCal events

```
USAGE
  $ shelly events create DESCRIPTION [--json] [--log-level debug|info|warn|error] [-v] [-o <value>]

ARGUMENTS
  DESCRIPTION  The description of the even you want created in natural language

FLAGS
  -o, --outputDir=<value>  [default: ./] Output directory to store the generated iCal event
  -v, --verbose            enable verbose mode

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>

DESCRIPTION
  Create iCal events

EXAMPLES
  $ shelly events create "create a two day travel plan to New York"

  $ shelly events create "create a 3 week running plan for a 5k run starting at Oct 21, 2023"
```
