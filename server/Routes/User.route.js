const express = require("express");
const graphqlAuthorize = require("../middleware/GraphqlAuthentication");
const { restrictToLoggedinUserOnly } = require("../middleware/Auth");
const router = express.Router();


router.use("/signup",graphqlAuthorize);
router.use("/getall",restrictToLoggedinUserOnly,graphqlAuthorize);
router.use('/signin',graphqlAuthorize);

module.exports = router;

