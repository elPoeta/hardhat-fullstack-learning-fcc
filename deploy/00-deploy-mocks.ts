import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains } from "../helper-hardhat.config";

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const netName: string = network.name;
  if (developmentChains.includes(netName)) {
    log("Local network deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [8, "2000000000000000000000"],
      log: true,
    });
    log("Mock deployed!");
    log("-----------------------------------------------------------");
  }
};
export default deployMocks;

deployMocks.tags = ["all", "mocks"];
