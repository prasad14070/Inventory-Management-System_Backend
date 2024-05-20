let DB = require("../model/database");

async function getPaymentReceipt(req, res) {

    const comp_id = parseInt(req.params.comp_id);

    let dbResultMaster = comp_id == 1 ? await DB.execute("SELECT * FROM payment_master") : await DB.execute("SELECT * FROM payment_master where comp_id = "+comp_id);

    let count = await DB.execute("SELECT count(*) as count from payment_master");
    
    
    dbResultMaster = dbResultMaster[0];

    if (dbResultMaster?.length) {
        res.json({
            isSuccess: true,
            message: "Data fetched successfully",
            data: {
                paymentMasterData: dbResultMaster,
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
        "INSERT INTO payment_master (`PAYM_ID`, `COMP_ID`, `PAYM_DATE`, `PAYM_MODE_CR`, `PAYM_AC_NAME_DB`, `PAYM_AMOUNT`, `PAYM_NARRATION`, `YEAR`, `CREATED_BY`, `CREATED_AT`, `UPDATED_BY`, `UPDATED_AT`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.prmId,
            req.body.comp_id,
            req.body.prmDate,
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
        let count = await DB.execute("SELECT count(*) as count from payment_master");
        let isSuccess = true;

        if (isSuccess) {
            let paymentMasterData = parseInt(req.body.comp_id) == 1 ? await DB.execute("SELECT * FROM payment_master") : await DB.execute("SELECT * FROM payment_master where comp_id = "+parseInt(req.body.comp_id));
            paymentMasterData = paymentMasterData[0];

           

            res.json({
                isSuccess: true,
                message: "Data inserted successfully",
                data: {
                    paymentMasterData,
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
        let count = await DB.execute("SELECT count(*) as count from payment_master");
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
        "UPDATE payment_master SET `PAYM_MODE_CR`=?, `PAYM_DATE`=?, `PAYM_AC_NAME_DB`=?, `PAYM_AMOUNT`=?, `PAYM_NARRATION`=?, `YEAR`=?, `UPDATED_BY`=JSON_ARRAY_APPEND(UPDATED_BY, '$', ?), `UPDATED_AT`=JSON_ARRAY_APPEND(UPDATED_AT, '$', ?) WHERE `PAYM_ID`=?",
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
        let count = await DB.execute("SELECT count(*) as count from payment_master");
        let isSuccess = true;
        if (isSuccess) {
            let paymentMasterData = parseInt(req.body.comp_id) == 1 ? await DB.execute("SELECT * FROM payment_master") : await DB.execute("SELECT * FROM payment_master where comp_id = "+parseInt(req.body.comp_id));
            paymentMasterData = paymentMasterData[0];
            res.json({
                isSuccess: true,
                message: "Data inserted successfully",
                data: {
                    paymentMasterData,
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
        let count = await DB.execute("SELECT count(*) as count from payment_master");
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
    let dbResult = await DB.execute("DELETE FROM payment_master WHERE `PAYM_ID`=?", [req.body.PAYM_ID]);
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let paymentMasterData = await DB.execute(`SELECT * FROM payment_master`);
        paymentMasterData = paymentMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data deleted successfully",
            data: {
                paymentMasterData,
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
    deleteRow,

};
