import { deployments, ethers, network } from "hardhat"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { Raffle, VRFCoordinatorV2Mock } from "../../typechain-types"
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"
import { assert } from "chai"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", async function () {
      let raffle: Raffle
      let raffleContract: Raffle
      let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock
      let raffleEntranceFee: BigInt
      let interval: string
      let player: SignerWithAddress
      let accounts: SignerWithAddress[]

      beforeEach(async () => {
        accounts = await ethers.getSigners() // could also do with getNamedAccounts
        //   deployer = accounts[0]
        player = accounts[1]
        await deployments.fixture(["mocks", "raffle"])
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        raffleContract = await ethers.getContract("Raffle")
        raffle = raffleContract.connect(player)
        raffleEntranceFee = await raffle.getEntranceFee()
        interval = (await raffle.getInterval()).toString()
      })

      describe("constructor", function () {
        it("initializes the raffle correctly", async () => {
          console.log(network.config.chainId)
          // Ideally, we'd separate these out so that only 1 assert per "it" block
          // And ideally, we'd make this check everything
          const raffleState = await raffle.getRaffleState()
          const interval = await raffle.getInterval()
          assert.equal(raffleState.toString(), "0")
          assert.equal(
            interval.toString(),
            networkConfig[network.config.chainId!]["keepersUpdateInterval"],
          )
        })
      })
    })
