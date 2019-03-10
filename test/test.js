require('dotenv').config()
const expect = require('chai').expect
const request = require('supertest')(process.env.TEST_URL)
const jwt = require('jsonwebtoken')
const {
  login,
  createUser,
  newLogin,
  updateUser,
  deleteUser,
  createBusiness,
  deleteBusiness,
  editBusiness,
  findBusiness,
  createBill,
  editBill,
  findBill,
  deleteBill
} = require('./queries')

const user = {
  _id: '',
  token: '',
  email: ''
}

const business = {
  _id: '',
  name: ''
}

const bill = {
  _id: '',
  price: 100.5,
  isPaid: false,
  paymentDate: null,
  owner: {
    _id: ''
  },
  business: {
    _id: ''
  }
}

describe('GraphQL API', () => {
  describe('Users', () => {
    it('Should Login and return email and token with userId', done => {
      request
        .post('/graphql')
        .send(login)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { login } = res.body.data
          expect(login.email).to.equal(process.env.EMAIL)
          const { userId } = jwt.verify(login.token, process.env.SECRET)
          expect(userId).to.equal(login.userId)
          user.token = login.token
          done()
        })
    }).timeout(5000)

    it('Should create an user', done => {
      request
        .post('/graphql')
        .send(createUser)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { createUser, errors } = res.body.data
          expect(errors).to.satisfy(err => err === undefined || err === null)
          expect(createUser).not.equal(null)
          expect(createUser.email).to.equal('test@test.com')
          expect(createUser.role).to.equal('admin')
          done()
        })
    }).timeout(5000)

    it('Should login with the new user', done => {
      request
        .post('/graphql')
        .send(newLogin)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { login } = res.body.data
          expect(login.email).to.equal('test@test.com')
          const { userId } = jwt.verify(login.token, process.env.SECRET)
          expect(userId).to.equal(login.userId)
          user._id = userId
          user.token = login.token
          user.email = 'test@test.com'
          bill.owner._id = userId
          done()
        })
    }).timeout(5000)

    it('Should update the new user', done => {
      request
        .post('/graphql')
        .send(updateUser(user._id))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { updateUser, errors } = res.body.data
          expect(errors).to.satisfy(err => err === undefined || err === null)
          expect(updateUser).to.not.equal(null)
          expect(updateUser).to.equal('User updated successfully')
          done()
        })
    }).timeout(5000)
  })

  describe('Businesses', () => {
    it('Should create a business', done => {
      request
        .post('/graphql')
        .send(createBusiness)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { createBusiness, errors } = res.body.data
          expect(errors).to.satisfy(err => err === undefined || err === null)
          expect(createBusiness).to.not.equal(null)
          expect(createBusiness.name).to.equal('Test')
          business._id = createBusiness._id
          business.name = createBusiness.name
          bill.business._id = createBusiness._id
          done()
        })
    }).timeout(5000)

    it('Should edit the new business', done => {
      request
        .post('/graphql')
        .send(editBusiness(business._id, 'edited'))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { updateBusiness, errors } = res.body.data
          expect(errors).to.satisfy(err => err === undefined || err === null)
          expect(updateBusiness).to.not.equal(null)
          expect(updateBusiness).to.not.equal('Business not found')
          expect(updateBusiness).to.equal('Business updated successfully')
          business.name = 'edited'
          done()
        })
    }).timeout(5000)

    it('Should find the edited business', done => {
      request
        .post('/graphql')
        .send(findBusiness(business._id))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { businesses, errors } = res.body.data
          expect(errors).to.satisfy(err => err === undefined || err === null)
          expect(businesses).to.not.equal(null)
          expect(businesses.length).to.be.greaterThan(0)
          expect(businesses[0]).to.deep.equal(business)
          done()
        })
    })
  })

  describe('Bills', () => {
    it('Should create a new bill', done => {
      request
        .post('/graphql')
        .send(createBill(business._id))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { createBill, errors } = res.body.data
          expect(errors).to.satisfy(err => err === undefined || err === null)
          expect(createBill).to.not.equal(null)
          bill._id = createBill._id
          expect(createBill).to.deep.equal(bill)
          done()
        })
    }).timeout(5000)

    it('Should edit the new bill', done => {
      request
        .post('/graphql')
        .send(editBill(bill._id, 1500))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { updateBill, errors } = res.body.data
          expect(errors).to.satisfy(err => err === undefined || err === null)
          expect(updateBill).to.not.equal(null)
          expect(updateBill).to.not.equal('Bill does not exist')
          expect(updateBill).to.equal('Bill updated successfully')
          done()
        })
    }).timeout(5000)

    it('Should find the updated bill', done => {
      request
        .post('/graphql')
        .send(findBill(bill._id))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { bills, errors } = res.body.data
          expect(errors).to.satisfy(err => err === undefined || err === null)
          expect(bills).to.not.equal(null)
          expect(bills.length).to.not.equal(0)
          expect(bills[0].isPaid).to.equal(true)
          expect(bills[0].paymentDate).to.not.equal(null)
          expect(bills[0].price).to.equal(1500)
          expect(bills[0].updatedAt).to.not.equal(null)
          done()
        })
    }).timeout(5000)
  })

  describe('Data Cleanup', () => {
    it('Should delete the new bill', done => {
      request
        .post('/graphql')
        .send(deleteBill(bill._id))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { deleteBill, errors } = res.body.data
          expect(errors).to.satisfy(err => err === undefined || err === null)
          expect(deleteBill).to.not.equal(null)
          expect(deleteBill).to.not.equal('Bill does not exist')
          expect(deleteBill).to.equal('Bill deleted successfully')
          done()
        })
    }).timeout(5000)

    it('Should delete the new business', done => {
      request
        .post('/graphql')
        .send(deleteBusiness(business._id))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { deleteBusiness, errors } = res.body.data
          expect(errors).to.satisfy(err => err === undefined || err === null)
          expect(deleteBusiness).to.not.equal('Business not found')
          expect(deleteBusiness).to.equal('Business deleted successfully')
          done()
        })
    }).timeout(5000)

    it('Should delete the new user', done => {
      request
        .post('/graphql')
        .send(deleteUser(user._id))
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
        .end((err, res) => {
          if (err) done(err)
          const { deleteUser, errors } = res.body.data
          expect(errors).to.satisfy(err => err === undefined || err === null)
          expect(deleteUser).to.not.equal('User not found')
          expect(deleteUser).to.equal('User deleted successfully')
          done()
        })
    }).timeout(5000)
  })
})
