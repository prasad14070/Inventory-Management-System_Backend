let DB = require("../model/database");
let joi = require("joi");
let jwt = require("jsonwebtoken");

// Difference between two arrays using set
function difference(array1, array2) {
    const set1 = new Set(array1);
    const set2 = new Set(array2);

    const difference1 = [...set1].filter((element) => !set2.has(element));
    const difference2 = [...set2].filter((element) => !set1.has(element));

    return [difference1, difference2];
}

async function addCompanyMenu(req, res) {
    let isSuccess = true;

    for (let element of req.body.menuId) {
        menuId = element.split(" ")[0];

        dbResult = await DB.execute(
            "INSERT INTO company_menu_master (`M_ID`, `LM_ID`, `IS_ACTIVE`, `CREATED_BY`, `CREATED_AT`, `UPDATED_BY`, `UPDATED_AT`) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                menuId,
                req.body.lmId,
                req.body.isActive,
                req.body.created_by,
                req.body.created_at,
                JSON.stringify(req.body.updated_by),
                JSON.stringify(req.body.updated_at),
            ]
        );
        dbResult = dbResult[0];

        if (!dbResult.affectedRows) {
            isSuccess = false;
            break;
        }
    }

    // Check if data inserted successfully or not and send response accordingly
    if (isSuccess) {
        let companyMenuMasterData = await DB.execute(`SELECT * FROM company_menu_master`);
        companyMenuMasterData = companyMenuMasterData[0];

        res.json({
            isSuccess: true,
            message: "Data inserted successfully",
            data: {
                companyMenuMasterData,
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

async function editCompanyMenu(req, res) {
    console.log(req.body);

    // Create Array of Menu Ids present in Client request
    let menuIdsFromClient = [];
    for (let element of req.body.menuId) {
        if (element) {
            menuIdsFromClient.push(Number(element.split(" ")[0]));
        }
    }

    // Create Array of Menu Ids present in data base
    let menuIdsFromDatabase = await DB.execute(
        `SELECT M_ID FROM company_menu_master WHERE LM_ID=?`,
        [req.body.lmId]
    );
    menuIdsFromDatabase = menuIdsFromDatabase[0];
    menuIdsFromDatabase = menuIdsFromDatabase.map((element) => {
        return element.M_ID;
    });

    // Difference
    let [menuToBeAdd, menuToBeRemove] = difference(menuIdsFromClient, menuIdsFromDatabase);

    console.log(menuToBeAdd);
    console.log(menuToBeRemove);

    let isSuccess = true;

    if (menuToBeAdd.length) {
        for (let menu of menuToBeAdd) {
            dbResult = await DB.execute(
                "INSERT INTO company_menu_master (`M_ID`, `LM_ID`, `IS_ACTIVE`, `UPDATED_BY`, `UPDATED_AT`) VALUES (?, ?, ?, ?, ?)",
                [
                    menu,
                    req.body.lmId,
                    req.body.isActive,
                    JSON.stringify(req.body.updated_by),
                    JSON.stringify(req.body.updated_at),
                ]
            );
            dbResult = dbResult[0];

            if (!dbResult.affectedRows) {
                isSuccess = false;
                break;
            }
        }
    }
    if (menuToBeRemove.length) {
        for (let menu of menuToBeRemove) {
            dbResult = await DB.execute(
                "DELETE FROM company_menu_master WHERE `LM_ID`=? AND `M_ID`=?",
                [req.body.lmId, menu]
            );
            dbResult = dbResult[0];

            if (!dbResult.affectedRows) {
                isSuccess = false;
                break;
            }
        }
    }

    if (isSuccess) {
        let companyMenuMasterData = await DB.execute(`SELECT * FROM company_menu_master`);
        companyMenuMasterData = companyMenuMasterData[0];

        res.json({
            isSuccess: true,
            message: "Permission modified",
            data: {
                companyMenuMasterData,
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Somthing went wrong while inserting data into database",
            data: {},
        });
    }
    // let menuId = req.body.menuId[0].split(" ")[0];

    // dbResult = await DB.execute(
    //     "UPDATE company_menu_master SET `M_ID`=?, `LM_ID`=?, `REFERENCE_ID`=?, `IS_ACTIVE`=?, `UPDATED_BY`=JSON_ARRAY_APPEND(UPDATED_BY, '$', ?), `UPDATED_AT`=JSON_ARRAY_APPEND(UPDATED_AT, '$', ?) WHERE `CMM_ID`=?",
    //     [
    //         menuId,
    //         req.body.lmId,
    //         req.body.referenceId,
    //         req.body.isActive,
    //         req.body.updated_by,
    //         req.body.updated_at,
    //         req.body.cmmId,
    //     ]
    // );
    // dbResult = dbResult[0];

    // if (dbResult.affectedRows) {
    //     let companyMenuMasterData = await DB.execute(`SELECT * FROM company_menu_master`);
    //     companyMenuMasterData = companyMenuMasterData[0];

    //     res.json({
    //         isSuccess: true,
    //         message: "Data inserted successfully",
    //         data: {
    //             companyMenuMasterData,
    //         },
    //     });
    // } else {
    //     res.json({
    //         isSuccess: false,
    //         message: "Somthing went wrong while inserting data into database",
    //         data: {},
    //     });
    // }
}

module.exports = {
    addCompanyMenu,
    editCompanyMenu,
};
