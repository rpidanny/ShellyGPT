`shelly ingest`
===============

Ingest directory to a vector store

* [`shelly ingest DIR`](#shelly-ingest-dir)

## `shelly ingest DIR`

Ingest directory to a vector store

```
USAGE
  $ shelly ingest DIR [--json] [--log-level debug|info|warn|error] [-v] [-c <value>] [-s] [-t <value>] [-o
    <value>]

ARGUMENTS
  DIR  directory to ingest

FLAGS
  -c, --collection=<value>    [default: ShellyDefault] Name of the collection to use
  -o, --chunkOverlap=<value>  [default: 50] Number of tokens to overlap per chunk
  -s, --split                 Wether to split documents into chunks or not
  -t, --chunkSize=<value>     [default: 400] The size of individual chunks. (Measured in tiktokens)
  -v, --verbose               Enable verbose mode

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>

DESCRIPTION
  Ingest directory to a vector store

EXAMPLES
  $ shelly ingest --collection=foo ./data
```

_See code: [dist/commands/ingest/index.ts](https://github.com/rpidanny/shelly/blob/v0.0.0/dist/commands/ingest/index.ts)_
