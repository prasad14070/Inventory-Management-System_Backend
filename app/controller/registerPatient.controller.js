let DB = require("../model/database");
let joi = require("joi");

// Function to register a new patient
async function registerPatient(req, res) {
    try {
        // Replace undefined values with null
        Object.keys(req.body).forEach(key => {
            if (req.body[key] === undefined) {
                req.body[key] = null;
            }
        });
        
        // Insert data into registration_master
        let dbResultMaster = await DB.execute(
            "INSERT INTO registration_master (RM_PT_ID, RM_UNDER_ID, RM_TITLE, RM_NAME, RM_MOBILE, RM_GENDER, RM_MARITAL_STATUS, RM_Photo, RM_AADHAR_CARD, RM_YEAR, RM_COMP_ID, RM_CREATED_BY, RM_CREATED_DATE, RM_UPDATED_BY, RM_UPDATED_DATE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                req.body.rmPtId,
                req.body.rmUnderId,
                req.body.rmTitle,
                req.body.rmName,
                req.body.rmMobile,
                req.body.rmGender,
                req.body.rmMaritalStatus,
                req.body.rmPhoto,
                req.body.rmAadharCard,
                req.body.rmYear,
                JSON.stringify(req.body.rmCompId),
                JSON.stringify(req.body.rmCreatedBy),
                JSON.stringify(req.body.rmCreatedDate),
                JSON.stringify(req.body.rmUpdatedBy),
                JSON.stringify(req.body.rmUpdatedDate)
            ]
        );
        dbResultMaster = dbResultMaster[0];

        let dbResultDetails = await DB.execute(
            "INSERT INTO registration_details (RD_CASE_NO, RD_PT_ID, RD_IPD_NO, RD_OPD_IPD, RD_DateTime, RD_NORMAL_EMERG, RD_OLD_NEW, RD_MLC, RD_DOB, RD_YEAR, RD_MONTH, RD_DAYS, RD_ADDRESS, RD_AREA, RD_CITY, RD_PHONE, RD_COMP_TPA_ID, RD_CON_DR_ID, RD_REF_DR_ID, RD_PRD_NARRATION) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                req.body.rdCaseNo,
                req.body.rdPtId,
                req.body.rdIpdNo,
                req.body.rdOpdIpd,
                req.body.rdDateTime,
                req.body.rdNormalEmerg,
                req.body.rdOldNew,
                req.body.rdMlc,
                req.body.rdDob,
                req.body.rdYear,
                req.body.rdMonth,
                req.body.rdDays,
                req.body.rdAddress,
                req.body.rdArea,
                req.body.rdCity,
                req.body.rdPhone,
                JSON.stringify(req.body.rdCompTpaId),
                JSON.stringify(req.body.rdConDrId),
                JSON.stringify(req.body.rdRefDrId),
                JSON.stringify(req.body.rdPrdNarration)
            ]
        );













        dbResultDetails = dbResultDetails[0];

        let patientMasterData = await DB.execute("SELECT * FROM registration_master");
        patientMasterData = patientMasterData[0];
        res.json({
            isSuccess: true,
            message: "Registration details added successfully",
            data: {
                patientMasterData,
            },
        });

        if (dbResultMaster.affectedRows) {
            // Handle success
        } else {
            res.json({
                isSuccess: false,
                message: "Something went wrong while inserting data into database",
                data: {},
            });
        }

    } catch (error) {
        res.json({

            
            isSuccess: false,
            message: error.message,
            data: {},
        });
    }
}

