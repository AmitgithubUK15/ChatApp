const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema ,GraphQLNonNull} = require('graphql');
const {buildSchema} = require("graphql");
const { SignupUser,GetAllUser,Signin } = require('../controllers/User.controllers');
const { restrictToLoggedinUserOnly } = require('../middleware/Auth');
const { GraphQLError } = require('graphql');

const UserType = new GraphQLObjectType({
    name:'User',
    fields:{
        _id:{type:GraphQLString},
        username:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString},
    }
});

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: {
        msg: { type: GraphQLString },
        candidate: { type: UserType },
    }
});


const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: async (parent, args, context) => {
          try {
            await restrictToLoggedinUserOnly(context);
            if (!context.user || context.user.role !== 'admin') {
              throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED' }
              });
            }
            // Fetch and return the users from your database
            return GetAllUser();
          } catch (error) {
            console.error('Error in resolver:', error);
            throw new GraphQLError(error.message, {
              extensions: { code: error.extensions && error.extensions.code || 'INTERNAL_SERVER_ERROR' }
            });
          }
        }
      }
    }
  });


const MutationType = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        createUser:{
            type:MessageType,
            args:{
                username: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent,args,context)=>{
                if(!context.user || context.user.role !== "admin"){
                    throw new Error("Unauthorized")
                }
                return SignupUser(args);
            }
        },

        signinUser :{
            type:MessageType,
            args:{
                email:{type:GraphQLString},
                password:{type:GraphQLString}
            },
            resolve: (parent,args,context)=>{
                if( !context.user || context.user.role !== 'admin'){
                    throw new Error("Unauthorized");
                }

                return Signin(args,context.res);
            }
        }
    }
})


const schema = new GraphQLSchema({
    query:QueryType,
    mutation:MutationType
})


module.exports = schema;