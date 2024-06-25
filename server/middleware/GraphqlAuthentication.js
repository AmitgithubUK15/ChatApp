const { graphqlHTTP } = require('express-graphql');
const schema = require("../Graphql/User.GraphqlSchema.js");
const { AppError, InternalServerError } = require('../utils/error');

const graphqlAuthorize = (req, res, next) => {
    graphqlHTTP({
        schema: schema,
        graphiql: true,
        context: { user: req.user,res },
        customFormatErrorFn: (err) => {
            console.error(err); // Log the error

            // If the error is an instance of AppError, format it accordingly
            if (err.originalError instanceof AppError) {
                return {
                    message: err.message,
                    statusCode: err.originalError.statusCode,
                    locations: err.locations,
                    path: err.path,
                };
            }

            // For other errors, return a generic internal server error message
            return {
                message: 'Internal Server Error',
                statusCode: 500,
                locations: err.locations,
                path: err.path,
            };
        }
    })(req, res, (err) => {
        if (err) {
            next(err); // Pass the error to the next middleware
        }
    });
};

module.exports = graphqlAuthorize;
