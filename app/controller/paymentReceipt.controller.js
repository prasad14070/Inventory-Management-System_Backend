let DB = require("../model/database");

async function getPaymentReceipt(req, res) {
    let dbResultDetail = await DB.execute("SELECT * FROM payment_receipt_detail");
    let dbResultMaster = await DB.execute("SELECT * FROM payment_receipt_master");

    dbResultDetail = dbResultDetail[0];
    dbResultMaster = dbResultMaster[0];

    if (dbResultDetail?.length && dbResultMaster?.length) {
        res.json({
            isSuccess: true,
            message: "Data fetched successfully",
            data: {
                paymentReceiptDetailsData: dbResultDetail,
                paymentReceiptMasterData: dbResultMaster,
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Purchase data is empty Or Failed to fetch data",
            data: {},
        });
    }
}

async function addPaymentReceipt(req, res) {
    let dbResult = await DB.execute(
        "INSERT INTO payment_receipt_master (`PRM_ID`, `PRM_TYPE`, `PRM_TYPE_WISE_ID`, `PRM_DATE`, `PRM_NARRATION`, `PRM_CR_TOTAL`, `PRM_DB_TOTAL`, `CREATED_BY`, `CREATED_AT`, `UPDATED_BY`, `UPDATED_AT`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.prmId,
            req.body.prmType,
            req.body.prmTypeNo,
            req.body.prmDate,
            req.body.prmNarration,
            req.body.prdCrTotal,
            req.body.prdDbTotal,
            req.body.created_by,
            req.body.created_at,
            JSON.stringify(req.body.updated_by),
            JSON.stringify(req.body.updated_at),
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let isSuccess = true;
        for (let element of req.body.prdArray) {
            dbResult = await DB.execute(
                "INSERT INTO payment_receipt_detail (`PRM_ID`, `PRD_CR_DB`, `PRD_AC_NAME`, `PRD_REF`, `PRD_CR_AMT`, `PRD_DB_AMT`, `PRD_NARRATION`) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    req.body.prmId,
                    element.dbCr,
                    element.acName,
                    element.advAgst,
                    element.cr,
                    element.db,
                    element.narration,
                ]
            );
            dbResult = dbResult[0];

            if (!dbResult.affectedRows) {
                isSuccess = false;
                break;
            }
        }

        if (isSuccess) {
            let paymentReceiptMasterData = await DB.execute(`SELECT * FROM payment_receipt_master`);
            let paymentReceiptDetailsData = await DB.execute(
                `SELECT * FROM payment_receipt_detail`
            );

            paymentReceiptMasterData = paymentReceiptMasterData[0];
            paymentReceiptDetailsData = paymentReceiptDetailsData[0];

            res.json({
                isSuccess: true,
                message: "Data inserted successfully",
                data: {
                    paymentReceiptMasterData,
                    paymentReceiptDetailsData,
                },
            });
        } else {
            res.json({
                isSuccess: false,
                message: "Somthing went wrong while inserting data into database",
                data: {},
            });
        }
    } else {
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {},
        });
    }
}

async function editPaymentReceipt(req, res) {
    let dbResult = await DB.execute(
        "UPDATE payment_receipt_master SET `PRM_TYPE`=?, `PRM_TYPE_WISE_ID`=?, `PRM_DATE`=?, `PRM_NARRATION`=?, `PRM_CR_TOTAL`=?, `PRM_DB_TOTAL`=?, `UPDATED_BY`=JSON_ARRAY_APPEND(UPDATED_BY, '$', ?), `UPDATED_AT`=JSON_ARRAY_APPEND(UPDATED_AT, '$', ?) WHERE `PRM_ID`=?",
        [
            req.body.prmType,
            req.body.prmTypeNo,
            req.body.prmDate,
            req.body.prmNarration,
            req.body.prdCrTotal,
            req.body.prdDbTotal,
            req.body.updated_by,
            req.body.updated_at,
            req.body.prmId,
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let isSuccess = true;
        for (let element of req.body.prdArray) {
            dbResult = await DB.execute(
                "UPDATE payment_receipt_detail SET `PRD_CR_DB`=?, `PRD_AC_NAME`=?, `PRD_REF`=?, `PRD_CR_AMT`=?, `PRD_DB_AMT`=?, `PRD_NARRATION`=? WHERE `PRD_ID`=?",
                [
                    element.dbCr,
                    element.acName,
                    element.advAgst,
                    element.cr,
                    element.db,
                    element.narration,
                    element.prdId,
                ]
            );
            dbResult = dbResult[0];
            if (!dbResult.affectedRows) {
                isSuccess = false;
                break;
            }
        }
        if (isSuccess) {
            let paymentReceiptMasterData = await DB.execute(`SELECT * FROM payment_receipt_master`);
            let paymentReceiptDetailsData = await DB.execute(
                `SELECT * FROM payment_receipt_detail`
            );
            paymentReceiptMasterData = paymentReceiptMasterData[0];
            paymentReceiptDetailsData = paymentReceiptDetailsData[0];
            res.json({
                isSuccess: true,
                message: "Data inserted successfully",
                data: {
                    paymentReceiptMasterData,
                    paymentReceiptDetailsData,
                },
            });
        } else {
            res.json({
                isSuccess: false,
                message: "Somthing went wrong while inserting data into database",
                data: {},
            });
        }
    } else {
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {},
        });
    }
}
async function deleteRow(req, res) {
    let dbResult = await DB.execute("DELETE FROM payment_master WHERE `RECM_ID`=?", [req.body.RECM_ID]);
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let paymentReceiptMasterData = await DB.execute(`SELECT * FROM receipt_master`);
        paymentReceiptMasterData = paymentReceiptMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data deleted successfully",
            data: {
                paymentReceiptMasterData,
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Something went wrong while deleting row",
            data: {},
        });
    }
}



module.exports = {
    addPaymentReceipt,
    getPaymentReceipt,
    editPaymentReceipt,
    deleteRow
};
