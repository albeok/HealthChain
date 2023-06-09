const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const healthchain = await ethers.getContract("HealthChain")
    fs.writeFileSync(frontEndAbiFile, healthchain.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const healthchain = await ethers.getContract("HealthChain")
    const chainId = network.config.chainId.toString()
    const currentAddresses = JSON.parse(
        fs.readFileSync(frontEndContractsFile, "utf8") // utf-8 a way to convert to ASCII
    )
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(healthchain.address)) {
            currentAddresses[chainId].push(healthchain.address)
        }
    }
    else {
        currentAddresses[chainId] = [healthchain.address]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(currentAddresses))
}
module.exports.tags = ["all", "frontend"]
