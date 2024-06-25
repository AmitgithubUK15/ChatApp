const express = require("express");
const graphqlAuthorize = require("../middleware/GraphqlAuthentication");
const router = express.Router();


router.use("/signup",graphqlAuthorize);
router.use("/getall",graphqlAuthorize);
router.use('/signin',graphqlAuthorize);

module.exports = router;

