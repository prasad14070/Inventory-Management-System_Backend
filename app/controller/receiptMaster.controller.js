let DB = require("../model/database");

async function getPaymentReceipt(req, res) {

    const comp_id = parseInt(req.params.comp_id);


    let dbResultMaster = comp_id == 1 ? await DB.execute("SELECT * FROM receipt_master") : await DB.execute("SELECT * FROM receipt_master where comp_id = "+comp_id);

    let count = await DB.execute("SELECT count(*) as count from receipt_master");


    dbResultMaster = dbResultMaster[0];

    if (dbResultMaster?.length) {
        res.json({
            isSuccess: true,
            message: "Data fetched successfully",
            data: {
                receiptMasterData: dbResultMaster,
                max_id: count[0][0]['count']
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Purchase data is empty Or Failed to fetch data",
            data: {
                max_id: count[0][0]['count']
            },
        });
    }
}

async function addPaymentReceipt(req, res) {
    console.log("here here======?")
    console.log(req.body);
    let dbResult = await DB.execute(
        "INSERT INTO receipt_master (`RECM_ID`, `COMP_ID`, `RECM_DATE`, `RECM_TYPE`, `RECM_MODE_CR`, `RECM_AC_NAME_DB`, `RECM_AMOUNT`, `RECM_NARRATION`, `YEAR`, `CREATED_BY`, `CREATED_AT`, `UPDATED_BY`, `UPDATED_AT`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.prmId,
            req.body.comp_id,
            req.body.prmDate,
            null,
            req.body.prmMode,
            req.body.prmAcName,
            parseFloat(req.body.prmAmount),
            req.body.prmNarration,
            parseInt(req.body.year),
            req.body.created_by,
            req.body.created_at,
            JSON.stringify(req.body.updated_by),
            JSON.stringify(req.body.updated_at),
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let count = await DB.execute("SELECT count(*) as count from receipt_master");
        let isSuccess = true;

        if (isSuccess) {
            let receiptMasterData = parseInt(req.body.comp_id) == 1 ? await DB.execute("SELECT * FROM receipt_master") : await DB.execute("SELECT * FROM receipt_master where comp_id = "+parseInt(req.body.comp_id));
            receiptMasterData = receiptMasterData[0];

            res.json({
                isSuccess: true,
                message: "Data inserted successfully",
                data: {
                    receiptMasterData,
                    max_id: count[0][0]['count']
                },
            });
        } else {
            res.json({
                isSuccess: false,
                message: "Somthing went wrong while inserting data into database",
                data: {
                    max_id: count[0][0]['count']
                },
            });
        }
    } else {
        let count = await DB.execute("SELECT count(*) as count from receipt_master");
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {
                max_id: count[0][0]['count']
            },
        });
    }
}

async function editPaymentReceipt(req, res) {
    console.log("here here======?")
    console.log(req.body);
    let dbResult = await DB.execute(
        "UPDATE receipt_master SET  `RECM_MODE_CR`=?, `RECM_DATE`=?, `RECM_AC_NAME_DB`=?, `RECM_AMOUNT`=?, `RECM_NARRATION`=?, `YEAR`=?, `UPDATED_BY`=JSON_ARRAY_APPEND(UPDATED_BY, '$', ?), `UPDATED_AT`=JSON_ARRAY_APPEND(UPDATED_AT, '$', ?) WHERE `RECM_ID`=?",
        [   
            req.body.prmMode,
            req.body.prmDate,
            req.body.prmAcName,
            parseFloat(req.body.prmAmount),
            req.body.prmNarration,
            req.body.year,
            req.body.updated_by,
            req.body.updated_at,
            req.body.prmId,
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let count = await DB.execute("SELECT count(*) as count from receipt_master");
        let isSuccess = true;
        if (isSuccess) {
            let receiptMasterData = parseInt(req.body.comp_id) == 1 ? await DB.execute("SELECT * FROM receipt_master") : await DB.execute("SELECT * FROM receipt_master where comp_id = "+parseInt(req.body.comp_id));
            receiptMasterData = receiptMasterData[0];
            res.json({
                isSuccess: true,
                message: "Data inserted successfully",
                data: {
                    receiptMasterData,
                    max_id: count[0][0]['count']
                },
            });
        } else {
            res.json({
                isSuccess: false,
                message: "Somthing went wrong while inserting data into database",
                data: {
                    max_id: count[0][0]['count']
                },
            });
        }
    } else {
        let count = await DB.execute("SELECT count(*) as count from receipt_master");
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {
                max_id: count[0][0]['count']
            },
        });
    }
}
async function deleteRow(req, res) {
    let dbResult = await DB.execute("DELETE FROM receipt_master WHERE `RECM_ID`=?", [req.body.RECM_ID]);
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let receiptMasterData = await DB.execute(`SELECT * FROM receipt_master`);
       receiptMasterData = receiptMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data deleted successfully",
            data: {
                receiptMasterData,
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
