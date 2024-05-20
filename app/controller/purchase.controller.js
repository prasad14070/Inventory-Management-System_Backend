let DB = require("../model/database");
let joi = require("joi");
let jwt = require("jsonwebtoken");

async function getPurchase(req, res) {
    const comp_id = parseInt(req.params.comp_id);
    let dbResultPurchaseDetail = await DB.execute("SELECT * FROM purchase_details");
    let dbResultPurchaseMaster = comp_id == 1 ? await DB.execute("SELECT * FROM purchase_master") : await DB.execute("SELECT * FROM purchase_master where comp_id = " + comp_id);
    let count = await DB.execute("SELECT count(*) as count from purchase_master");

    dbResultPurchaseDetail = dbResultPurchaseDetail[0];
    dbResultPurchaseMaster = dbResultPurchaseMaster[0];
    console.log('db===>')
    console.log(dbResultPurchaseDetail);

    if (dbResultPurchaseDetail?.length && dbResultPurchaseMaster?.length) {
        res.json({
            isSuccess: true,
            message: "Data fetched successfully",
            data: {
                purchaseMasterData: dbResultPurchaseMaster,
                purchaseDetailsData: dbResultPurchaseDetail,
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

async function addPurchase(req, res) {
    console.log("created=========>" + req.body.created_at + "/" + req.body.created_by);
    let dbResult = await DB.execute(
        "INSERT INTO purchase_master (`PM_ID`, `PM_TYPE`, `PM_NO`, `PM_INWARD_NO`, `PM_INWARD_DATE`, `PM_REF`, `PM_PUR_DATE`, `PM_GST_TYPE`, `PM_CR_LIMIT`, `PM_AC_NAME`, `PM_LEDGER`, `PM_PO`, `PM_GROSS_AMT`, `PM_AMT`, `PM_TOTAL_QTY`, `PM_PAID_AMT`, `PM_FNARRATION`, `YEAR`, `COMP_ID`, `CREATED_BY`, `CREATED_AT`, `UPDATED_BY`, `UPDATED_AT` ) VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.pmId,
            req.body.pmType,
            req.body.pmNo,
            req.body.pmInwardNo,
            req.body.pmInwardDate,
            req.body.pmReference,
            req.body.pmPurchaseDate,
            req.body.pmGstType,
            req.body.pmCrLimit,
            req.body.pmAcName,
            req.body.pmLedger,
            req.body.pmPo,
            req.body.pmGrossAmt,
            req.body.pmAmt,
            req.body.pmTotalQty,
            req.body.pmPayedAmt,
            req.body.pmnarration,
            req.body.pmYear,
            req.body.pmCompId,
            req.body.created_by,
            req.body.created_at,
            JSON.stringify(req.body.updated_by),
            JSON.stringify(req.body.updated_at),
        ]
    );
    dbResult = dbResult[0];


    var stockResult = await DB.execute("SELECT * FROM STOCK_MASTER WHERE COMP_ID = " + req.body.pmCompId);



    console.log("stock=========>");
    console.log(stockResult[0]);
    stockResult = stockResult[0];

    if (dbResult.affectedRows) {
        let count = await DB.execute("SELECT count(*) as count from purchase_master");
        let maxPmNo = await DB.execute("SELECT MAX(PM_NO) AS MAX_PMNO FROM purchase_master");
        let isSuccess = true;
        for (let element of req.body.purchaseDetailsArray) {
            dbResult = await DB.execute(
                "INSERT INTO purchase_details (`PM_ID`, `PD_SR_NO`, `PD_ITEM_ID`, `PD_PACK`, `PD_UNIT`, `PD_BATCH`, `PD_DOE`, `PD_MRP`, `PD_PUR_RATE`, `PD_SALES_RATE`, `PD_QTY`, `PD_FREE`, `PD_DISC_PER`, `PD_DISC_AMT`, `PD_TOTAL_AFTER_DISC`, `PD_GRAND_TOTAL`, `PD_TAX_PER`, `PD_TAX_AMT`, `PD_ATAX_PER`, `PD_ATAX_AMT`, `PD_IGST_PER`, `PD_IGST_AMT`, `PD_NARRATION`, `DB_CR`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )",
                [
                    req.body.pmId,
                    "NA",
                    element.pdId,
                    element.pdPack,
                    "NA",
                    element.pdBatchNo,
                    element.pdDoe,
                    "NA",
                    element.pdPurRate,
                    element.pdSalesRate,
                    element.pdQty,
                    element.pdFree,
                    element.pdDiscPer,
                    element.pdDiscAmt,
                    element.pdTotalAfterDisc,
                    element.pdGrandTotal,
                    "NA",
                    "NA",
                    "NA",
                    "NA",
                    "NA",
                    "NA",
                    "NA",
                    element.pdDbCr,
                ]
            );
            dbResult = dbResult[0];

            if (!dbResult.affectedRows) {
                isSuccess = false;
                break;
            }

            var st_id = null;
            stockResult.forEach((item) => {
                if (item.ST_ITEM_ID === parseInt(element.pdId)) {
                    st_id = item.ST_ID;
                }
            });

            if (st_id) {
                var stockUpdateResult = DB.execute("UPDATE STOCK_MASTER set ST_ADD = ST_ADD + " + element.pdQty + ", ST_CURRENT=ST_CURRENT + " + element.pdQty+" where ST_ID = "+st_id);
            }
            else {
                var dateF = req.body.created_at;
                console.log("date=>");
                const parts = dateF.split("/");

                // Create a Date object from the year, month, and day
                const fdate = new Date(parts[2].slice(0,4), parts[1] - 1, parts[0]);
                console.log(fdate);
                var l = [
                    req.body.pmNo,
                    (req.body.pmId).toString(),
                    fdate,
                    "PUR",
                    parseInt(element.pdId),
                    parseFloat(element.pdQty),
                    parseFloat(0),
                    parseFloat(element.pdQty),
                    parseInt(req.body.pmCompId),
                    req.body.pmYear,
                    parseInt(req.body.pmCompId),
                ];
                console.log("Iam passing===>");
                console.log(l);
                try {
                    var createStock = await DB.execute("INSERT INTO STOCK_MASTER (`ST_TYPE_ID`, `ST_BILL_NO`, `ST_DATE`, `ST_TYPE`, `ST_ITEM_ID`, `ST_ADD`, `ST_LESS`, `ST_CURRENT`, `LM_ID`, `YEAR`, `COMP_ID`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        l);
                }
                catch (e) {
                    console.log("Error=======>");
                    console.log(e);
                }
            }
        }

        if (isSuccess) {

            let purchaseMasterData = parseInt(req.body.pmCompId) == 1 ? await DB.execute("SELECT * FROM purchase_master") : await DB.execute("SELECT * FROM purchase_master where comp_id = " + parseInt(req.body.pmCompId));
            let purchaseDetailsData = await DB.execute(`SELECT * FROM purchase_details`);

            purchaseMasterData = purchaseMasterData[0];
            purchaseDetailsData = purchaseDetailsData[0];

            res.json({
                isSuccess: true,
                message: "Data inserted successfully",
                data: {
                    purchaseMasterData,
                    purchaseDetailsData,
                    max_id: count[0][0]['count'],
                    max_pm_no: maxPmNo[0][0]['MAX_PMNO']
                },
            });
        } else {
            await DB.rollback();
            res.json({
                isSuccess: false,
                message: "Somthing went wrong while inserting data into database",
                data: {
                    max_id: count[0][0]['count'],
                    max_pm_no: maxPmNo[0][0]['MAX_PMNO']
                },
            });
        }
    } else {
        let count = await DB.execute("SELECT count(*) as count from purchase_master");
        await DB.rollback();
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {
                max_id: count[0][0]['count'],
                max_pm_no: maxPmNo[0][0]['MAX_PMNO']
            },
        });
    }
}

async function editPurchase(req, res) {
    console.log("here here==============>");
    console.log(req.body);
    var stockResult = await DB.execute("SELECT * FROM STOCK_MASTER WHERE COMP_ID = " + req.body.pmCompId);
    let dbResult = await DB.execute(
        "UPDATE purchase_master SET  `PM_TYPE`=?, `PM_REF`=?, `PM_PUR_DATE`=?, `PM_AC_NAME`=?, `PM_LEDGER`=?, `PM_CR_LIMIT`=?, `PM_GST_TYPE`=?, `PM_AMT`=?, `PM_TOTAL_QTY`=?, `PM_PAID_AMT`=?, `PM_FNARRATION`=?, `UPDATED_BY`=JSON_ARRAY_APPEND(UPDATED_BY, '$', ?), `UPDATED_AT`=JSON_ARRAY_APPEND(UPDATED_AT, '$', ?) WHERE `PM_ID`=?",
        [
            req.body.pmType,
            req.body.pmReference,
            req.body.pmPurchaseDate,
            req.body.pmAcName,
            req.body.pmLedger,
            req.body.pmCrLimit,
            req.body.pmGstType,
            req.body.pmAmt,
            req.body.pmTotalQty,
            req.body.pmPayedAmt,
            req.body.pmnarration,
            JSON.stringify(req.body.updated_by),
            JSON.stringify(req.body.updated_at),
            req.body.pmId,
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let isSuccess = true;

        // for (let element of req.body.purchaseDetailsArray) {
        //     dbResult = await DB.execute(
        //         "UPDATE journal_voucher_details SET `PD_PACK`=?, `PD_BATCH`=?, `PD_DOE`=?, `PD_PUR_RATE`=?, `PD_SALES_RATE`=?, `PD_QTY`=?, `PD_FREE`=?, `PD_DISC_PER`=?, `PD_DISC_AMT`=?, `PD_TOTAL_AFTER_DISC`=?, `PD_GRAND_TOTAL`=?, `DB_CR`=? WHERE `PM_ID`=?",
        //         [
        //             element.pdPack,
        //             element.pdBatchNo,
        //             element.pdDoe,
        //             element.pdPurRate,
        //             element.pdSalesRate,
        //             element.pdQty,
        //             element.pdFree,
        //             element.pdDiscPer,
        //             element.pdDiscAmt,
        //             element.pdTotalAfterDisc,
        //             element.pdGrandTotal,
        //             element.pdDbCr,
        //             req.body.pmId,
        //         ]
        //     );

        //     var st_id = null;
        //     stockResult.forEach((item)=>{
        //         if(item.ST_ITEM_ID === element.pdId){
        //             st_id = item.ST_ID;
        //         }
        //     });

        //     if(st_id){
        //         var stockUpdateResult = DB.execute("UPDATE STOCK_MASTER set ST_ADD = ST_ADD + "+element.pdQty);
        //     }

        //     dbResult = dbResult[0];
        //     if (!dbResult.affectedRows) {
        //         isSuccess = false;
        //         break;
        //     }
        // }

        req.body.deletedItem.map(async (item) => {

            var stockDlt = await DB.execute("UPDATE stock_master SET ST_ADD = ST_ADD - " + item.item_qty + ", ST_CURRENT = ST_CURRENT - " + item.item_qty + " WHERE ST_ITEM_ID = " + item.item_id);

            var dltPurchase = await DB.execute("DELETE FROM purchase_details where PD_ID = " + item.pd_id);
            // if (!dltPurchase.affectedRows) {
            //     await DB.rollback();
            // }
        });

        let count = await DB.execute("SELECT count(*) as count from purchase_master");
        let maxPmNo = await DB.execute("SELECT MAX(PM_NO) AS MAX_PMNO FROM purchase_master");

        if (isSuccess) {
            let purchaseMasterData = parseInt(req.body.comp_id) == 1 ? await DB.execute("SELECT * FROM purchase_master") : await DB.execute("SELECT * FROM purchase_master where comp_id = " + parseInt(req.body.pmCompId));
            let purchaseDetailsData = await DB.execute(
                `SELECT * FROM purchase_details`
            );
            
            console.log("maxPmNo")
            console.log(maxPmNo);
            purchaseMasterData = purchaseMasterData[0];
            purchaseDetailsData = purchaseDetailsData[0];
            res.json({
                isSuccess: true,
                message: "Data inserted successfully",
                data: {
                    purchaseMasterData,
                    purchaseDetailsData,
                    max_id: count[0][0]['count'],
                    max_pm_no: maxPmNo[0][0]['MAX_PMNO']
                },
            });
        } else {
            res.json({
                isSuccess: false,
                message: "Somthing went wrong while inserting data into database",
                data: {
                    max_id: count[0][0]['count'],
                    max_pm_no: maxPmNo[0][0]['MAX_PMNO']
                },
            });
        }
    } else {
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {
                max_id: count[0][0]['count'],
                max_pm_no: maxPmNo[0][0]['MAX_PMNO']
            },
        });
    }
}
async function deleteRow(req, res) {
    let dbResult = await DB.execute("DELETE FROM purchase_master WHERE `PM_ID`=?", [req.body.PM_ID]);
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let purchaseMasterData = await DB.execute(`SELECT * FROM purchase_master`);
        purchaseMasterData = purchaseMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data deleted successfully",
            data: {
                purchaseMasterData,
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
    getPurchase,
    addPurchase,
    editPurchase,
    deleteRow
};
