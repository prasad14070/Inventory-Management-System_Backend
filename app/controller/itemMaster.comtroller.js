let DB = require("../model/database");
let joi = require("joi");

async function addItemData(req, res) {
    // Insert data into database
    let dbResult = await DB.execute(
        "INSERT INTO item_master (IM_ID, IM_NAME, IM_ALIAS, IM_DEPART_ID, IM_DEPARTMENT_NAME, IM_GROUP, IM_MANUFACTURE, IM_UNDER, IM_UNIT, IM_MRP, IM_PUR_RATE, IM_SALES_RATE, IM_PACK, IM_HSN_CODE, IM_SGST, IM_CGST, IM_IGST, IM_LOCATION, IM_IS_Active, IM_IS_DEFAULT, COMP_ID, IM_DISC_PER, CREATED_BY, CREATED_AT, UPDATED_BY, UPDATED_AT) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.imId || null,
            req.body.imName || null,
            req.body.imAlias || null,
            req.body.imDepartId || null,
            req.body.imDepartmentName || null,
            req.body.imGroup || null,
            req.body.imManufacture || null,
            req.body.imUnder || null,
            req.body.imUnit || null,
            req.body.imMrp || null,
            req.body.imPurRate || null,
            req.body.imSalesRate || null,
            req.body.imPack || null,
            req.body.imHsnCode || null,
            req.body.imSgst || null,
            req.body.imCgst || null,
            req.body.imIgst || null,
            req.body.imLocation || null,
            req.body.imIsActive || null,
            req.body.imIsDefault || null,
            req.body.compId || null,
            req.body.imDiscPer || null,
            req.body.created_by,
            req.body.created_at,
            JSON.stringify(req.body.updated_by),
            JSON.stringify(req.body.updated_at),
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let itemMasterData = await DB.execute(`SELECT * FROM item_master`);
        itemMasterData = itemMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data inserted successfully",
            data: {
                itemMasterData,
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

async function editItemData(req, res) {
    let dbResult = await DB.execute(
        "UPDATE ITEM_MASTER SET IM_NAME=?, IM_ALIAS=?, IM_DEPART_ID=?, IM_DEPARTMENT_NAME=?, IM_GROUP=?, IM_MANUFACTURE=?, IM_UNDER=?, IM_UNIT=?, IM_MRP=?, IM_PUR_RATE=?, IM_SALES_RATE=?, IM_PACK=?, IM_HSN_CODE=?, IM_SGST=?, IM_CGST=?, IM_IGST=?, IM_LOCATION=?, IM_IS_Active=?, IM_IS_DEFAULT=?, COMP_ID=?, IM_DISC_PER=?, `UPDATED_BY`=JSON_ARRAY_APPEND(UPDATED_BY, '$', ?), `UPDATED_AT`=JSON_ARRAY_APPEND(UPDATED_AT, '$', ?) WHERE IM_ID=?",
        [
            req.body.imName || null,
            req.body.imAlias || null,
            req.body.imDepartId || null,
            req.body.imDepartmentName || null,
            req.body.imGroup || null,
            req.body.imManufacture || null,
            req.body.imUnder || null,
            req.body.imUnit || null,
            req.body.imMrp || null,
            req.body.imPurRate || null,
            req.body.imSalesRate || null,
            req.body.imPack || null,
            req.body.imHsnCode || null,
            req.body.imSgst || null,
            req.body.imCgst || null,
            req.body.imIgst || null,
            req.body.imLocation || null,
            req.body.imIsActive || null,
            req.body.imIsDefault || null,
            req.body.compId || null,
            req.body.imDiscPer || null,
            req.body.updated_by,
            req.body.updated_at,
            req.body.imId,
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let itemMasterData = await DB.execute(`SELECT * FROM item_master`);
        itemMasterData = itemMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data updated successfully",
            data: {
                itemMasterData,
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

module.exports = {
    addItemData,
    editItemData,
};
