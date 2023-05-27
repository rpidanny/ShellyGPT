Shelly :robot:
=================

<p align="left">
  <img src="sheldon_mid.png" height="200">
</p>

Welcome to Shelly - the coolest CLI tool around! Ingesting documents and generating instant answers to questions about those documents using ChatGPT, Shelly provides you with the Sheldon Cooper you never had at your fingertips.

<!-- toc -->
* [What is Shelly?](#what-is-shelly)
* [Demo](#demo)
* [Features](#features)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [Command Topics](#command-topics)
* [License](#license)
<!-- tocstop -->

# What is Shelly?

Shelly is a command-line tool that ingests documents into a vector store and generates instant answers to your questions about those documents using ChatGPT. Inspired by the iconic character of Sheldon Cooper from The Big Bang Theory, Shelly brings a fun and quirky vibe to your command-line experience.

With Shelly, you can have the genius mind of Sheldon Cooper at your fingertips, answering all your queries with its powerful GPT-based algorithms. Gone are the days of tirelessly searching for answers, as Shelly provides you with accurate solutions using its advanced machine learning technology.

# Demo

## The Big Bang Theory Trivia

https://user-images.githubusercontent.com/6696862/235325240-ba6df010-d238-411e-b137-55cfea249d2c.mov

## Code: Class Validator

https://user-images.githubusercontent.com/6696862/235344589-c7eaad37-049e-4b63-a89b-e143d81354ca.mov

# Features

- [x] Ingest documents and allows answering questions about those documents
- [x] Web UI

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

1. [Pinecone](https://www.pinecone.io/)
2. [Milvus](https://milvus.io/)

We recommend using **Milvus**, as it offers an API key-free experience and has no limitations on the number of collections you can create.

To get started with Milvus, you can easily create a local instance by running `shelly milvus start` or by using the provided Docker Compose file located at `docker/milvus/docker-compose.yml`.

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
@rpidanny/shelly/1.13.1 linux-x64 node-v18.16.0
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
* [`shelly events`](docs/events.md) - Create iCal events
* [`shelly help`](docs/help.md) - Display help for shelly.
* [`shelly history`](docs/history.md) - Print history
* [`shelly ingest`](docs/ingest.md) - Ingest directory to a vector store
* [`shelly milvus`](docs/milvus.md) - Start local Milvus vector store
* [`shelly serve`](docs/serve.md) - start the Shelly web service

<!-- commandsstop -->

# Data Collection and Analytics

This CLI app only collects essential data for analytics purposes to improve user experience. The information collected includes:

- User's operating system (OS) details (e.g., version, architecture, type)
- App metadata (e.g version, name)
- Id of the command used.

# License

Shelly is released under the MIT License. See the [LICENSE](LICENSE) file for details.
