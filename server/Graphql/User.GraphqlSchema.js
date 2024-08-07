const { GraphQLObjectType, GraphQLString,GraphQLInputObjectType, GraphQLID, GraphQLList, GraphQLSchema ,GraphQLNonNull} = require('graphql');
const {buildSchema} = require("graphql");
const { GoogleAuth,GetAllUser,Signin } = require('../controllers/User.controllers');
const { restrictToLoggedinUserOnly } = require('../middleware/Auth');
const { GraphQLError } = require('graphql');
const { AddUserForChat, CheckOnlineUser,ChatingUser, Getusermsg } = require('../controllers/Chat.controllers');


// ObjectTypes

const UserType = new GraphQLObjectType({
    name:'User',
    fields:{
        _id:{type:GraphQLString},
        username:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString},
        avatar:{type:GraphQLString},
    }
});

const FileMsg_Response_Type = new GraphQLInputObjectType({
    name: 'FileMsg_Response',
    fields:{
        filename: {type:GraphQLString},
        size: {type:GraphQLID},
        type:{type:GraphQLString},
        url:{type:GraphQLString}
    }
})

const FileType = new GraphQLObjectType({
    name: 'FileType',
    fields:{
        filename: {type:GraphQLString},
        size: {type:GraphQLString},
        type:{type:GraphQLString},
        url:{type:GraphQLString}
    }
})


const ChatMessageType = new GraphQLObjectType({
    name:'Chat',
    fields:{
        _id:{type:GraphQLString},
        senderId:{type:GraphQLString},
        reciverID:{type:GraphQLString},
        msg:{type:GraphQLString},
        FileMsg:{type: GraphQLList(FileType)},
        Date:{type:GraphQLString},
        Time:{type:GraphQLString},
        Day:{type:GraphQLString}
    }
});

const ChatingUserLists = new GraphQLObjectType({
    name:"ChatingList",
    fields:{
        user:{type: GraphQLString},
        ConnectedUser: {type: new GraphQLList(UserType)},
    }
})

const ResponseType = new GraphQLObjectType({
    name: 'Message',
    fields: {
        msg: { type: GraphQLString },
        candidate: { type: UserType },
        ChatMsg:{type: ChatMessageType},
        token:{type: GraphQLString},
        List:{type : ChatingUserLists},
    }
});

const MessagesType = new GraphQLObjectType({
    name: 'Msg',
    fields:{
        Participant :{type : GraphQLList(UserType)},
        messages:{type : GraphQLList(ChatMessageType)}
    }
})




// Query

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: async (parent, args, context) => {
          try {
            // await restrictToLoggedinUserOnly(context);
           
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

// Mutation

const MutationType = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        Googlelogin:{
            type:ResponseType,
            args:{
                username: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                avatar: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent,args,context)=>{
                return GoogleAuth(args);
            }
        },

        signinUser :{
            type:ResponseType,
            args:{
                email:{type: new GraphQLNonNull(GraphQLString)},
                password:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent,args,context)=>{
            
                return Signin(args,context.res);
            }
        },
        CheckUserOnline :{
            type:ResponseType,
            args:{
                user_id:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent,args,context) =>{
                await restrictToLoggedinUserOnly(context);
                return CheckOnlineUser(args);
            }
        },

        ChatUserList:{
            type: ResponseType,
            args:{
                sender:{type:new GraphQLNonNull(GraphQLString)},
            },
            resolve: async (parent,args,context) =>{
                await restrictToLoggedinUserOnly(context);
                return ChatingUser(args)
            }
        },

        GetUserMessages:{
         type: MessagesType,
         args:{
            senderId:{type: new GraphQLNonNull(GraphQLString)},
            reciverID:{type : new GraphQLNonNull(GraphQLString)}
         },
         resolve: async (parent,args,context) => {
            await restrictToLoggedinUserOnly(context);
            return Getusermsg(args);
         }
        },
    
        RequestforChat :{
            type:ResponseType,
            args:{
                senderId:{type: new GraphQLNonNull(GraphQLString)},
                reciverID:{type: new GraphQLNonNull(GraphQLString)},
                msg:{type: GraphQLString},
                FileMsg:{type:new  GraphQLList(FileMsg_Response_Type)},
                Date:{type:new GraphQLNonNull(GraphQLString)},
                Time:{type:new GraphQLNonNull(GraphQLString)},
                Day:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve:async (parent,args,context)=>{
                try {
                    await restrictToLoggedinUserOnly(context);
                    // console.log(context);
                    return AddUserForChat(args);
                }
                catch (error) {
                    console.error('Error in resolver:', error);
                    throw new GraphQLError(error.message, {
                      extensions: { code: error.extensions && error.extensions.code || 'INTERNAL_SERVER_ERROR' }
                    });
                  }
            }
        }
    }
})


// setSchema

const schema = new GraphQLSchema({
    query:QueryType,
    mutation:MutationType
})


module.exports = schema;