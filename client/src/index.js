const web3 = require("@solana/web3.js");
const borsh = require("borsh");

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

let payerArray = Uint8Array.from([50, 226, 171, 241, 186, 117, 161, 168, 246, 134, 107, 157, 85, 216, 141, 11, 62, 216, 67, 186, 194, 169, 154, 216, 221, 178, 83, 48, 187, 227, 116, 52, 32, 30, 209, 137, 82, 65, 65, 1, 170, 197, 248, 31, 178, 86, 9, 15, 155, 97, 230, 189, 51, 169, 113, 179, 231, 73, 19, 200, 175, 171, 217, 225]);
const payer = web3.Keypair.fromSecretKey(payerArray);

const programPubKey = new web3.PublicKey(require('../../blockpulsar.json').app_id); // Replace with your own public program id key.
const GREETING_SEED = "hello";

class GreetingAccount {
    counter = 0;
    constructor(fields) {
        if (fields) {
            this.counter = fields.counter;
        }
    }
}

const GreetingSchema = new Map([
    [GreetingAccount, {
        kind: 'struct',
        fields: [
            ['counter', 'u32']
        ]
    }]
])

const GREETING_SIZE = borsh.serialize(GreetingSchema, new GreetingAccount()).length;

const connection = new web3.Connection(`https://api.bloclpulsar.com/sol-dev/?key=${API_KEY}&secret=${API_SECRET}`);

async function createAccountWithLamports(lamports = 1000000, ) {
    let account = new web3.Keypair();
    let signature = await connection.requestAirdrop(account.publicKey, lamports);

    await connection.confirmTransaction(signature);
    return account;
}

async function createPayer() {
    // Use placeholder payer:
    return payer;

    // Determine fees
    // let fees = 0;

    // fees += await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

    // let { feeCalculator } = await connection.getRecentBlockhash();
    // fees += feeCalculator.lamportsPerSignature * 100;

    // let payerAccount = createAccountWithLamports(fees);

    // return payerAccount;
}

async function getGreetAccount(payerAccount) {
    // greeted account, always the same for the same:
    // payer account, seed, program public key.
    // it is pretty poggers in my opinion.
    let greetPubKey = await web3.PublicKey.createWithSeed(
        payerAccount.publicKey,
        GREETING_SEED,
        programPubKey
    );

    // create new account if it does not already exist.
    if (await connection.getAccountInfo(greetPubKey) === null) {
        let transaction = new web3.Transaction().add(
            web3.SystemProgram.createAccountWithSeed({
                fromPubkey: payerAccount.publicKey,
                basePubkey: payerAccount.publicKey,
                seed: GREETING_SEED,
                newAccountPubkey: greetPubKey,
                lamports: await connection.getMinimumBalanceForRentExemption(GREETING_SIZE),
                space: GREETING_SIZE,
                programId: programPubKey
            })
        )

        await web3.sendAndConfirmTransaction(connection, transaction, [payerAccount]);
    };

    return greetPubKey;
}

async function sayHello(payerAccount, greetPubKey) {
    let instruction = new web3.TransactionInstruction({
        keys: [{ pubkey: greetPubKey, isSigner: false, isWritable: true }],
        programId: programPubKey,
        data: Buffer.alloc(0),
    });

    return await web3.sendAndConfirmTransaction(
        connection,
        new web3.Transaction().add(instruction),
        // Signers:
        [payerAccount]);
}

async function getHelloCount(greetPubKey) {
    let greetAccountInfo = await connection.getAccountInfo(greetPubKey);

    console.log(greetAccountInfo.data);

    let greeting = borsh.deserialize(
        GreetingSchema,
        GreetingAccount,
        greetAccountInfo.data
    );

    console.log(greetPubKey.toBase58(), "has", greeting.counter, "hello's");
}

async function main() {
    let payerAccount = await createPayer();

    let greetPubKey = await getGreetAccount(payerAccount);

    await sayHello(payerAccount, greetPubKey);

    await getHelloCount(greetPubKey);
}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
);