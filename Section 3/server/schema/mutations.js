const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString } = graphql;
const UserType = require('./types/user_type');
const AuthService = require('../services/auth');

/*
    For every mutation we write, we want to ensure that as little logic as possible is in the resolve func/mutation itself. Instead, it is best to delegate this to an outside function.
*/

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            // in some docs, request (req) is called context. In this case, it's the request coming from express.
            resolve(parentValue, { email, password }, req) {
                // delegates all business logic to the AuthService
                return AuthService.signup({ email, password, req });
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parentValue, { email, password }, req) {
                return AuthService.login({ email, password, req });
            }
        },
        logout: {
            type: UserType,
            resolve(parentValue, args, req) {
                return AuthService.logout(req)
            }
        }
    }
});

module.exports = mutation;
