import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import { networkConfig, developmentChains } from "../helper-hardhat.config";
import { verify } from "../utils/verify";

const deployFundMe: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId!;
  const netName: string = network.name;
  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(netName)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  const args = [ethUsdPriceFeedAddress];
  const fundMe: DeployResult = await deploy("FundMe", {
    from: deployer,
    args,
    log: true,
  });
  if (!developmentChains.includes(netName) && process.env.ETHERSCAN_API_KEY) {
    verify(fundMe.address, args);
  }
  log("-----------------------------------------------------");
};
export default deployFundMe;
deployFundMe.tags = ["all", "fundme"];