// Function to add registration details
async function addRegistrationDetails(req, res) {
    try {
        let dbResult = await DB.execute(
            "INSERT INTO registration_details (RD_CASE_NO, RD_PT_ID, RD_IPD_NO, RD_OPD_IPD, RD_DateTime, RD_NORMAL_EMERG, RD_OLD_NEW, RD_MLC, RD_DOB, RD_YEAR, RD_MONTH, RD_DAYS, RD_ADDRESS, RD_AREA, RD_COMP_TPA_ID, RD_CON_DR_ID, RD_REF_DR_ID, RD_PRD_NARRATION) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                req.body.rdCaseNo,
                req.body.rdPtId,
                req.body.rdIpdNo,
                req.body.rdOpdIpd,
                req.body.rdDateTime,
                req.body.rdNormalEmerg,
                req.body.rdOldNew,
                req.body.rdMlc,
                req.body.rdDob,
                req.body.rdYear,
                req.body.rdMonth,
                req.body.rdDays,
                req.body.rdAddress,
                req.body.rdArea,
                JSON.stringify(req.body.rdCompTpaId),
                JSON.stringify(req.body.rdConDrId),
                JSON.stringify(req.body.rdRefDrId),
                JSON.stringify(req.body.rdPrdNarration)
            ]
        );
        dbResult = dbResult[0];

        if (dbResult.affectedRows) {
            res.json({
                isSuccess: true,
                message: "Registration details added successfully",
                data: {},
            });
        } else {
            res.json({
                isSuccess: false,
                message: "Something went wrong while inserting data into database",
                data: {},
            });
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: error.message,
            data: {},
        });
    }
}

// Function to get registration master data
async function getRegistrationMasterData(req, res) {
    try {
        let dbResult = await DB.execute("SELECT * FROM registration_master");
        dbResult = dbResult[0];

        if (dbResult?.length) {
            res.json({
                isSuccess: true,
                message: "",
                data: {
                    registrationMasterData: dbResult,
                },
            });
        } else {
            res.json({
                isSuccess: false,
                message: "No data found in registration_master",
                data: {},
            });
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: error.message,
            data: {},
        });
    }
}

// Function to get registration details data
async function getRegistrationDetailsData(req, res) {
    try {
        let dbResult = await DB.execute("SELECT * FROM registration_details");
        dbResult = dbResult[0];

        if (dbResult?.length) {
            res.json({
                isSuccess: true,
                message: "",
                data: {
                    registrationDetailsData: dbResult,
                },
            });
        } else {
            res.json({
                isSuccess: false,
                message: "No data found in registration_details",
                data: {},
            });
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: error.message,
            data: {},
        });
    }
}

// Function to update registration master data
async function updateRegistrationMaster(req, res) {
    try {
        let dbResult = await DB.execute(
            "UPDATE registration_master SET RM_UNDER_ID=?, RM_TITLE=?, RM_NAME=?, RM_GENDER=?, RM_MARITAL_STATUS=?, RM_Photo=?, RM_AADHAR_CARD=?, RM_YEAR=?, RM_COMP_ID=?, RM_UPDATED_BY=JSON_ARRAY_APPEND(RM_UPDATED_BY, '$', ?), RM_UPDATED_DATE=JSON_ARRAY_APPEND(RM_UPDATED_DATE, '$', ?) WHERE RM_PT_ID=?",
            [
                req.body.rmUnderId,
                req.body.rmTitle,
                req.body.rmName,
                req.body.rmGender,
                req.body.rmMaritalStatus,
                req.body.rmPhoto,
                req.body.rmAadharCard,
                req.body.rmYear,
                req.body.rmCompId,
                req.body.rmUpdatedBy,
                req.body.rmUpdatedDate,
                req.body.rmPtId
            ]
        );
        dbResult = dbResult[0];

        if (dbResult.affectedRows) {
            res.json({
                isSuccess: true,
                message: "Registration master data updated successfully",
                data: {},
            });
        } else {
            res.json({
                isSuccess: false,
                message: "Something went wrong while updating data in database",
                data: {},
            });
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: error.message,
            data: {},
        });
    }
}

