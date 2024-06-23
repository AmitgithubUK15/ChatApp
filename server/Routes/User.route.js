const express = require("express");
const graphqlAuthorize = require("../middleware/GraphqlAuthentication");
const router = express.Router();


router.use("/signup",graphqlAuthorize)

module.exports = router;

