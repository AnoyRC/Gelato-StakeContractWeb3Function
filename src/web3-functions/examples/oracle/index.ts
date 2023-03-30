import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { ethers } from "ethers";

const stakeContractAddress = "0x8590CFD32B4ADcEaD15d498Cf9DE10E51Ef58Eba";
const stakeContractABI = [
  {
    inputs: [
      {
        internalType: "contract TokenERC20",
        name: "_erc20TokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "issueToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "stakeToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "unstakeToken",
    type: "event",
  },
  {
    inputs: [],
    name: "issueTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "stakeTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "stakers",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "stakingInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "stakingBalance",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "hasStaked",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract TokenERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokensPerGETH",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "unstakeTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, gelatoArgs, provider } = context;

  const PRIVATE_KEY = await context.secrets.get("PRIVATE_KEY");
  const ALCHEMY_URL_TESTNET = await context.secrets.get("ALCHEMY_URL_TESTNET");
  const WALLET_ADDRESS = await context.secrets.get("WALLET_ADDRESS");

  if (!PRIVATE_KEY) {
    return {
      canExec: false,
      message: "Private key not set",
    };
  }
  if (!ALCHEMY_URL_TESTNET) {
    return {
      canExec: false,
      message: "URL not set",
    };
  }
  if (!WALLET_ADDRESS) {
    return {
      canExec: false,
      message: "Wallet key not set",
    };
  }

  const newProvider = new ethers.providers.JsonRpcProvider(ALCHEMY_URL_TESTNET);
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const signer = wallet.connect(newProvider);

  const stakeContract = new ethers.Contract(
    stakeContractAddress,
    stakeContractABI,
    newProvider
  );

  const Encoded = stakeContract.interface.encodeFunctionData("issueTokens");
  const txArg = {
    to: stakeContractAddress,
    from: WALLET_ADDRESS,
    data: Encoded,
    gasLimit: ethers.utils.hexlify(1000000),
  };

  const swapDonetx = await signer.sendTransaction(txArg);
  console.log(swapDonetx);

  return {
    canExec: true,
    callData: "stake.encodeFunctionData",
  };
});
