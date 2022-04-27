# Minimal Hello World example on Solana Blockchain

This example is heavily influenced by the official [example-helloworld](https://github.com/solana-labs/example-helloworld), but a lot more minimal, in order to be understood as fast as possible.
Using Blockpulsar's deployment pipeline and Solana Cluster endpoints, this repository contains JavaScript client, which is going to interact with deployed smart contract.

# Program (Smart Contract)
Increments the number of greetings on the account.


### Build the program locally:

It is standard Cargo Rust project, which you can check basic typing errors locally by just building Rust Project

```console
$ cargo build-bpf
```

### Deploy the program:

Deploying programs with Blockpulsar CI Pipeline as it is described in [docs.blockpulsar.com](https://docs.blockpulsar.com)

- Create new App in [app.blockpulsar.com](https://app.blockpulsar.com/apps)
- Copy "App Id" and place it in `blockpulsar.json`
- Copy Api Key and Api Secret to use it in commands below

```console
$ git remote add bp https://<api_key>:<api_secret>@ci.blockpoulsar.com/git

$ git push bp master

Enumerating objects: 38, done.
Counting objects: 100% (38/38), done.
Delta compression using up to 8 threads
Compressing objects: 100% (24/24), done.
Writing objects: 100% (38/38), 56.99 KiB | 56.99 MiB/s, done.
Total 38 (delta 11), reused 31 (delta 9), pack-reused 0
remote: Getting Solana account keys
remote:
remote: Solana Keys been loded successfully!
remote: Blockpulsar CI starts build process...
...
...
...
```

# Javascript Client
Interacts with the on-chain program where you need Solana Account private key dowloaded from [app.blockpulsar.com/apps](https://app.blockpulsar.com/apps)

### Start the client:

Before starting JavaScript client we have to make sure we have `.env` file copied from .env.sample file, which contains API_KEY, API_SECRET and other options
required to run JavaScript Client.

```console
$ cd client
$ npm i
$ cd ..
$ node /client/src/index.js
```