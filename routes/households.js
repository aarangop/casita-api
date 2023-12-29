let express = require("express");
const Household = require("../models/Household");
const checkJwt = require("../lib/auth");
let router = express.Router();

/**
 * @openapi
 *
 */
router.get("/", checkJwt, async (req, res) => {
  try {
    const households = await Household.find();
    res.json(households);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
