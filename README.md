# RESTful - routing
Given a collection of records on a server, there should be a uniform URL and HTTP request method used to utilize that collection of records

## Shortcomings of RESTful Routing

* Nested entities means lots of HTTP requests for relational data
    - Often a solution is a very specific endpoint, meaning less DRY code that breaks RESTful conventions

* Often returns the whole model when we only need a subset of data for that model
    - I have seen summary and detail versions of models as a solution for RESTful APIs
    - This is also important for mobile data. Smaller responses.

The point of GraphQL is to solve these issues, among some others.

# App to build

Client ---> Express/GraphQL Server ---> Datastore

# Large Companies

Large companies often don't have a large monolithic data store. There are usually a collection of systems responsible for certain pieces of data.
                       Client
                          +
                          |
                          | GraphQL Query
                          |
                          |
                          v
     +------------->Express/GraphQL Server<--------+
     |                    ^                        |
     |                    |                        |
     |                    |                        |
     |                    |                        | Http Request
     |                    |                        |
     |                    |                        |
     v                    v                        v
Outside Server #1      Outside API             Outside Server #2
     ^                                              ^
     |                                              |
     |                                              |
     |                                              |
     v                                              v
   Datastore                                   Datastore

The express server will receive the query. It will then make an HTTP request to some other API and fetch the data. Then it will assemble a GraphQL response and ship it back to the client. Simple.

# GraphQL

* Not changing how the data is stored

* Edges = relationships

* Schema files are the absolute linchpin of every GraphQL app. We have to inform GraphQL how are data is arranged. This is done with schema files.
    - This is also probably the bulk of the work you'll do when working with GraphQL.

* Root queries allow us to jump into our graph of data. Starting point. Takes the query and enters into the graph of data.

* resolve function is where we actually find the data we are looking for.
    - nearly all data fetching we do is async
    - In order to be async, resolve should return a promise. If a promise is returned, GraphQL automatically detects this and waits for the promise to resolve. This is very cool.
    - axios has a quirk when integrated with GraphQL. It nests data in a "data" property. GraphQL doesn't know that.

* Query Fragments
    - used to avoid duplication and copy/paste. Essentially a list of differrent properties that can be reused when querying and entity. Fragments are primarily used on the front end.

    ```javascript
        {
            apple: company(id: "1"){
                ...companyDetails,
            }
            google: company(id: "2"){
                ...companyDetails,
            }
        }
        fragment companyDetails on Company {
            id
            name
            description
        }
    ```
    the "on Company" bit ensures type checking.

* Mutations
    - somewhat challengin in GraphQL

# json-server

json-server automatically sets up relations behind the scenes.