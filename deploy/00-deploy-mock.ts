import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains } from "../helper-hardhat-config"

const deployMocks: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deployer } = await getNamedAccounts()
  const { deploy, log } = deployments

  const chainId = network.config.chainId

  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...")
  }
}

export default deployMocks
deployMocks.tags = ["all", "mocks"]
