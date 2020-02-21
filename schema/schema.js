const graphql = require('graphql')
const axios = require('axios')

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} = graphql

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        // Circular Referrence: Had to use a lambda here because I was getting a reference error for UserType. The CompanyType makes a reference to UserType, which is making a reference to CompanyType. aka circular :). This leverages closures. This func gets defined but does not get executed until this entire FILE gets executed. Therefore, by the time this func gets executed, the UserType has been defined. Pesky Javascript.
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        // This sets up the bidirectional relationship between companies and users
        users: {
            type: new GraphQLList(UserType), // Tells GraphQL there are multiple users, aka 1:many relationship
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(resp => resp.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        // Notice this field isn't named companyId. Why? Because we have the resolve function defined...
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(resp => resp.data)
           }
            /*
                ...here.
                When fields are named exactly the same in the schema as they are in our datastore, we don't need this.
                But when they are different, we have to teach GraphQL with a resolve func.
            */
        }
    })
})

// Allows GraphQL to jump to a specific node
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType, // instance of a User
            args: { id: { type: GraphQLString }},
            resolve(parentValue, args) {
                // parentValue is hardly ever used
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data)
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString }},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(resp => resp.data)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // fields of a mutation describe the mutation taking place
        addUser: {
            // type of data we are returning from the resolve function. With mutations, the collection of data you are operating on doesn't always match they type you return. But most of the time you do.
            type: UserType,
            args: {
                // GraphQLNonNull tells are schema that when this mutation is attempted, these values must be supplied.
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve(){

            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})