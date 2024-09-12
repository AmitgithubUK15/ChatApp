const { graphqlHTTP } = require('express-graphql');
const schema = require('../Graphql/User.GraphqlSchema.js');

const graphqlAuthorize = (req, res, next) => {
    console.log(req);
    graphqlHTTP({
        schema: schema,
        graphiql: true,
        context: { req, res, user: req.user }, // Pass req, res, and user to context
        customFormatErrorFn: (err) => {
            console.error(err); // Log the error
            return {
                message: err.message,
                locations: err.locations,
                path: err.path,
                extensions: {
                    code: err.extensions && err.extensions.code || 500,
                },
            };
        }
    })(req, res, next);
};

module.exports = graphqlAuthorize;
