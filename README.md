Shelly :robot:
=================

<p align="left">
  <img src="sheldon_mid.png" height="200">
</p>

Welcome to Shelly - the coolest CLI tool around! Ingesting data and generating instant answers using ChatGPT, Shelly provides you with the Sheldon Cooper you never had at your fingertips.

<!-- toc -->
* [What is Shelly?](#what-is-shelly)
* [Features](#features)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [Command Topics](#command-topics)
* [Credits](#credits)
* [License](#license)
<!-- tocstop -->

# What is Shelly?

Shelly is a command-line tool that ingests data into a vector store and generates instant answers to your questions using ChatGPT. Inspired by the iconic character of Sheldon Cooper from The Big Bang Theory, Shelly brings a fun and quirky vibe to your command-line experience.

With Shelly, you can have the genius mind of Sheldon Cooper at your fingertips, answering all your queries with its powerful GPT-based algorithms. Gone are the days of tirelessly searching for answers, as Shelly provides you with accurate solutions using its advanced machine learning technology.

# Demo

## Big Bang Theory Trivia

https://user-images.githubusercontent.com/6696862/235325240-ba6df010-d238-411e-b137-55cfea249d2c.mov

# Features

- [x] Ingest data into a vector store
- [x] Generate instant answers to your questions using ChatGPT

## Roadmap

- [ ] Save interaction history
- [ ] Web portal

# Installation

To get started with Shelly, you can install it via npm using the following command:

```bash
npm i -g @rpidanny/shelly
```

Alternatively, you can download installers for `Windows`, `Linux`, and `macOS` from the [release page](https://github.com/rpidanny/shelly/releases).

# Configuration

After installing Shelly, you need to configure it using the following command:

```bash
shelly configure
```

This command will prompt you to add your OpenAI keys and vector store configurations. 

## Vector Store Options

Shelly supports two options for the vector store:

1. Pinecone
2. Milvus

If you choose to use Milvus, you can create a local Milvus instance using the provided Docker Compose file located at `docker/milvus/docker-compose.yml`.

To create the local Milvus instance, run the following command:

```bash
cd docker/milvus
docker-compose up -d
```

# Usage
<!-- usage -->
```sh-session
$ npm install -g @rpidanny/shelly
$ shelly COMMAND
running command...
$ shelly (--version)
@rpidanny/shelly/0.0.0 darwin-arm64 node-v18.14.0
$ shelly --help [COMMAND]
USAGE
  $ shelly COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
# Command Topics

* [`shelly ask`](docs/ask.md) - Ask questions or instruct shelly to do something.
* [`shelly config`](docs/config.md) - Get currently set configs
* [`shelly configure`](docs/configure.md) - Configure shelly
* [`shelly help`](docs/help.md) - Display help for shelly.
* [`shelly ingest`](docs/ingest.md) - Ingest directory to a vector store

<!-- commandsstop -->

# Credits

Shelly was created by [rpidanny](https://github.com/rpidanny) and is inspired by the iconic character of Sheldon Cooper from The Big Bang Theory.

# License

Shelly is released under the MIT License. See the [LICENSE](LICENSE) file for details.
