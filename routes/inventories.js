var express = require('express');
var router = express.Router();
let inventorySchema = require('../schemas/inventories');

// GET all inventories
router.get('/', async function (req, res, next) {
  try {
    let data = await inventorySchema.find({}).populate('product');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET inventory by ID
router.get('/:id', async function (req, res, next) {
  try {
    let result = await inventorySchema.findOne(
      { _id: req.params.id }
    ).populate('product');
    
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({
        message: "INVENTORY NOT FOUND"
      });
    }
  } catch (error) {
    res.status(404).send({
      message: "INVALID ID OR INVENTORY NOT FOUND"
    });
  }
});

// POST add_stock
router.post('/add_stock', async function (req, res, next) {
  try {
    const { product, quantity } = req.body;
    let inventory = await inventorySchema.findOneAndUpdate(
      { product: product },
      { $inc: { stock: quantity } },
      { new: true }
    );
    if (!inventory) return res.status(404).send({ message: "INVENTORY NOT FOUND FOR THIS PRODUCT" });
    res.status(200).send(inventory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// POST remove_stock
router.post('/remove_stock', async function (req, res, next) {
  try {
    const { product, quantity } = req.body;
    // Optional: check if stock >= quantity before decrementing
    let inventory = await inventorySchema.findOneAndUpdate(
      { product: product },
      { $inc: { stock: -quantity } },
      { new: true }
    );
    if (!inventory) return res.status(404).send({ message: "INVENTORY NOT FOUND FOR THIS PRODUCT" });
    res.status(200).send(inventory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// POST reservation
router.post('/reservation', async function (req, res, next) {
  try {
    const { product, quantity } = req.body;
    // Decrement stock, increment reserved
    let inventory = await inventorySchema.findOneAndUpdate(
      { product: product },
      { $inc: { stock: -quantity, reserved: quantity } },
      { new: true }
    );
    if (!inventory) return res.status(404).send({ message: "INVENTORY NOT FOUND FOR THIS PRODUCT" });
    res.status(200).send(inventory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// POST sold
router.post('/sold', async function (req, res, next) {
  try {
    const { product, quantity } = req.body;
    // Decrement reserved, increment soldCount
    let inventory = await inventorySchema.findOneAndUpdate(
      { product: product },
      { $inc: { reserved: -quantity, soldCount: quantity } },
      { new: true }
    );
    if (!inventory) return res.status(404).send({ message: "INVENTORY NOT FOUND FOR THIS PRODUCT" });
    res.status(200).send(inventory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
