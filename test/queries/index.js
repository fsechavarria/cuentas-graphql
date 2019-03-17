module.exports = {
  login: {
    query: `{
        login(email: "${process.env.EMAIl}", password: "${process.env.PASSWORD}") {
        userId
        email
        token
      }
    }
  `
  },
  createUser: {
    query: `mutation {
      createUser(email: "test@test.com", password: "12345678", role:"admin") {
        _id
        email
        role
      }
    }`
  },
  newLogin: {
    query: `{
        login(email: "test@test.com", password: "12345678") {
        userId
        email
        token
      }
    }
  `
  },
  findUser: id => {
    return {
      query: `{
        user(_id: "${id}") {
          _id
          email
          role
        }
      }`
    }
  },
  updateUser: (id, email, password, role) => {
    return {
      query: `
        mutation {
          updateUser(_id: "${id}", email: "${email}", password: "${password}", role: "${role}")
        }
      `
    }
  },
  deleteUser: id => {
    return {
      query: `
        mutation {
          deleteUser(_id: "${id}")
        }
      `
    }
  },
  createBusiness: {
    query: `mutation {
      createBusiness(name: "Test") {
        _id
        name
      }
    }`
  },
  editBusiness: (id, name) => {
    return {
      query: `
        mutation {
          updateBusiness(_id: "${id}", name: "${name}")
        }
      `
    }
  },
  deleteBusiness: id => {
    return {
      query: `
        mutation {
          deleteBusiness(_id: "${id}")
        }
      `
    }
  },
  findBusiness: id => {
    return {
      query: `{
        business(_id: "${id}") {
          _id
          name
        }
      }
      `
    }
  },
  createBill: id => {
    return {
      query: `
        mutation {
          createBill(price: 100.5, business: "${id}") {
            _id
            price
            isPaid
            paymentDate
            owner {
              _id
            }
            business {
              _id
            }
          }
        }
      `
    }
  },
  editBill: (id, price) => {
    return {
      query: `
        mutation {
          updateBill(_id: "${id}", price: ${price}, isPaid: true)
        }
      `
    }
  },
  findBill: id => {
    return {
      query: `{
        bill(_id: "${id}") {
          price
          isPaid
          paymentDate
          updatedAt
        }
      }
      `
    }
  },
  deleteBill: id => {
    return {
      query: `
        mutation {
          deleteBill(_id: "${id}")
        }
      `
    }
  }
}
