const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const healthChain = await deploy("HealthChain", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log(`Contract deployed at ${healthChain.address}`);
    log("---------------------------");

    //verify smart contract on etherscan
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(healthChain.address, []);
    }
}
module.exports.tags = ["all", "healthchain"]