const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("HealthChain", function () {
        let healthChain;
        let deployer;
        let doctor;
        let patient;
        let signers;
        beforeEach(async () => {
            signers = await ethers.getSigners();
            [deployer, doctor, patient] = signers;
            await deployments.fixture(["all"]);
            healthChain = await ethers.getContract("HealthChain", deployer);
        })
        describe("Doctor", function () {
            const doctorId = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
            const name = "name";
            const surname = "surname";
            const dateOfBirth = "dateOfBirth";
            const email = "email";
            const telephone = "telephone";
            const telephone2 = "telephone2";
            const zipCode = "zipCode";
            const city = "city";
            const country = "country";

            it("stores the data correctly and get doctor data works"
                , async () => {
                    const healthChainWithDoctor = healthChain.connect(doctor);
                    await healthChainWithDoctor.createDoctor(name, surname, dateOfBirth, email, telephone, zipCode, city, country);
                    const doctorData = await healthChainWithDoctor.getDoctorData(doctor.address);
                    // Check that the data is correct
                    assert.equal(doctorData.id, doctor.address);
                    assert.equal(doctorData.name, name);
                    assert.equal(doctorData.surname, surname);
                    assert.equal(doctorData.dateOfBirth, dateOfBirth);
                    assert.equal(doctorData.email, email);
                    assert.equal(doctorData.telephone, telephone);
                    assert.equal(doctorData.zipCode, zipCode);
                    assert.equal(doctorData.city, city);
                    assert.equal(doctorData.country, country);
                });
            it("fails if you are already registered as a doctor"
                , async () => {
                    const healthChainWithDoctor = healthChain.connect(doctor);
                    await healthChainWithDoctor.createDoctor(name, surname,
                        dateOfBirth, email, telephone,
                        zipCode, city, country)
                    await expect(healthChainWithDoctor.createDoctor(name, surname,
                        dateOfBirth, email, telephone, zipCode, city, country))
                        .to.be.revertedWith("HealthChain__youAlreadyHaveAnAccount");
                });
            it("fails if you are already registered as a patient", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                await expect(healthChainWithPatient.createDoctor(name, surname,
                    dateOfBirth, email, telephone, zipCode, city, country))
                    .to.be.revertedWith("HealthChain__youAlreadyHaveAnAccount")
            });
            it("updates correctly the data of the doctor", async () => {
                const name2 = "updated";
                const surname2 = "updated";
                const dateOfBirth2 = "updated";
                const email2 = "updated";
                const telephone2 = "updated";
                const zipCode2 = "updated";
                const city2 = "updated";
                const country2 = "updated";
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);
                await healthChainWithDoctor.updateDoctor(
                    doctor.address, name2, surname2, dateOfBirth2,
                    email2, telephone2, zipCode2, city2, country2
                );
                const doctorUpdated = await healthChainWithDoctor.getDoctorData(doctor.address);
                assert.equal(doctorUpdated.id, doctor.address);
                assert.equal(doctorUpdated.name, name2);
                assert.equal(doctorUpdated.surname, surname2);
                assert.equal(doctorUpdated.dateOfBirth, dateOfBirth2);
                assert.equal(doctorUpdated.email, email2);
                assert.equal(doctorUpdated.telephone, telephone2);
                assert.equal(doctorUpdated.zipCode, zipCode2);
                assert.equal(doctorUpdated.city, city2);
                assert.equal(doctorUpdated.country, country2);
            });
        });
        describe("Patient", function () {
            const doctorId = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
            const name = "name";
            const surname = "surname";
            const dateOfBirth = "dateOfBirth";
            const email = "email";
            const telephone = "telephone";
            const telephone2 = "telephone2";
            const zipCode = "zipCode";
            const city = "city";
            const country = "country";
            it("stores the data correctly and get patient data works", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId,
                    name, surname, dateOfBirth, email, telephone,
                    telephone2, zipCode, city, country
                );

                const patientData = await healthChainWithPatient.getPatientData(patient.address);
                assert.equal(patientData.id, patient.address);
                assert.equal(patientData.doctorId, doctorId);
                assert.equal(patientData.name, name);
                assert.equal(patientData.surname, surname);
                assert.equal(patientData.dateOfBirth, dateOfBirth);
                assert.equal(patientData.email, email);
                assert.equal(patientData.telephone, telephone);
                assert.equal(patientData.telephone2, telephone2);
                assert.equal(patientData.zipCode, zipCode);
                assert.equal(patientData.city, city);
                assert.equal(patientData.country, country);
            });
            it("fails if you are already registered as a patient", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId,
                    name, surname, dateOfBirth, email, telephone,
                    telephone2, zipCode, city, country
                );
                await expect(healthChainWithPatient.createPatient(doctorId,
                    name, surname, dateOfBirth, email, telephone,
                    telephone2, zipCode, city, country
                )
                ).to.be.revertedWith("HealthChain__youAlreadyHaveAnAccount");
            });
            it("fails if you are already registered as a doctor", async () => {
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country)
                await expect(healthChainWithDoctor.createPatient(doctorId,
                    name, surname, dateOfBirth, email, telephone,
                    telephone2, zipCode, city, country
                )).to.be.revertedWith("HealthChain__youAlreadyHaveAnAccount")
            });
            it("updates correctly the data of the patient", async () => {
                const doctorId2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
                const name2 = "updated";
                const surname2 = "updated";
                const dateOfBirth2 = "updated";
                const email2 = "updated";
                const telephone2 = "updated";
                const telephone22 = "updated";
                const zipCode2 = "updated";
                const city2 = "updated";
                const country2 = "updated";

                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);

                await healthChainWithPatient.updatePatient(
                    patient.address, doctorId2, name2, surname2, dateOfBirth2,
                    email2, telephone2, telephone22,
                    zipCode2, city2, country2
                );

                const patientUpdated = await healthChainWithPatient.getPatientData(patient.address);

                assert.equal(patientUpdated.id, patient.address);
                assert.equal(patientUpdated.doctorId, doctorId2);
                assert.equal(patientUpdated.name, name2);
                assert.equal(patientUpdated.surname, surname2);
                assert.equal(patientUpdated.dateOfBirth, dateOfBirth2);
                assert.equal(patientUpdated.email, email2);
                assert.equal(patientUpdated.telephone, telephone2);
                assert.equal(patientUpdated.telephone2, telephone22);
                assert.equal(patientUpdated.zipCode, zipCode2);
                assert.equal(patientUpdated.city, city2);
                assert.equal(patientUpdated.country, country2);
            });

            it("gets a patient's doctor address", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                const patientsDoctorAddress = await healthChainWithPatient.getPatientsDoctorAddress(patient.address);
                const doctorIdToCompare = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
                assert.equal(patientsDoctorAddress, doctorIdToCompare);
            });

            it("should revert if someone other than the actual patient attemps to access his/her data", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);

                await expect(healthChainWithDoctor.getPatientData(patient.address))
                    .to.be.revertedWith("HealthChain__cantAccessData");
            });
        });
        describe("Requests and Medical Records", function () {
            const doctorId = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
            const name = "name";
            const surname = "surname";
            const dateOfBirth = "dateOfBirth";
            const email = "email";
            const telephone = "telephone";
            const telephone2 = "telephone2";
            const zipCode = "zipCode";
            const city = "city";
            const country = "country";
            const RequestStatus = {
                0: 0, //'Pending'
                1: 1, //'Approved'
                2: 2, //'Rejected'
                3: 3 //'Closed'
            };

            it("create a request successfully, request should be approved and emit an event", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);

                const tx = await healthChainWithDoctor.createRequest(patient.address);
                const receipt = await tx.wait();
                const requestId = await receipt.events[0].args[0];
                await healthChainWithPatient.respondToRequest(requestId, true);

                const requests = await healthChainWithPatient.getRequests(patient.address);
                const approved = RequestStatus[1];

                assert.equal(requestId.toString(), requests[0].requestId.toString());
                assert.equal(requests[0].status, approved);
                await expect(tx).to.emit(healthChain, "requestCreated").withArgs(requestId, patient.address, doctor.address);
            });

            it("get the requests of a certain address successfully", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);

                const tx = await healthChainWithDoctor.createRequest(patient.address);
                const receipt = await tx.wait();
                const requestId = await receipt.events[0].args[0];
                await healthChainWithPatient.respondToRequest(requestId, true);

                const requests = await healthChainWithPatient.getRequests(patient.address);

                assert.equal(requestId.toString(), requests[0].requestId.toString());
            });

            it("should create a medical record properly", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);

                const tx = await healthChainWithDoctor.createRequest(patient.address);
                const receipt = await tx.wait();
                const requestId = await receipt.events[0].args[0];
                await healthChainWithPatient.respondToRequest(requestId, true);

                const fileName = "fileName";
                const hospital = "hospital";
                const details = "details";
                await healthChainWithDoctor.createMedicalRecord(
                    requestId, patient.address, fileName, hospital, details);

                const medicalRecords = await healthChainWithPatient.getMedicalRecords(patient.address);
                assert.equal(medicalRecords[0].fileName, fileName);
                assert.equal(medicalRecords[0].hospital, hospital);
                assert.equal(medicalRecords[0].details, details);
            });

            it("should emit the event medicalRecordCreated when a medical record is created", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);

                const tx = await healthChainWithDoctor.createRequest(patient.address);
                const receipt = await tx.wait();
                const requestId = await receipt.events[0].args[0];
                await healthChainWithPatient.respondToRequest(requestId, true);

                const fileName = "fileName";
                const hospital = "hospital";
                const details = "details";
                const tx_createMedicalRecord = await healthChainWithDoctor.createMedicalRecord(
                    requestId, patient.address, fileName, hospital, details);

                const medicalRecords = await healthChainWithPatient.getMedicalRecords(patient.address);
                await expect(tx_createMedicalRecord)
                    .to.emit(healthChain, "medicalRecordCreated")
                    .withArgs(medicalRecords[0].id, patient.address, doctor.address);
            });

            it("update a medical record", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);

                const tx = await healthChainWithDoctor.createRequest(patient.address);
                const receipt = await tx.wait();
                const requestId = await receipt.events[0].args[0];
                await healthChainWithPatient.respondToRequest(requestId, true);

                const fileName = "fileName";
                const hospital = "hospital";
                const details = "details";
                await healthChainWithDoctor.createMedicalRecord(
                    requestId, patient.address, fileName, hospital, details);

                const medicalRecords = await healthChainWithPatient.getMedicalRecords(patient.address);
                const medicalRecord = medicalRecords[0];
                const medicalRecordId = medicalRecord.id;

                const fileName2 = "updated";
                const hospital2 = "updated";
                const details2 = "updated";

                const tx_1 = await healthChainWithDoctor.createRequest(patient.address);
                const receipt_1 = await tx_1.wait();
                const requestId_1 = await receipt_1.events[0].args[0];
                await healthChainWithPatient.respondToRequest(requestId_1, true);

                await healthChainWithDoctor.updateMedicalRecord(patient.address,
                    medicalRecordId, requestId_1, fileName2, hospital2, details2);

                const updatedMedicalRecords = await healthChainWithPatient.getMedicalRecords(patient.address);
                const updatedMedicalRecord = updatedMedicalRecords[0];

                assert.equal(updatedMedicalRecord.fileName, fileName2);
                assert.equal(updatedMedicalRecord.hospital, hospital2);
                assert.equal(updatedMedicalRecord.details, details2);
            });

            it("get the medical record by its id", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);

                const tx = await healthChainWithDoctor.createRequest(patient.address);
                const receipt = await tx.wait();
                const requestId = await receipt.events[0].args[0];
                await healthChainWithPatient.respondToRequest(requestId, true);

                const fileName = "fileName";
                const hospital = "hospital";
                const details = "details";
                await healthChainWithDoctor.createMedicalRecord(requestId, patient.address, fileName, hospital, details);

                const medicalRecords = await healthChainWithPatient.getMedicalRecords(patient.address);
                const medicalRecord = medicalRecords[0];
                const medicalRecordId = medicalRecord.id;

                const medicalRecordById = await healthChainWithPatient.getMedicalRecordById(
                    medicalRecordId, patient.address
                );

                assert.equal(medicalRecordId.toString(), medicalRecordById.id.toString());
                assert.equal(medicalRecord.timeAdded.toString(), medicalRecordById.timeAdded.toString());
                assert.equal(medicalRecord.patientId, medicalRecordById.patientId);
                assert.equal(medicalRecord.doctorId, medicalRecordById.doctorId);
                assert.equal(medicalRecord.fileName, medicalRecordById.fileName);
                assert.equal(medicalRecord.hospital, medicalRecordById.hospital);
                assert.equal(medicalRecord.details, medicalRecordById.details);
            });

            it("should't find a medical record by id", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);

                await expect(healthChainWithPatient.getMedicalRecordById(
                    0, patient.address
                )).to.be.revertedWith("HealthChain__MedicalRecordNotFound");
            });

            it("should revert if someone other than the actual owner of the medical record attemps to access that data", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);

                const tx = await healthChainWithDoctor.createRequest(patient.address);
                const receipt = await tx.wait();
                const requestId = await receipt.events[0].args[0];
                await healthChainWithPatient.respondToRequest(requestId, true);

                const fileName = "fileName";
                const hospital = "hospital";
                const details = "details";
                await healthChainWithDoctor.createMedicalRecord(requestId, patient.address, fileName, hospital, details);

                const medicalRecords = await healthChainWithPatient.getMedicalRecords(patient.address);
                const medicalRecord = medicalRecords[0];
                const medicalRecordId = medicalRecord.id;

                await expect(healthChainWithDoctor.getMedicalRecordById(
                    medicalRecordId, patient.address
                )).to.be.revertedWith("HealthChain__cantAccessData");
            });

            it("should revert if someone other than the actual owner of the requests attemps to access them", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(doctorId, name, surname,
                    dateOfBirth, email, telephone, telephone2, zipCode, city, country);
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);

                await healthChainWithDoctor.createRequest(patient.address);

                await expect(healthChainWithDoctor.getRequests(patient.address))
                    .to.be.revertedWith("HealthChain__notYourData");
            });


        });
    });
