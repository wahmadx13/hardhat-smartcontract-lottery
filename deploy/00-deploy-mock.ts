import { network, ethers } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains } from "../helper-hardhat-config"

const BASE_FEE = 250000000000000000
const GAS_PRICE_LINK = 1e9

const deployMocks: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deployer } = await getNamedAccounts()
  const { deploy, log } = deployments

  const args = [BASE_FEE, GAS_PRICE_LINK]

  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...")
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args,
    })
    log("Mocks Deployed")
    log("===================================")
  }
}

export default deployMocks
deployMocks.tags = ["all", "mocks"]
