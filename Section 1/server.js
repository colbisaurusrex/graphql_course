const express = require('express')
const expressGraphQL = require('express-graphql')
const schema = require('./schema/schema.js')

const app = express()

const port = 4000

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true // allows queries to a dev server. only intended for dev purposes
}))

// We have to inform GraphQL

app.listen(port, () => {
    console.log(`Listening on ${port}!`)
})