const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema } = require('graphql');
const {buildSchema} = require("graphql");

const UserType = new GraphQLObjectType({
    name:'User',
    fields:{
        username:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString}
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
                return users;
            }
        }

}
});


const MutationType = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        createUser:{
            type:UserType,
            args:{
                username:{type:GraphQLString},
                email:{type:GraphQLString},
                password:{type:GraphQLString}
            },
            resolve: (parent,args,context)=>{
                if(!context.uesr || context.user.role !== "admin"){
                    throw new Error("Unauthorized")
                }
                return createUser;
            }
        }
    }
})


const schema = new GraphQLObjectType({
    query:QueryType,
    mutation:MutationType
})


module.exports = schema;