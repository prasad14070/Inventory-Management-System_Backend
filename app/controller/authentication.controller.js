let DB = require("../model/database");
let joi = require("joi");
let jwt = require("jsonwebtoken");

function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
}

async function login(req, res) {
    let dbResult = await DB.execute(
        "SELECT * FROM ledger_master WHERE LM_EMAIL=? OR LM_MOBILE=? OR LM_PHONE=?",
        [req.body.email, req.body.mobile, req.body.mobile]
    );
    dbResult = dbResult[0];

    if (dbResult.length && dbResult[0].LM_PASSWORD == req.body.password && dbResult[0].IS_ACTIVE) {
        let token = generateToken({
            email: req.body.email,
            password: req.body.password,
        });
        res.json({
            isSuccess: true,
            message: "Login Successful",
            data: {
                email: dbResult[0]["LM_EMAIL"],
                lmId: dbResult[0]["LM_ID"],
                lmName: dbResult[0]["LM_NAME"],
                token: token,
            },
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Invalid Email or Password",
            data: {},
        });
    }
}

async function validateToken(req, res, next) {
    try {
        let result = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY);

        console.log(result);

        let dbResult = await DB.execute(
            "SELECT * FROM ledger_master WHERE LM_EMAIL=? AND LM_PASSWORD=?",
            [result.email, result.password]
        );
        dbResult = dbResult[0];

        if (dbResult.length) {
            res.json({
                isSuccess: true,
                message: "Token is valid",
                data: {},
            });
        } else {
            res.json({
                isSuccess: false,
                message: "Invalid token",
                data: {},
            });
        }
    } catch (error) {
        res.json({
            isSuccess: false,
            message: "Invalid token",
            data: {},
        });
    }
}

async function getMasterData(req, res) {
    let ledgerMasterData;
    let accountGroupData;
    let typeMasterData;
    let typeNameMasterData;
    let menuMasterData;
    let companyMenuMasterData;
    let itemMasterData;

    ledgerMasterData = await DB.execute(`SELECT * FROM ledger_master`);
    accountGroupData = await DB.execute(`SELECT * FROM account_group`);
    typeMasterData = await DB.execute(`SELECT * FROM type_master`);
    typeNameMasterData = await DB.execute(`SELECT * FROM type_name_master`);
    menuMasterData = await DB.execute(`SELECT * FROM menu_master`);
    companyMenuMasterData = await DB.execute(`SELECT * FROM company_menu_master`);
    itemMasterData = await DB.execute(`SELECT * FROM item_master`);

    ledgerMasterData = ledgerMasterData[0];
    accountGroupData = accountGroupData[0];
    typeMasterData = typeMasterData[0];
    typeNameMasterData = typeNameMasterData[0];
    menuMasterData = menuMasterData[0];
    companyMenuMasterData = companyMenuMasterData[0];
    itemMasterData = itemMasterData[0];

    res.json({
        isSuccess: true,
        message: "Successfully fetch master data",
        data: {
            ledgerMasterData,
            accountGroupData,
            typeMasterData,
            typeNameMasterData,
            menuMasterData,
            companyMenuMasterData,
            itemMasterData,
        },
    });
}

module.exports = {
    login,
    validateToken,
    getMasterData,
};
