from web3 import Web3
from .deploy import contract_, w3

create_doctor_2 = contract_.functions.create_doctor(
    "11", "11", "11", "11", "11", "11", "11", "11"
).transact()
tx_patient_receipt = w3.eth.wait_for_transaction_receipt(create_doctor)
# print(tx_patient_receipt)
doctor_data = contract_.functions.get_doctor_data(w3.toChecksumAddress(account)).call()
print(doctor_data)
