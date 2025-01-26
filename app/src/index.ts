import {
  Account,
  Ed25519PrivateKey,
  PrivateKey,
  Network,
  Aptos,
  AptosConfig,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";

// Initialize Aptos Client (Testnet endpoint)
const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

// Account details (use your private key or generate a new account)
const privateKeyHex = ""; // Replace with your private key
const privateKeyBytes = PrivateKey.formatPrivateKey(
  privateKeyHex,
  PrivateKeyVariants.Ed25519
);
const privateKey = new Ed25519PrivateKey(privateKeyBytes);
const account = Account.fromPrivateKey({ privateKey });
const accountAddress = account.accountAddress.toString();

console.log("Account Address:", accountAddress);

// Module and function details
const moduleAddress =
  "0x860bf7ab93c6c27bf5768a00d848f566684ae02be34836e8d36293908115f998";
const moduleName = "vault";
const createVaultFunction = `${moduleAddress}::${moduleName}::create_vault`;
const depositFunction = `${moduleAddress}::${moduleName}::deposit`;
const removeFunction = `${moduleAddress}::${moduleName}::remove`;
const getBalanceFunction = `${moduleAddress}::${moduleName}::get_balance`;

// Helper: Create a vault
async function createVault(account: Account, coinType: string) {
  console.log("Creating Vault...");

  const transaction = await aptos.transaction.build.simple({
    sender: account.accountAddress.toString(),
    data: {
      function: createVaultFunction,
      typeArguments: [coinType], // Specify the coin type (e.g., `0x1::aptos_coin::AptosCoin`)
      functionArguments: [],
    },
  });

  const pendingTransaction = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction,
  });

  console.log("Pending Transaction Hash:", pendingTransaction.hash);

  const executedTransaction = await aptos.waitForTransaction({
    transactionHash: pendingTransaction.hash,
  });

  console.log("Vault Created:", executedTransaction);
}

// Helper: Deposit coins into the vault
async function deposit(
  account: Account,
  vaultAddress: string,
  coinType: string,
  amount: number
) {
  console.log("Depositing Coins...");

  const transaction = await aptos.transaction.build.simple({
    sender: account.accountAddress.toString(),
    data: {
      function: depositFunction,
      typeArguments: [coinType],
      functionArguments: [vaultAddress, amount], // Deposit `amount` coins
    },
  });

  const pendingTransaction = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction,
  });

  console.log("Pending Transaction Hash:", pendingTransaction.hash);

  const executedTransaction = await aptos.waitForTransaction({
    transactionHash: pendingTransaction.hash,
  });

  console.log("Deposit Completed:", executedTransaction);
}

// Helper: Withdraw coins from the vault
async function remove(
  account: Account,
  vaultAddress: string,
  coinType: string,
  amount: number
) {
  console.log("Withdrawing Coins...");

  const transaction = await aptos.transaction.build.simple({
    sender: account.accountAddress.toString(),
    data: {
      function: removeFunction,
      typeArguments: [coinType],
      functionArguments: [vaultAddress, amount], // Withdraw `amount` coins
    },
  });

  const pendingTransaction = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction,
  });

  console.log("Pending Transaction Hash:", pendingTransaction.hash);

  const executedTransaction = await aptos.waitForTransaction({
    transactionHash: pendingTransaction.hash,
  });

  console.log("Withdrawal Completed:", executedTransaction);
}

// Helper: Get the vault balance
async function getBalance(vaultAddress: string, coinType: string) {
  console.log("Getting Vault Balance...");

  const balance = await aptos.view({
    payload: {
      function: getBalanceFunction,
      typeArguments: [coinType],
      functionArguments: [vaultAddress],
    },
  });

  console.log("Vault Balance:", balance);
  return balance;
}

const coinType = "0x1::aptos_coin::AptosCoin"; // Replace with your coin type

// Create a vault
createVault(account, coinType);

// Deposit coins (replace `amount` with a valid value)
const depositAmount = 100; // Example: Deposit 100 coins
deposit(account, accountAddress, coinType, depositAmount);

// Check vault balance
getBalance(accountAddress, coinType);

// Withdraw coins (replace `withdrawAmount` with a valid value)
const withdrawAmount = 50; // Example: Withdraw 50 coins
remove(account, accountAddress, coinType, withdrawAmount);

// Check vault balance again
getBalance(accountAddress, coinType);
