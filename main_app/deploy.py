from solcx import compile_standard, install_solc
import json
from web3 import Web3

# Compile the contract
contract_path = "../healthchain/contracts/HealthChain.sol"
with open(contract_path, "r") as file:
    healthchain_file = file.read()
compiled_solidity = compile_standard(
    {
        "language": "Solidity",
        "sources": {"HealthChain.sol": {"content": healthchain_file}},
        "settings": {
            "outputSelection": {
                "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
            }
        },
    },
    solc_version="0.8.0",
)
with open("HealthChain.json", "w") as file:
    json.dump(compiled_solidity, file)

# Deploy the contract
provider_url = "https://goerli.infura.io/v3/baa80ab61b4e42cdadbd7b23deabae21"
w3 = Web3(Web3.HTTPProvider(provider_url))
bytecode = compiled_solidity["contracts"]["HealthChain.sol"]["HealthChain"]["evm"][
    "bytecode"
]["object"]
abi = compiled_solidity["contracts"]["HealthChain.sol"]["HealthChain"]["abi"]
with open("abis.json", "w") as f:
    json.dump(abi, f)
HealthChain = w3.eth.contract(abi=abi, bytecode=bytecode)
goerli_chain = 5
wallet = "0xc83Bc54f0C7D44636511f475961E202B2A8F1D5C"
nonce = w3.eth.getTransactionCount(wallet)
transaction = HealthChain.constructor().buildTransaction(
    {
        "chainId": goerli_chain,
        "gasPrice": w3.eth.gas_price,
        "from": wallet,
        "nonce": nonce,
    }
)
print(transaction)
# w3 = Web3(Web3.HTTPProvider("HTTP://127.0.0.1:8545"))
# chain_id = 1337
# # print(w3)
# w3.eth.default_account = w3.eth.accounts[0]
# account = "0xC29Ea319AF9c25b5774aA4f8ECF47463c765022E"
# private_key = "0xbc715c10a77aef1e29df46a3f73f8dc80254fe91ab9d34c831ba754f5efd1a45"
# # my_address = "0xE94a0a81DDaB21C4fa922A83A9bEa80B438D7B40"  # 0xbB2AD61Fb2322fdDD705b86fAB51BDE2d9Ec1C42
# # private_key = "0x88680a3ed689d9d24942da8cb7229d67da59a64dfd073b081c7b79e82b27f4cf"
# HealthCare = w3.eth.contract(abi=abi, bytecode=bytecode)
# # print(HealthCare)
# nonce = w3.eth.getTransactionCount(account)
# # print(nonce)

# transaction = HealthCare.constructor().buildTransaction(
#     {
#         "chainId": chain_id,
#         "gasPrice": w3.eth.gas_price,
#         "from": account,
#         "nonce": nonce,
#     }
# )
# # print(transaction)
# signed = w3.eth.account.sign_transaction(transaction, private_key)
# # print(signed)
# tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
# # print(tx_hash)
# tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
# # print(f"Done! Contract Deployed to {tx_receipt['contractAddress']} \n")
# contract_ = w3.eth.contract(address=tx_receipt.contractAddress, abi=abi)
# create_doctor = contract_.functions.create_doctor(
#     "1", "1", "1", "1", "1", "1", "1", "1"
# ).transact()
# tx_patient_receipt = w3.eth.wait_for_transaction_receipt(create_doctor)
# # print(tx_patient_receipt)
# doctor_data = contract_.functions.get_doctor_data(w3.toChecksumAddress(account)).call()
# print(doctor_data)
