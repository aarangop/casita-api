let express = require("express");
const checkJwt = require("../lib/auth");
const { requiredScopes } = require("express-oauth2-jwt-bearer");
let router = express.Router();

/* GET users listing. */
router.get("/", checkJwt, (req, res, next) => {
  res.send("respond with a resource");
});

module.exports = router;
