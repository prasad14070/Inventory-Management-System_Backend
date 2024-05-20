let DB = require("../model/database");
let joi = require("joi");

async function getCityData(req, res) {
    let dbResult = await DB.execute("SELECT * FROM citydata");
    dbResult = dbResult[0];

    if (dbResult?.length) {
        res.json({
            isSuccess: true,
            message: "",
            data: {
                cityData: dbResult,
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {},
        });
    }
}

async function resetPassword(req, res) {
    let dbResult = await DB.execute("UPDATE ledger_master SET `LM_PASSWORD`=? WHERE `LM_ID`=?", [
        req.body.newPassword,
        req.body.lmId,
    ]);
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        res.json({
            isSuccess: true,
            message: "Password reset successfully",
            data: {},
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Faild to Reset Password",
            data: {},
        });
    }
}

async function addLedgerData(req, res) {
    let city = req.body.lmCity ?  req.body.lmCity.split(",")[0] || null : null;
    let state =  req.body.lmCity ? req.body.lmCity.split(",")[1] || null : null;
    let country =  req.body.lmCity ? req.body.lmCity.split(",")[2] || null : null;

    // Insert data into database
    let dbResult = await DB.execute(
        "INSERT INTO ledger_master (`LM_ID`, `LM_REFERENCE_ID`, `LM_NAME`, `LM_ALIAS`, `LM_UNDER_ID`, `LM_UNDER_NAME`, `LINK_ID`, `LM_ADDRESS`, `LM_COUNTRY`, `LM_STATE`, `LM_CITY`, `LM_AREA`, `LM_PINCODE`, `LM_PHONE`, `LM_MOBILE`, `LM_EMAIL`, `LM_WEBSITE`, `LM_AADHAR_NO`, `LM_GST_NO`, `LM_PAN_CARD_NO`, `LM_LOGO`, `LM_PARENT_ID`, `IS_ACTIVE`, `LM_PASSWORD`, `LM_DOE`, `LM_IS_VIEW`, `LM_READ_ONLY`, `LM_CR_LIMIT`, `LM_OPENING_BALANCE`, `LM_OP_DRCR`, `CREATED_BY`, `CREATED_AT`, `UPDATED_BY`, `UPDATED_AT` ) VALUES ( ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.lmLedgerId,
            req.body.lmReferenceNo,
            req.body.lmName,
            req.body.lmAlias,
            req.body.lmUnderId,
            req.body.lmUnderName,
            req.body.lmLinkId,
            req.body.lmAddress,
            country,
            state,
            city,
            req.body.lmArea,
            req.body.lmPincode,
            req.body.lmPhoneNumber,
            req.body.lmMobileNumber,
            req.body.lmEmail,
            req.body.lmWebsite,
            req.body.lmAadharNumber,
            req.body.lmGstNumber,
            req.body.lmPanNumber,
            req.body.lmLogo,
            req.body.lmParentId,
            req.body.lmIsActive,
            req.body.lmPassword,
            req.body.lmDateOfExpiry,
            req.body.lmIsView,
            req.body.lmReadOnly,
            req.body.lmCrLimit || null,
            req.body.lmOpeningBalance || null,
            req.body.lmDrCr || null,
            req.body.created_by,
            req.body.created_at,
            JSON.stringify(req.body.updated_by),
            JSON.stringify(req.body.updated_at),
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let ledgerMasterData = await DB.execute(`SELECT * FROM ledger_master`);
        ledgerMasterData = ledgerMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data inserted successfully",
            data: {
                ledgerMasterData,
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {},
        });
    }
}

async function editLedgerData(req, res) {
    let city = req.body.lmCity.split(",")[0] || null;
    let state = req.body.lmCity.split(",")[1] || null;
    let country = req.body.lmCity.split(",")[2] || null;

    let dbResult = await DB.execute(
        "UPDATE ledger_master SET `LM_REFERENCE_ID`=?, `LM_NAME`=?, `LM_ALIAS`=?, `LM_UNDER_ID`=?, `LM_UNDER_NAME`=?, `LINK_ID`=?, `LM_ADDRESS`=?, `LM_COUNTRY`=?, `LM_STATE`=?, `LM_CITY`=?, `LM_AREA`=?, `LM_PINCODE`=?, `LM_PHONE`=?, `LM_MOBILE`=?, `LM_EMAIL`=?, `LM_WEBSITE`=?, `LM_AADHAR_NO`=?, `LM_GST_NO`=?, `LM_PAN_CARD_NO`=?, `LM_LOGO`=?, `LM_PARENT_ID`=?, `IS_ACTIVE`=?, `LM_PASSWORD`=?, `LM_DOE`=?, `LM_IS_VIEW`=?, `LM_READ_ONLY`=?, `UPDATED_BY`=JSON_ARRAY_APPEND(UPDATED_BY, '$', ?), `UPDATED_AT`=JSON_ARRAY_APPEND(UPDATED_AT, '$', ?) WHERE `LM_ID`=?",
        [
            req.body.lmReferenceNo,
            req.body.lmName,
            req.body.lmAlias,
            req.body.lmUnderId,
            req.body.lmUnderName,
            req.body.lmLinkId,
            req.body.lmAddress,
            country,
            state,
            city,
            req.body.lmArea,
            req.body.lmPincode,
            req.body.lmPhoneNumber,
            req.body.lmMobileNumber,
            req.body.lmEmail,
            req.body.lmWebsite,
            req.body.lmAadharNumber,
            req.body.lmGstNumber,
            req.body.lmPanNumber,
            req.body.lmLogo,
            req.body.lmParentId,
            req.body.lmIsActive,
            req.body.lmPassword,
            req.body.lmDateOfExpiry,
            req.body.lmIsView,
            req.body.lmReadOnly,
            req.body.updated_by,
            req.body.updated_at,
            req.body.lmLedgerId,
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let ledgerMasterData = await DB.execute(`SELECT * FROM ledger_master`);
        ledgerMasterData = ledgerMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data edited successfully",
            data: {
                ledgerMasterData,
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {},
        });
    }
}

async function deleteRow(req, res) {
    let dbResult = await DB.execute("DELETE FROM ledger_master WHERE `LM_ID`=?", [req.body.LM_ID]);
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let ledgerMasterData = await DB.execute(`SELECT * FROM ledger_master`);
        ledgerMasterData = ledgerMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data deleted successfully",
            data: {
                ledgerMasterData,
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while deleting row",
            data: {},
        });
    }
}

module.exports = {
    getCityData,
    addLedgerData,
    editLedgerData,
    resetPassword,
    deleteRow,
};