// Function to update registration details
async function updateRegistrationDetails(req, res) {
    try {
        // Convert photo buffer to a string (if applicable)
        let photoBuffer = req.body.rmPhoto;
        let photoString = photoBuffer ? photoBuffer.toString('base64') : null;
        console.log("Updating registration_master with params:", [
            req.body.rmUnderId,
            req.body.rmTitle,
            req.body.rmName,
            req.body.rmMobile,
            req.body.rmGender,
            req.body.rmMaritalStatus,
            photoString,
            req.body.rmAadharCard,
            req.body.rmYear,
            JSON.stringify(req.body.rmCompId),
            JSON.stringify(req.body.rmUpdatedBy),
            JSON.stringify(req.body.rmUpdatedDate),
            req.body.rmPtId
        ]);
        
        let dbResultDetails = await DB.execute(
            "UPDATE registration_details SET RD_IPD_NO=?, RD_OPD_IPD=?, RD_DateTime=?, RD_NORMAL_EMERG=?, RD_OLD_NEW=?, RD_MLC=?, RD_DOB=?, RD_YEAR=?, RD_MONTH=?, RD_DAYS=?, RD_ADDRESS=?, RD_AREA=?, RD_CITY=?, RD_PHONE=?, RD_COMP_TPA_ID=?, RD_CON_DR_ID=?, RD_REF_DR_ID=?, RD_PRD_NARRATION=? WHERE RD_CASE_NO=?",
            [
                req.body.rdIpdNo,
                req.body.rdOpdIpd,
                req.body.rdDateTime,
                req.body.rdNormalEmerg,
                req.body.rdOldNew,
                req.body.rdMlc,
                req.body.rdDob,
                req.body.rdYear,
                req.body.rdMonth,
                req.body.rdDays,
                req.body.rdAddress,
                req.body.rdArea,
                req.body.rdCity,
                req.body.rdPhone,
                JSON.stringify(req.body.rdCompTpaId),
                JSON.stringify(req.body.rdConDrId),
                JSON.stringify(req.body.rdRefDrId),
                JSON.stringify(req.body.rdPrdNarration),
                req.body.rdCaseNo
            ]
        );
        dbResultDetails = dbResultDetails[0];

        if (dbResultDetails.affectedRows) {
            let dbResultMaster = await DB.execute(
                "UPDATE registration_master SET RM_UNDER_ID=?, RM_TITLE=?, RM_NAME=?, RM_MOBILE=?, RM_GENDER=?, RM_MARITAL_STATUS=?, RM_Photo=?, RM_AADHAR_CARD=?, RM_YEAR=?, RM_COMP_ID=?, RM_UPDATED_BY=?, RM_UPDATED_DATE=? WHERE RM_PT_ID=?",
                [
                    req.body.rmUnderId,
                    req.body.rmTitle,
                    req.body.rmName,
                    req.body.rmMobile,
                    req.body.rmGender,
                    req.body.rmMaritalStatus,
                    photoString,
                    req.body.rmAadharCard,
                    req.body.rmYear,
                    JSON.stringify(req.body.rmCompId),
                    JSON.stringify(req.body.rmUpdatedBy),
                    JSON.stringify(req.body.rmUpdatedDate),
                    req.body.rmPtId
                ]
            );
            dbResultMaster = dbResultMaster[0];

            if (dbResultMaster.affectedRows) {
                res.json({
                    isSuccess: true,
                    message: "Registration details and master data updated successfully",
                    data: {},
                });
            } else {
                res.json({
                    isSuccess: false,
                    message: "Something went wrong while updating registration master data in database",
                    data: {},
                });
            }
        } else {
            res.json({
                isSuccess: false,
                message: "Something went wrong while updating registration details in database",
                data: {},
            });
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: error.message,
            data: {},
        });
    }
}

// Function to delete a patient registration
async function deleteRegistration(req, res) {
    try {
        // Step 1: Delete from registration_details
        let dbResultDetails = await DB.execute("DELETE FROM registration_details WHERE RD_PT_ID=?", [req.body.rdPtId]);
        dbResultDetails = dbResultDetails[0];
    
        if (dbResultDetails.affectedRows) {
            // Step 2: Delete from registration_master
            let dbResultMaster = await DB.execute("DELETE FROM registration_master WHERE RM_PT_ID=?", [req.body.rdPtId]);
            dbResultMaster = dbResultMaster[0];
    
            if (dbResultMaster.affectedRows) {
                res.json({
                    isSuccess: true,
                    message: "Registration deleted successfully",
                    data: {},
                });
            } else {
                res.json({
                    isSuccess: false,
                    message: "Something went wrong while deleting registration master",
                    data: {},
                });
            }
        } else {
            res.json({
                isSuccess: false,
                message: "Something went wrong while deleting registration details",
                data: {},
            });
        }
    } catch (error) {
        console.error("Error deleting registration:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Internal server error",
            data: {},
        });
    }
}

module.exports = {
    registerPatient,
    addRegistrationDetails,
    getRegistrationMasterData,
    getRegistrationDetailsData,
    updateRegistrationMaster,
    updateRegistrationDetails,
    deleteRegistration,
};
