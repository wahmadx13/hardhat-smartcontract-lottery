import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { ethers, network } from "hardhat"
import {
  developmentChains,
  networkConfig,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config"
import verify from "../utils/verify"

const VRF_SUB_FUND_AMOUNT = ethers.parseEther("30")

const deployRaffle: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  let vrfCoordinatorV2Address: string | undefined,
    vrfCoordinatorV2Mock: any,
    subscriptionId: string | undefined

  if (developmentChains.includes(network.name)) {
    const signer = await ethers.getSigner(deployer)
    vrfCoordinatorV2Mock = await deployments.get("VRFCoordinatorV2Mock")
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address

    // Properly initialize the contract instance
    const vrfCoordinatorInstance = await ethers.getContractAt(
      "VRFCoordinatorV2Mock",
      vrfCoordinatorV2Mock.address,
      signer,
    )

    // Create subscription
    const transactionResponse = await vrfCoordinatorInstance.createSubscription()
    const transactionReceipt = await transactionResponse.wait(1)
    subscriptionId = BigInt(transactionReceipt!.logs[0].topics[1]).toString()

    console.log("SubscriptionId", subscriptionId)

    // Fund the subscription using the contract instance
    await vrfCoordinatorInstance.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId!]["vrfCoordinatorV2"]
    subscriptionId = networkConfig[chainId!]["subscriptionId"]
  }

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  const args: any = [
    vrfCoordinatorV2Address,
    networkConfig[network.config.chainId!]["raffleEntranceFee"],
    networkConfig[network.config.chainId!]["gasLane"],
    subscriptionId,
    networkConfig[network.config.chainId!]["callbackGasLimit"],
    networkConfig[network.config.chainId!]["keepersUpdateInterval"],
  ]
  const raffle = await deploy("Raffle", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: waitBlockConfirmations,
  })

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying ...")
    await verify(raffle.address, args)
  }
  log("===============================")
}

export default deployRaffle
deployRaffle.tags = ["all", "raffle"]
