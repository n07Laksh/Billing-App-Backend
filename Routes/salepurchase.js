const express = require("express");
const Sale = require("../Model/Sale")
const Purchase = require("../Model/Purchase")


const router = express.Router();
// const getUser = require("../Middleware/getUser")


// router 1 for adding sale data using post method and route /product/saleproduct login require
router.post("/saledata", async (req, res) => {

    try {
        let sale = await Sale.create(req.body);

        return res.status(200).json({ error: false, message: "Added Successfully", data: sale })
    } catch (error) {
        return res.status(401).json({ error: true, message: error });
    }

});

// router 1 for adding purchase data using post method and route /product/saleproduct login require
router.post("/purchasedata", async (req, res) => {

    try {
        let purchase = await Purchase.create(req.body);

        return res.status(200).json({ error: false, message: "Added Successfully", data: purchase });

    } catch (error) {
        return res.status(400).json({ error: true, message: error });
    }

});



// router 1 for adding purchase data using post method and route /product/searchsale login require
router.post("/searchsale", async (req, res) => {

    const { searchTxt, firstDate, lastDate } = req.body;

    try {
        let query = {};
    
        if (searchTxt) {
            // If search text is provided, include it in the query
            query.clientName = searchTxt;
        } else if (firstDate && lastDate) {
            // If search text is not provided but both firstDate and lastDate are, add a date range query
            query.today = {
                $gte: firstDate, // Greater than or equal to firstDate
                $lte: lastDate,  // Less than or equal to lastDate
            };
        } else {
            return res.status(400).json({ error: true, message: "Invalid search criteria. Provide search text or date range." });
        }
    
        const searchedData = await Sale.find(query);
    
        if (searchedData.length > 0) {
            return res.status(200).json({ error: false, message: "Searched Successfully", data: searchedData });
        }
    
        return res.status(404).json({ error: true, message: "No items found matching the search criteria.", data: searchedData });
    
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal server error", data: error });
    }
    

});

// router 1 for adding purchase data using post method and route /product/searchpurchase login require
router.post("/searchpurchase", async (req, res) => {

    const { searchTxt, billNum, firstDate, lastDate } = req.body;

    try {
        let query = {};
    
        if (searchTxt) {
            // If search text is provided, include it in the query
            query.supplierName = searchTxt;
        }else if (billNum) {
            // If billNum is provided, include it in the query
            query.billNum = billNum;
        } else if (firstDate && lastDate) {
            // If search text is not provided but both firstDate and lastDate are, add a date range query
            query.today = {
                $gte: firstDate, // Greater than or equal to firstDate
                $lte: lastDate,  // Less than or equal to lastDate
            };
        } else {
            return res.status(400).json({ error: true, message: "Invalid search criteria. Provide search text or date range." });
        }

    
        const searchedData = await Purchase.find(query);
    
        if (searchedData.length > 0) {
            return res.status(200).json({ error: false, message: "Searched Successfully", data: searchedData });
        }
    
        return res.status(404).json({ error: true, message: "No items found matching the search criteria.", data: searchedData });
    
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal server error", data: error });
    }

});


module.exports = router;
