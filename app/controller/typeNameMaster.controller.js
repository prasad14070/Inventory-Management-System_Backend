let DB = require("../model/database");
let joi = require("joi");

async function addTypeName(req, res) {
    // Insert data into database
    dbResult = await DB.execute(
        "INSERT INTO type_name_master (`TNM_ID`, `TNM_NAME`, `IS_ACTIVE`, `IS_GROUP`, `REMARK_DISPLAY`, `CREATED_BY`, `CREATED_AT`, `UPDATED_BY`, `UPDATED_AT`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.tnmId,
            req.body.typeName,
            req.body.isActive,
            req.body.isGroup,
            req.body.remarkDisplay,
            req.body.created_by,
            req.body.created_at,
            JSON.stringify(req.body.updated_by),
            JSON.stringify(req.body.updated_at),
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let typeNameMasterData = await DB.execute(
            `SELECT * FROM type_name_master`
        );
        typeNameMasterData = typeNameMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data inserted successfully",
            data: {
                typeNameMasterData,
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

async function editTypeName(req, res) {
    // Insert data into database
    dbResult = await DB.execute(
        "UPDATE type_name_master SET `TNM_NAME`=?, `IS_ACTIVE`=?, `IS_GROUP`=?, `REMARK_DISPLAY`=?, `UPDATED_BY`=JSON_ARRAY_APPEND(UPDATED_BY, '$', ?), `UPDATED_AT`=JSON_ARRAY_APPEND(UPDATED_AT, '$', ?) WHERE `TNM_ID`=? ",
        [
            req.body.typeName,
            req.body.isActive,
            req.body.isGroup,
            req.body.remarkDisplay,
            req.body.updated_by,
            req.body.updated_at,
            req.body.tnmId,
        ]
    );
    dbResult = dbResult[0];

    if (dbResult.affectedRows) {
        let typeNameMasterData = await DB.execute(
            `SELECT * FROM type_name_master`
        );
        typeNameMasterData = typeNameMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data inserted successfully",
            data: {
                typeNameMasterData,
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
    addTypeName,
    editTypeName,
};
