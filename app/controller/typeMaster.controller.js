let DB = require("../model/database");
let joi = require("joi");

async function addType(req, res) {
    // Insert data into database
    dbResult = await DB.execute(
        "INSERT INTO type_master (`TM_ID`, `TM_NAME`, `TNM_ID`,`TNM_NAME` , `TM_NAME_ID`, `TM_REMARKS_1`, `TM_REMARKS_2`, `IS_ACTIVE`, `IS_DEFAULT`, `IS_DELETE`, `CREATED_BY`, `CREATED_AT`, `UPDATED_BY`, `UPDATED_AT`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.tmId,
            req.body.tmName,
            req.body.tnmId,
            req.body.tnmName,
            req.body.tmNameId,
            req.body.remark1,
            req.body.remark2,
            req.body.isActive,
            req.body.isDefault,
            req.body.isDeleted,
            req.body.created_by,
            req.body.created_at,
            JSON.stringify(req.body.updated_by),
            JSON.stringify(req.body.updated_at),
        ]
    );
    dbResult = dbResult[0];

    // Check if data inserted successfully or not and send response accordingly
    if (dbResult.affectedRows) {
        let typeMasterData = await DB.execute(`SELECT * FROM type_master`);
        typeMasterData = typeMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data inserted successfully",
            data: {
                typeMasterData,
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

async function editType(req, res) {
    // Insert data into database
    dbResult = await DB.execute(
        "UPDATE type_master SET `TM_NAME`=?, `TNM_ID`=?,`TNM_NAME`=?, `TM_NAME_ID`=?, `IS_ACTIVE`=?, `IS_DEFAULT`=?, `IS_DELETE`=?, `UPDATED_BY`=JSON_ARRAY_APPEND(UPDATED_BY, '$', ?), `UPDATED_AT`=JSON_ARRAY_APPEND(UPDATED_AT, '$', ?) WHERE `TM_ID`=? ",
        [
            req.body.tmName,
            req.body.tnmId,
            req.body.tnmName,
            req.body.tmNameId,
            req.body.isActive,
            req.body.isDefault,
            req.body.isDeleted,
            req.body.updated_by,
            req.body.updated_at,
            req.body.tmId,
        ]
    );
    dbResult = dbResult[0];

    // Check if data inserted successfully or not and send response accordingly
    if (dbResult.affectedRows) {
        let typeMasterData = await DB.execute(`SELECT * FROM type_master`);
        typeMasterData = typeMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data inserted successfully",
            data: {
                typeMasterData,
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
    addType,
    editType,
};
