const {graphqlHTTP} = require("express-graphql");
const schema = require("../Graphql/User.GraphqlSchema.js");

const graphqlAuthorize = graphqlHTTP((req)=>(
    {
        schema:schema,
        graphiql:true,
        context:{user:req.user}
    }
));

module.exports = graphqlAuthorize;

