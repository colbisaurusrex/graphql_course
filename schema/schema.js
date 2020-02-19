const graphql = require('graphql')
const axios = require('axios')

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt
} = graphql

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
    }
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
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
    }
})

// Allows GraphQL to jump to a specific node
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString }},
            resolve(parentValue, args) {
                // parentValue is hardly ever used
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})