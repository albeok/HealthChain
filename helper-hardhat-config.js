networkConfig = {
    11155111: {
        name: "sepolia",
    },
    31337: {
        name: "localhost",
    }
}
developmentChains = ["hardhat", "localhost"]
const frontEndContractsFile = "../healthchain_ui/src/constants/contractAddresses.json"
const frontEndAbiFile = "../healthchain_ui/src/constants/abi.json"

module.exports = {
    networkConfig,
    developmentChains,
    frontEndContractsFile,
    frontEndAbiFile
}