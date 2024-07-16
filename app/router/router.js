/* eslint-disable prettier/prettier */

let express = require("express");
const path = require("path");
let router = express.Router();

// Import middleware
let {createInfoFields} = require("../middleware/createInformation");
let {editInfoFields} = require("../middleware/editInformation");

// Import Controllers
let authenticationController = require("../controller/authentication.controller");
let ledgerController = require("../controller/LedgerMaster.controller");
let typeMasterController = require("../controller/typeMaster.controller");
let typeNameMasterController = require("../controller/typeNameMaster.controller");
let menuMasterController = require("../controller/menuMaster.controller");
let companyMenuMasterController = require("../controller/companyMenuMaster");
let itemMasterController = require("../controller/itemMaster.comtroller");
let purchaseController = require("../controller/purchase.controller");
let paymentReceiptController = require("../controller/paymentReceipt.controller");
let receiptController = require("../controller/receiptMaster.controller");
let paymentController = require("../controller/paymentMaster.controller");
let voucherController = require("../controller/voucher.controller")
let fileUploadController = require("../controller/fileUpload.controller");
let registerPatientController = require("../controller/registerPatient.controller");
let errorHandlerController = require("../controller/errorHandler.controller");
const { registerPatient } = require("../controller/registerPatient.controller");


// User login & signup
router.post("/api/login", authenticationController.login);
router.post("/api/validate-token", authenticationController.validateToken);
router.post("/api/get-master-data", authenticationController.getMasterData);

// Ledger Master
router.post("/api/ledger-master/get-city-data", ledgerController.getCityData);
router.post("/api/ledger-master/reset-password", ledgerController.resetPassword);
router.post("/api/ledger-master/add-ledger-data", createInfoFields, ledgerController.addLedgerData);
router.post("/api/ledger-master/edit-ledger-data", editInfoFields, ledgerController.editLedgerData);
router.post("/api/ledger-master/delete-row", editInfoFields, ledgerController.deleteRow);

// Type master
router.post("/api/type-master/add-type", createInfoFields, typeMasterController.addType);
router.post("/api/type-master/edit-type", editInfoFields, typeMasterController.editType);

// Type name master
router.post("/api/type-name-master/add-type-name", createInfoFields, typeNameMasterController.addTypeName);
router.post("/api/type-name-master/edit-type-name", editInfoFields, typeNameMasterController.editTypeName);

// Menu Master
router.post("/api/menu-master/add-menu", createInfoFields, menuMasterController.addMenu);
router.post("/api/menu-master/edit-menu", editInfoFields, menuMasterController.editMenu);

// Comapany Menu Master
router.post("/api/company-menu-master/add-company-menu", createInfoFields, companyMenuMasterController.addCompanyMenu);
router.post("/api/company-menu-master/edit-company-menu", editInfoFields, companyMenuMasterController.editCompanyMenu);

// Item Master
router.post("/api/item-master/add-item-data", createInfoFields,itemMasterController.addItemData );
router.post("/api/item-master/edit-item-data", editInfoFields, itemMasterController.editItemData);

// Purchase Master
router.post("/api/purchase/get-purchase-data/:comp_id", createInfoFields,purchaseController.getPurchase);
router.post("/api/purchase/add-purchase", createInfoFields,purchaseController.addPurchase);
router.post("/api/purchase/edit-purchase", editInfoFields,purchaseController.editPurchase);
router.post("/api/purchase/delete-row", editInfoFields,purchaseController.deleteRow);


// Payment & Receipt
router.post("/api/payment-receipt/get-details", createInfoFields,paymentReceiptController.getPaymentReceipt);
router.post("/api/payment-receipt/add-details", createInfoFields,paymentReceiptController.addPaymentReceipt);
router.post("/api/payment-receipt/edit-details", editInfoFields,paymentReceiptController.editPaymentReceipt);

//  Receipt
router.post("/api/receipt/get-details/:comp_id", createInfoFields,receiptController.getPaymentReceipt);
router.post("/api/receipt/add-details", createInfoFields,receiptController.addPaymentReceipt);
router.post("/api/receipt/edit-details", editInfoFields,receiptController.editPaymentReceipt);
router.post("/api/payment-master/delete-row", editInfoFields,receiptController.deleteRow);


//  Payment
router.post("/api/payment/get-details/:comp_id", createInfoFields,paymentController.getPaymentReceipt);
router.post("/api/payment/add-details", createInfoFields,paymentController.addPaymentReceipt);
router.post("/api/payment/edit-details", editInfoFields,paymentController.editPaymentReceipt);
router.post("/api/payment-master/delete-row", editInfoFields, paymentController.deleteRow);


//Voucher
// Payment & Receipt
router.post("/api/vouchers/get-details/:comp_id", createInfoFields, voucherController.getVoucher);
router.post("/api/vouchers/add-details", createInfoFields,voucherController.addVouchers);
router.post("/api/vouchers/edit-details", editInfoFields,voucherController.editVoucher);
router.post("/api/payment-master/delete-row", editInfoFields, paymentController.deleteRow);

// patient Registration
//router.post("/api/patient-registration/get-city-data", registerPatientController.getCityData);
// router.post("/api/patient-registration/reset-password", ledgerController.resetPassword);
router.post("/api/patient-registration/add-patient-data", createInfoFields, registerPatientController.registerPatient);
router.post("/api/patient-registration/edit-patient-data", editInfoFields, registerPatientController.updateRegistrationDetails);
router.post("/api/patient-registration/delete-row", editInfoFields, registerPatientController.deleteRegistration);


// File upload
router.post("/api/upload", fileUploadController.uploadMiddleware, fileUploadController.uploadHandler);
router.get("/*", (req, res) => { res.sendFile(path.join(__dirname, "../../public/", "index.html"))});

router.use(errorHandlerController.errorHandler);

module.exports = router;
