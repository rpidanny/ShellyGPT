`shelly ingest`
===============

Ingest directory to a vector store

* [`shelly ingest`](#shelly-ingest)

## `shelly ingest`

Ingest directory to a vector store

```
USAGE
  $ shelly ingest [--json] [--log-level debug|info|warn|error] [-v] [-D] [-c <value>] [-s] [-t <value>] [-o
    <value>] [-d <value>] [-g <value>] [-b <value>] [-f <value>]

FLAGS
  -D, --dryRun                Enable dry run that doesn't ingest data
  -b, --githubBranch=<value>  [default: main] The git branch you want to ingest
  -c, --collection=<value>    [default: ShellyDefault] Name of the collection to use
  -d, --dir=<value>           Path of the directory to ingest
  -f, --file=<value>          Path of the file to ingest
  -g, --githubRepo=<value>    URL of a GitHub repo to ingest (https)
  -o, --chunkOverlap=<value>  [default: 50] Number of tokens to overlap per chunk
  -s, --split                 Enable split of documents into chunks
  -t, --chunkSize=<value>     [default: 400] The size of individual chunks. (Measured in tiktokens)
  -v, --verbose               Enable verbose mode

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>

DESCRIPTION
  Ingest directory to a vector store

EXAMPLES
  $ shelly ingest --collection=foo --dir="./data"

  $ shelly ingest --collection=foo --file="./shelly/README.md"

  $ shelly ingest --collection=foo --file="./shelly/README.md" --dir="./data"

  $ shelly ingest --collection=foo --dryRun --dir="./data"

  $ shelly ingest --collection=foo --split --dir="./data"

  $ shelly ingest --collection=foo --split --chunkSize=500 --chunkOverlap=50 --dir="./data"

  $ shelly ingest --collection=foo --githubRepo="https://github.com/rpidanny/shelly"
```

_See code: [dist/commands/ingest/index.ts](https://github.com/rpidanny/shelly/blob/v1.7.7/dist/commands/ingest/index.ts)_
