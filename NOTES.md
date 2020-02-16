# RESTful - routing
Given a collection of records on a server, there should be a uniform URL and HTTP request method used to utilize that collection of records

## Shortcomings of RESTful Routing

* Nested entities means lots of HTTP requests for relational data
    - Often a solution is a very specific endpoint, meaning less DRY code that breaks RESTful conventions

* Often returns the whole model when we only need a subset of data for that model
    - I have seen summary and detail versions of models as a solution for RESTful APIs

The point of GraphQL is to solve these issues, among some others.

# App to build

Client ---> Express/GraphQL Server ---> Datastore

# GraphQL

* Not changing how the data is stored

* Edges = relationships

* Schema files are the absolute linchpin of every GraphQL app. We have to inform GraphQL how are data is arranged. This is done with schema files.

* Root queries allow us to jump into our graph of data. Starting point.

* resolve function is where we actually find the data we are looking for.
