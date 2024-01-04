let express = require("express");
const checkJwt = require("../lib/auth");
const { db } = require("../db/conn");
let router = express.Router();

router.get("/", async (req, res) => {
  try {
    let docs = await db.collection("households").find({}).toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Save a new household.
 */
router.post("/", async (req, res) => {
  try {
    let collection = await req.db.collection("households");
    let newDocument = req.body;
    let result = await collection.insertOne(newDocument);
    res.status(204).json({ insertedId: result.insertedId.toString() });
    console.log(`Inserted household with id ${result.insertedId}`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// module.exports = router;

module.exports = router;
