# Minimal Hello World example on Solana Blockchain

This example is heavily influenced by the official [example-helloworld](https://github.com/solana-labs/example-helloworld),
but a lot more minimal, in order to be understood as fast as possible.


# Solana Program (Smart Contract)
The solana program increments the number of greetings on the account.


### 1. Build
It is a standard Cargo Rust project. You can check by building the Rust project locally.
```console
$ cargo build-bpf
```

### 2. Deploy
Deploy the program with Blockpulsar CI Pipeline as it is described in the official documentation: [docs.blockpulsar.com](https://docs.blockpulsar.com)


# Javascript Client
The Javascript code in the repo interacts with the Blockpulsar Solana Cluster. You need Solana Account's private key dowloaded
from [app.blockpulsar.com/apps](https://app.blockpulsar.com/apps)


### Run Javascript Client
Before starting JavaScript Client make sure you have `.env` file copied from the `.env.sample` file, which contains `API_KEY`, `API_SECRET` and
other options required to run the JavaScript Client.
```console
$ cd client
$ npm i
$ cd ..
$ node /client/src/index.js
```
