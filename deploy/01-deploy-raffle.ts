import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { ethers, network } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"

const deployRaffle: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  let vrfCoordinatorV2Address: string | undefined

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
    vrfCoordinatorV2Address = await vrfCoordinatorV2Mock.getAddress()
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId!]["vrfCoordinatorV2"]
  }

  const args: any = []
  const raffle = await deploy("Raffle", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  })
}

export default deployRaffle
deployRaffle.tags = ["all", "raffle"]
