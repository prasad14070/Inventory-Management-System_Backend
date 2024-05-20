let DB = require("../model/database");
let joi = require("joi");
let jwt = require("jsonwebtoken");

async function addMenu(req, res) {
    // Insert data into database
    dbResult = await DB.execute(
        "INSERT INTO menu_master (`M_ID` , `M_NAME`, `M_FORM_LINK`, `M_PARENT_ID`, `M_HAVE_FORM`, `M_PREFIX`, `M_ORDER`, `M_ICON`, `M_TYPE`, `M_SHORT_KEY`, `M_IS_ACTIVE`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            req.body.menuId,
            req.body.menuName,
            req.body.menuFormLink,
            req.body.parentId,
            req.body.haveForm,
            req.body.menuPrefix,
            req.body.menuOrder,
            req.body.menuIcon,
            req.body.menuType,
            req.body.menuShortCutKey,
            req.body.isActive,
        ]
    );
    dbResult = dbResult[0];

    // Check if data inserted successfully or not and send response accordingly
    if (dbResult.affectedRows) {
        let menuMasterData = await DB.execute(`SELECT * FROM menu_master`);
        menuMasterData = menuMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data inserted successfully",
            data: {
                menuMasterData,
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

async function editMenu(req, res) {
    let dbResult = await DB.execute(
        "UPDATE menu_master SET `M_NAME`=?, `M_FORM_LINK`=?, `M_PARENT_ID`=?, `M_HAVE_FORM`=?, `M_PREFIX`=?, `M_ORDER`=?, `M_ICON`=?, `M_TYPE`=?, `M_SHORT_KEY`=?, `M_IS_ACTIVE`=? WHERE `M_ID`=? ",
        [
            req.body.menuName,
            req.body.menuFormLink,
            req.body.parentId,
            req.body.haveForm,
            req.body.menuPrefix,
            req.body.menuOrder,
            req.body.menuIcon,
            req.body.menuType,
            req.body.menuShortCutKey,
            req.body.isActive,
            req.body.menuId,
        ]
    );
    dbResult = dbResult[0];

    // Check if data inserted successfully or not and send response accordingly
    if (dbResult.affectedRows) {
        let menuMasterData = await DB.execute(`SELECT * FROM menu_master`);
        menuMasterData = menuMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data inserted successfully",
            data: {
                menuMasterData,
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
    addMenu,
    editMenu,
};
