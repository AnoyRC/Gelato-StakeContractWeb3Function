import dotenv from "dotenv";
import { ethers } from "ethers";
import { AutomateSDK } from "@gelatonetwork/automate-sdk";
import { Web3FunctionBuilder } from "@gelatonetwork/web3-functions-sdk/builder";
dotenv.config();

if (!process.env.PRIVATE_KEY) throw new Error("Missing env PRIVATE_KEY");
const pk = process.env.PRIVATE_KEY;

if (!process.env.PROVIDER_URL) throw new Error("Missing env PROVIDER_URL");
const providerUrl = process.env.PROVIDER_URL;

// Default Setting
const chainId = 5;
const adBoardAddress = "0x28a0A1C63E7E8F0DAe5ad633fe232c12b489d5f0";
const adBoardAbi = [
  "function postMessage(string)",
  "function viewMessage(address)",
];

const main = async () => {
  // Instanciate provider & signer
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(pk as string, provider);
  const automate = new AutomateSDK(chainId, wallet);

  // Deploy Web3Function on IPFS
  console.log("Deploying Web3Function on IPFS...");
  const web3Function =
    "./src/web3-functions/examples/advertising-board/index.ts";
  const cid = await Web3FunctionBuilder.deploy(web3Function);
  console.log(`Web3Function IPFS CID: ${cid}`);

  // Create task using automate-sdk
  console.log("Creating automate task...");
  const adBoardInterface = new ethers.utils.Interface(adBoardAbi);
  const { taskId, tx } = await automate.createTask({
    name: "Web3Function - Ad Board",
    execAddress: adBoardAddress,
    execSelector: adBoardInterface.getSighash("postMessage"),
    dedicatedMsgSender: true,
    web3FunctionHash: cid,
    web3FunctionArgs: {},
  });
  await tx.wait();
  console.log(`Task created, taskId: ${taskId} (tx hash: ${tx.hash})`);
  console.log(
    `> https://beta.app.gelato.network/task/${taskId}?chainId=${chainId}`
  );
};

main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
