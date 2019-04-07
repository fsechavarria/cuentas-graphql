import gql from 'graphql-tag'

export default gql`
  type Bill {
    _id: ID!
    price: Float!
    isPaid: Boolean!
    paymentDate: String
    owner: User!
    business: Business!
    createdAt: String!
    updatedAt: String
  }

  type Business {
    _id: ID!
    name: String!
    bills: [Bill!]
  }

  type User {
    _id: ID!
    email: String!
    bills: [Bill!]
    role: String!
  }

  type Auth {
    userId: ID!
    email: String!
    token: String!
    role: String!
  }

  type Query {
    login(email: String!, password: String!): Auth!

    bill(_id: ID): Bill
    bills(_id: ID): [Bill!]

    business(_id: ID): Business
    businesses: [Business!]

    user(_id: ID!): User
    users: [User!]
  }

  type Mutation {
    createUser(email: String!, password: String!, role: String): User
    updateUser(_id: ID!, email: String, password: String, role: String): String
    deleteUser(_id: ID!): String

    createBill(price: Float!, isPaid: Boolean, paymentDate: String, business: ID!, owner: ID): Bill
    updateBill(_id: ID!, price: Float, isPaid: Boolean, paymentDate: String, business: ID, owner: ID): String
    deleteBill(_id: ID!): String

    createBusiness(name: String!): Business
    updateBusiness(_id: ID!, name: String): String
    deleteBusiness(_id: ID!): String
  }
`
