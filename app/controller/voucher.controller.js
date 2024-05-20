let DB = require("../model/database");

async function getVoucher(req, res) {
    const comp_id = parseInt(req.params.comp_id);
    let dbResultDetail = await DB.execute("SELECT * FROM journal_voucher_details");
    let dbResultMaster = comp_id == 1 ? await DB.execute("SELECT * FROM journal_voucher_master") :  await DB.execute("SELECT * FROM journal_voucher_master where comp_id = "+comp_id);
    let count = await DB.execute("SELECT count(*) as count from journal_voucher_master");
    dbResultDetail = dbResultDetail[0];
    dbResultMaster = dbResultMaster[0];

    if (dbResultDetail?.length && dbResultMaster?.length) {
        res.json({
            isSuccess: true,
            message: "Data fetched successfully",
            data: {
                journalVoucherDetailsData: dbResultDetail,
                journalVoucherMasterData: dbResultMaster,
                max_id: count[0][0]['count']
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Voucher data is empty Or Failed to fetch data",
            data: {
                max_id: count[0][0]['count']
            },
        });
    }
}

async function addVouchers(req, res) {
    console.log("here here==============>");
    console.log(req.body)
    let dbResult = await DB.execute(
        "INSERT INTO journal_voucher_master (`JVM_ID`, `JVM_TYPE`, `JVM_TYPE_WISE_ID`, `JVM_DATE`, `YEAR`, `JVM_NARRATION`, `COMP_ID`, `JVM_CR_TOTAL`, `JVM_DB_TOTAL`, `CREATED_BY`, `CREATED_AT`, `UPDATED_BY`, `UPDATED_AT`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.jvmId,
            req.body.jvmType,
            req.body.jvmTypeNo,
            req.body.jvmDate,
            parseInt(req.body.year),
            req.body.jvmNarration,
            req.body.comp_id,
            req.body.jvdCrTotal,
            req.body.jvdDbTotal,
            req.body.created_by,
            req.body.created_at,
            JSON.stringify(req.body.updated_by),
            JSON.stringify(req.body.updated_at),
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let isSuccess = true;
        for (let element of req.body.jvdArray) {
            dbResult = await DB.execute(
                "INSERT INTO journal_voucher_details (`JVM_ID`, `JVD_CR_DB`, `JVD_AC_NAME`, `JVD_CR_AMT`, `JVD_DB_AMT`, `JVD_NARRATION`) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    req.body.jvmId,
                    element.dbCr,
                    element.acName,
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

        let count = await DB.execute("SELECT count(*) as count from journal_voucher_master");

        if (isSuccess) {
            let journalVoucherMasterData = parseInt(req.body.comp_id) == 1 ? await DB.execute("SELECT * FROM journal_voucher_master") :  await DB.execute("SELECT * FROM journal_voucher_master where comp_id = "+parseInt(req.body.comp_id));
            let journalVoucherDetailsData = await DB.execute(
                `SELECT * FROM journal_voucher_details`
            );

            journalVoucherMasterData = journalVoucherMasterData[0];
            journalVoucherDetailsData = journalVoucherDetailsData[0];

            res.json({
                isSuccess: true,
                message: "Data inserted successfully",
                data: {
                    journalVoucherMasterData,
                    journalVoucherDetailsData,
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
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {
                max_id: count[0][0]['count']
            },
        });
    }
}

async function editVoucher(req, res) {
    console.log("here here==============>");
    console.log(req.body)
    let dbResult = await DB.execute(
        "UPDATE journal_voucher_master SET `JVM_TYPE`=?, `JVM_TYPE_WISE_ID`=?, `JVM_DATE`=?, `YEAR`=?, `COMP_ID`=?, `JVM_NARRATION`=?, `JVM_CR_TOTAL`=?, `JVM_DB_TOTAL`=?, `UPDATED_BY`=JSON_ARRAY_APPEND(UPDATED_BY, '$', ?), `UPDATED_AT`=JSON_ARRAY_APPEND(UPDATED_AT, '$', ?) WHERE `JVM_ID`=?",
        [
            req.body.jvmType,
            req.body.jvmTypeNo,
            req.body.jvmDate,
            parseInt(req.body.year),
            req.body.comp_id,
            req.body.jvmNarration,
            req.body.jvdCrTotal,
            req.body.jvdDbTotal,
            req.body.updated_by,
            req.body.updated_at,
            req.body.jvmId,
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let isSuccess = true;
        // for (let element of req.body.jvdArray) {
        //     dbResult = await DB.execute(
        //         "UPDATE journal_voucher_details SET `JVD_CR_DB`=?, `JVD_AC_NAME`=?, `JVD_REF`=?, `JVD_CR_AMT`=?, `JVD_DB_AMT`=?, `JVD_NARRATION`=? WHERE `JVD_ID`=?",
        //         [
        //             element.dbCr,
        //             element.acName,
        //             element.advAgst,
        //             element.cr,
        //             element.db,
        //             element.narration,
        //             element.jvdId,
        //         ]
        //     );
        //     dbResult = dbResult[0];
        //     if (!dbResult.affectedRows) {
        //         isSuccess = false;
        //         break;
        //     }
        // }

        req.body.deletedItem.map(async (item) => {

            var dltPurchase = await DB.execute("DELETE FROM journal_voucher_details where JVD_ID = " + item.jvdId);
            // if (!dltPurchase.affectedRows) {
            //     await DB.rollback();
            // }
        });

        let count = await DB.execute("SELECT count(*) as count from journal_voucher_master");


        if (isSuccess) {
            let journalVoucherMasterData = parseInt(req.body.comp_id) == 1 ? await DB.execute("SELECT * FROM journal_voucher_master") :  await DB.execute("SELECT * FROM journal_voucher_master where comp_id = "+parseInt(req.body.comp_id));
            let journalVoucherDetailsData = await DB.execute(
                `SELECT * FROM journal_voucher_details`
            );
            journalVoucherMasterData = journalVoucherMasterData[0];
            journalVoucherDetailsData = journalVoucherDetailsData[0];
            res.json({
                isSuccess: true,
                message: "Data inserted successfully",
                data: {
                    journalVoucherMasterData,
                    journalVoucherDetailsData,
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
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {
                max_id: count[0][0]['count']
            },
        });
    }
}

module.exports = {
    addVouchers,
    getVoucher,
    editVoucher,
};
