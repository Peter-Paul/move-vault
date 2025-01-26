import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);
// Account details (use your private key or generate a new account)
const privateKeyHex =
  "0xc3de7c32aa4766427193618d982848e9e2f42041901ab98ab6df5d9f4da41de0";
const privateKeyBytes = PrivateKey.formatPrivateKey(
  privateKeyHex,
  PrivateKeyVariants.Ed25519
);
const privateKey = new Ed25519PrivateKey(privateKeyBytes);
const account = Account.fromPrivateKey({ privateKey });
const accountAddress = account.accountAddress.toString();

const moduleAddress =
  "0x860bf7ab93c6c27bf5768a00d848f566684ae02be34836e8d36293908115f998";
const moduleName = "vault";
const createVaultFunction = `${moduleAddress}::${moduleName}::set_message`;
const getMessageFunction = `${moduleAddress}::${moduleName}::get_message`;
