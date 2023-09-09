const express = require("express");
const Sale = require("../Model/Sale")
const Purchase = require("../Model/Purchase")


const router = express.Router();
// const getUser = require("../Middleware/getUser")


// router 1 for adding sale data using post method and route /product/saleproduct login require
router.post("/saledata", async (req, res) => {
    console.log("sale", req.body);

    try {
        let sale = await Sale.create(req.body);

        return res.status(200).json({ error: false, message: "Added Successfully", data:sale})
    } catch (error) {
        return res.status(401).json({ error: true, message: error });
    }

});

// router 1 for adding purchase data using post method and route /product/saleproduct login require
router.post("/purchasedata", async (req, res) => {

    console.log("purchase", req.body);

    try {
        let purchase = await Purchase.create(req.body);

        console.log("purchase return data", purchase);

        return res.status(200).json({ error: false, message: "Added Successfully", data:purchase});

    } catch (error) {
        return res.status(400).json({ error: true, message: error });
    }

});


module.exports = router;
