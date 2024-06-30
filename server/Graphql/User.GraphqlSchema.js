const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema ,GraphQLNonNull} = require('graphql');
const {buildSchema} = require("graphql");
const { SignupUser,GetAllUser,Signin } = require('../controllers/User.controllers');

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
    fields:{
        users:{
            type: new GraphQLList(UserType),
            resolve: (parent,args,context) =>{
                if(!context.user || context.user.role !== "admin"){
                    throw new Error("Unauthorized")
                }
                return GetAllUser();
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
                if(!context.user || context.user.role !== "admin"){
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