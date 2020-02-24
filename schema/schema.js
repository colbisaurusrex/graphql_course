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
                    .then(res => res.data)
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
                    .then(res => res.data)
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
                    .then(res => res.data)
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString }},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(res => res.data)
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
                // GraphQLNonNull tells our schema that when this mutation is attempted, these values must be supplied.
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve(parentValue, { firstName, age }){
                return axios.post(`http://localhost:3000/users`, { firstName, age })
                    .then(res => res.data)
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { id }) {
                return axios.delete(`http://localhost:3000/users/${id}`)
                    .then(res => res.data)
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString }
            },
            // As a reminder, PUT requests completely overwrites a record. A PATCH request only overwrites the properties contained in the request body
            resolve(parentValue, args) {
                // json-server ignores id property in args on patch and put request bodies, so there is no chance that id is mutated
                return axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
})