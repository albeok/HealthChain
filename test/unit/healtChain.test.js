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
        let patient1;
        let signers;
        beforeEach(async () => {
            signers = await ethers.getSigners();
            [deployer, doctor, patient, patient1] = signers;
            await deployments.fixture(["all"]);
            healthChain = await ethers.getContract("HealthChain", deployer);
        })
        describe("Doctor", function () {
            const name = "name";
            const surname = "surname";
            const dateOfBirth = "dateOfBirth";
            const email = "email";
            const telephone = "telephone";
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
                    expect(
                        await healthChainWithDoctor.createDoctor(name, surname,
                            dateOfBirth, email, telephone,
                            zipCode, city, country)
                    ).to.be.revertedWith("HealthChain__youAlreadyHaveAnAccount");
                });
            it("fails if you are already registered as a patient", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);
                expect(await healthChainWithPatient.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country)).to.be.revertedWith("HealthChain__youAlreadyHaveAnAccount")
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
            const name = "name";
            const surname = "surname";
            const dateOfBirth = "dateOfBirth";
            const email = "email";
            const telephone = "telephone";
            const telephone2 = "telephone2";
            const doctorTelephone = "doctorTelephone";
            const zipCode = "zipCode";
            const city = "city";
            const country = "country";
            it("stores the data correctly and get patient data works", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                const tx = await healthChainWithPatient.createPatient(
                    name, surname, dateOfBirth, email, telephone,
                    telephone2, doctorTelephone,
                    zipCode, city, country
                );
                const receipt = await tx.wait();
                const patientId = receipt.events[0].args[0];
                const patientData = await healthChainWithPatient.getPatientData(patientId);

                assert.equal(patientData.id, patientId);
                assert.equal(patientData.name, name);
                assert.equal(patientData.surname, surname);
                assert.equal(patientData.dateOfBirth, dateOfBirth);
                assert.equal(patientData.email, email);
                assert.equal(patientData.telephone, telephone);
                assert.equal(patientData.telephone2, telephone2);
                assert.equal(patientData.doctorTelephone, doctorTelephone);
                assert.equal(patientData.zipCode, zipCode);
                assert.equal(patientData.city, city);
                assert.equal(patientData.country, country);
            });
            it("fails if you are already registered as a patient"
                , async () => {
                    const healthChainWithPatient = healthChain.connect(patient);
                    await healthChainWithPatient.createPatient(
                        name, surname, dateOfBirth, email, telephone,
                        telephone2, doctorTelephone,
                        zipCode, city, country
                    );
                    expect(
                        await healthChainWithPatient.createPatient(
                            name, surname, dateOfBirth, email, telephone,
                            telephone2, doctorTelephone,
                            zipCode, city, country
                        )
                    ).to.be.revertedWith("HealthChain__youAlreadyHaveAnAccount");
                });
            it("fails if you are already registered as a doctor", async () => {
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country)
                expect(await healthChainWithDoctor.createPatient(
                    name, surname, dateOfBirth, email, telephone,
                    telephone2, doctorTelephone,
                    zipCode, city, country
                )).to.be.revertedWith("HealthChain__youAlreadyHaveAnAccount")
            });
            it("updates correctly the data of the patient", async () => {
                const name2 = "updated";
                const surname2 = "updated";
                const dateOfBirth2 = "updated";
                const email2 = "updated";
                const telephone2 = "updated";
                const telephone22 = "updated";
                const doctorTelephone2 = "updated";
                const zipCode2 = "updated";
                const city2 = "updated";
                const country2 = "updated";
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(name, surname,
                    dateOfBirth, email, telephone, telephone2, doctorTelephone,
                    zipCode, city, country);
                await healthChainWithPatient.updatePatient(
                    patient.address, name2, surname2, dateOfBirth2,
                    email2, telephone2, telephone22, doctorTelephone2,
                    zipCode2, city2, country2
                );
                const patientUpdated = await healthChainWithPatient.getPatientData(patient.address);
                assert.equal(patientUpdated.id, patient.address);
                assert.equal(patientUpdated.name, name2);
                assert.equal(patientUpdated.surname, surname2);
                assert.equal(patientUpdated.dateOfBirth, dateOfBirth2);
                assert.equal(patientUpdated.email, email2);
                assert.equal(patientUpdated.telephone, telephone2);
                assert.equal(patientUpdated.telephone2, telephone22);
                assert.equal(patientUpdated.doctorTelephone, doctorTelephone2);
                assert.equal(patientUpdated.zipCode, zipCode2);
                assert.equal(patientUpdated.city, city2);
                assert.equal(patientUpdated.country, country2);
            });
        });
        describe("Requests and Medical Records", function () {
            const name = "name";
            const surname = "surname";
            const dateOfBirth = "dateOfBirth";
            const email = "email";
            const telephone = "telephone";
            const telephone2 = "telephone2";
            const doctorTelephone = "doctorTelephone";
            const zipCode = "zipCode";
            const city = "city";
            const country = "country";
            const RequestStatus = {
                0: 0, //'Pending'
                1: 1, //'Approved'
                2: 2 //'Rejected'
            };

            it("create a request successfully emit an event and has to be pending", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(name, surname,
                    dateOfBirth, email, telephone, telephone2, doctorTelephone,
                    zipCode, city, country);
                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname,
                    dateOfBirth, email, telephone,
                    zipCode, city, country);

                const tx = await healthChainWithDoctor.createRequest(patient.address);
                const receipt = await tx.wait();
                const requestId = await receipt.events[0].args[0];

                const requests = await healthChainWithDoctor.getPendingRequests(patient.address);
                const pending = RequestStatus[0];

                assert.equal(requestId.toString(), requests[requests.length - 1].requestId.toString());
                assert.equal(requests[requests.length - 1].status, pending);
                await expect(tx).to.emit(healthChain, "RequestCreated").withArgs(requestId, patient.address, doctor.address);
            });

            it("should be approved when you do approve the request", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(name, surname, dateOfBirth, email, telephone, telephone2, doctorTelephone, zipCode, city, country);

                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname, dateOfBirth, email, telephone, zipCode, city, country);

                const tx_createRequest = await healthChainWithDoctor.createRequest(patient.address);
                const receipt_createRequest = await tx_createRequest.wait();
                const requestId = receipt_createRequest.events[0].args[0];
                const tx_respondRequest = await healthChainWithPatient.respondToRequest(requestId, true);
                await tx_respondRequest.wait(1);

                const approved = RequestStatus[1];
                const requests = await healthChainWithDoctor.getPendingRequests(patient.address);
                assert.equal(approved, requests[requests.length - 1].status);

            });

            it("should emit request approved event when you do approve the request", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(name, surname, dateOfBirth, email, telephone, telephone2, doctorTelephone, zipCode, city, country);

                const healthChainWithDoctor = healthChain.connect(doctor);
                await healthChainWithDoctor.createDoctor(name, surname, dateOfBirth, email, telephone, zipCode, city, country);

                const tx = await healthChainWithDoctor.createRequest(patient.address);
                const receipt = await tx.wait();
                const requestId = receipt.events[0].args[0];

                await expect(await healthChainWithPatient.respondToRequest(requestId, true))
                    .to.emit(healthChain, "RequestApproved")
                    .withArgs(requestId, patient.address);
            });

            it("should create a medical record if the request is approved", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(name, surname,
                    dateOfBirth, email, telephone, telephone2, doctorTelephone,
                    zipCode, city, country);
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
                expect(tx_createMedicalRecord).to.emit(healthChain, "medicalRecordCreated");
            });

            it("should create a medical record properly", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(name, surname,
                    dateOfBirth, email, telephone, telephone2, doctorTelephone,
                    zipCode, city, country);
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
                const medicalRecords = await healthChainWithDoctor.getMedicalRecords(patient.address);
                assert.equal(medicalRecords[0].fileName, fileName);
                assert.equal(medicalRecords[0].hospital, hospital);
                assert.equal(medicalRecords[0].details, details);
            });
            it("update a medical record", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(name, surname,
                    dateOfBirth, email, telephone, telephone2, doctorTelephone,
                    zipCode, city, country);
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

                const tx_2 = await healthChainWithDoctor.createRequest(patient.address);
                const receipt_2 = await tx_2.wait();
                const requestId_2 = await receipt_2.events[0].args[0];
                await healthChainWithPatient.respondToRequest(requestId_2, true);

                const medicalRecords = await healthChainWithPatient.getMedicalRecords(patient.address);
                const medicalRecord = medicalRecords[0];
                const medicalRecordId = medicalRecord.id;

                const fileName2 = "updated";
                const hospital2 = "updated";
                const details2 = "updated";

                await healthChainWithDoctor.updateMedicalRecord(patient.address,
                    medicalRecordId, requestId_2, fileName2, hospital2, details2);
                const updatedMedicalRecords = await healthChainWithPatient.getMedicalRecords(patient.address);
                const updatedMedicalRecord = updatedMedicalRecords[0];
                assert.equal(updatedMedicalRecord.fileName, fileName2);
                assert.equal(updatedMedicalRecord.hospital, hospital2);
                assert.equal(updatedMedicalRecord.details, details2);
            });
            it("get the number of medical record of a certain address", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(name, surname,
                    dateOfBirth, email, telephone, telephone2, doctorTelephone,
                    zipCode, city, country);
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
                const numMedicalRecord = await healthChainWithPatient.getNumMedicalRecords(patient.address);
                assert.equal(numMedicalRecord, 1);
            });
            it("get the medical record by its id", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(name, surname,
                    dateOfBirth, email, telephone, telephone2, doctorTelephone,
                    zipCode, city, country);
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

                const medicalRecordById = await healthChainWithDoctor.getMedicalRecordById(medicalRecordId, patient.address);

                assert.equal(medicalRecordId.toString(), medicalRecordById.id.toString());
                assert.equal(medicalRecord.timeAdded.toString(), medicalRecordById.timeAdded.toString());
                assert.equal(medicalRecord.patientId, medicalRecordById.patientId);
                assert.equal(medicalRecord.doctorId, medicalRecordById.doctorId);
                assert.equal(medicalRecord.fileName, medicalRecordById.fileName);
                assert.equal(medicalRecord.hospital, medicalRecordById.hospital);
                assert.equal(medicalRecord.details, medicalRecordById.details);
            });
            it("shouldn't revert if medical record is found", async () => {
                const healthChainWithPatient = healthChain.connect(patient);
                await healthChainWithPatient.createPatient(name, surname,
                    dateOfBirth, email, telephone, telephone2, doctorTelephone,
                    zipCode, city, country);
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

                // Check that the medical record is found without reverting
                await expect(healthChainWithPatient.getMedicalRecordById(medicalRecordId, patient.address))
                    .to.not.be.revertedWith("HealthChain__MedicalRecordNotFound");
            });

        });
    });
