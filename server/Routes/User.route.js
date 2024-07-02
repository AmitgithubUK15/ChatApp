const express = require("express");
const graphqlAuthorize = require("../middleware/GraphqlAuthentication");
const router = express.Router();


router.use("/graphql",graphqlAuthorize);

module.exports = router;

