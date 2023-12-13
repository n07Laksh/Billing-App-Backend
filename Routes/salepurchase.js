const express = require("express");
const Sale = require("../Model/Sale");
const Purchase = require("../Model/Purchase");

const getuser = require("../Middleware/getuser");

const router = express.Router();

// router 1 for adding sale data using post method and route /product/saleproduct login require
router.post("/saledata", getuser, async (req, res) => {
  const dataFromClient = req.body;

  try {
    let sale;
    for (const item of dataFromClient) {
      const existingItem = await Sale.findOne({ id: item.id });

      if (!existingItem) {
        try {
          const saleData = {
            ...item,
            user: req.user.id,
          };
          sale = await Sale.create(saleData);
        } catch (error) {
          return res.status(401).json({ error: true, message: error });
        }
      }
    }
    return res
      .status(200)
      .json({ error: false, message: "Added Successfully", data: sale });
  } catch (error) {
    return res.status(401).json({ error: true, message: error });
  }
});

// router 2 for adding purchase data using post method and route /product/saleproduct login require
router.post("/purchasedata", getuser, async (req, res) => {
  const dataFromClient = req.body;

  try {
    let purchase;
    for (const item of dataFromClient) {
      const existingItem = await Purchase.findOne({ id: item.id });

      if (!existingItem) {
        try {
          const purchaseData = {
            ...item,
            user: req.user.id,
          };
          purchase = await Purchase.create(purchaseData);
        } catch (error) {
          return res.status(401).json({ error: true, message: error });
        }
      }
    }
    return res
      .status(200)
      .json({ error: false, message: "Added Successfully", data: purchase });
  } catch (error) {
    return res.status(401).json({ error: true, message: error });
  }
});

// router 3 for adding purchase data using post method and route /product/searchsale login require
router.post("/searchsale", getuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { searchTxt, firstDate, lastDate } = req.body;

    let query = { user: userId }; 

    if (searchTxt) {
      query.clientName = searchTxt;
    } else if (firstDate && lastDate) {
      query.today = {
        $gte: firstDate,
        $lte: lastDate,
      };
    } else {
      return res.status(400).json({
        error: true,
        message: "Invalid search criteria. Provide search text or date range.",
      });
    }

    const searchedData = await Sale.find(query);

    if (searchedData.length > 0) {
      return res.status(200).json({
        error: false,
        message: "Searched Successfully",
        data: searchedData,
      });
    }

    return res.status(404).json({
      error: true,
      message: "No items found matching the search criteria.",
      data: searchedData,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      data: error,
    });
  }
});

// router 4 for adding purchase data using post method and route /product/searchpurchase login require
router.post("/searchpurchase", getuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { searchTxt, billNum, firstDate, lastDate } = req.body;

    let query = { user: userId };

    if (searchTxt) {
      query.supplierName = searchTxt;
    } else if (billNum) {
      query.billNum = billNum;
    } else if (firstDate && lastDate) {
      query.today = {
        $gte: firstDate,
        $lte: lastDate,
      };
    } else {
      return res.status(400).json({
        error: true,
        message:
          "Invalid search criteria. Provide search text, bill number, or date range.",
      });
    }

    const searchedData = await Purchase.find(query);

    if (searchedData.length > 0) {
      return res.status(200).json({
        error: false,
        message: "Searched Successfully",
        data: searchedData,
      });
    }

    return res.status(404).json({
      error: true,
      message: "No items found matching the search criteria.",
      data: searchedData,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      data: error,
    });
  }
});

// router 5 for fetching sale data using post method and route /product/fetchsaledata login require
router.post("/fetchsaledata", getuser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all sale data associated with the user ID
    const sales = await Sale.find({ user: userId });

    if (sales.length > 0) {
      return res.status(200).json({
        error: false,
        message: "Sale data fetched successfully",
        data: sales,
      });
    }

    return res.status(404).json({
      error: true,
      message: "No sale data found for this user.",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      data: error,
    });
  }
});

// router 6 for fetching purchase data using post method and route /product/fetchsaledata login require
router.post("/fetchpurchasedata", getuser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all purchase data associated with the user ID
    const purchases = await Purchase.find({ user: userId });

    if (purchases.length > 0) {
      return res.status(200).json({
        error: false,
        message: "Purchase data fetched successfully",
        data: purchases,
      });
    }

    return res.status(404).json({
      error: true,
      message: "No purchase data found for this user.",
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      data: error,
    });
  }
});

module.exports = router;
