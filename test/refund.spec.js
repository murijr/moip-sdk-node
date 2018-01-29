const auth = require('./config/auth')
const moip = require('../index').default(auth)
const chai = require('chai')
const orderModel = require('./schemas/order')
const paymentModel = require('./schemas/payment')
const shortid = require('shortid')

chai.should()
chai.use(require('chai-json-schema'))

describe('Moip Payment Refunds', () => {
  beforeEach((done) => {
    setTimeout(done, 2000)
  })

  before((done) => {
    orderModel.ownId = shortid.generate()
    orderModel.customer.ownId = shortid.generate()
    done()
  })

  let orderId

  it('Should successfully create an order', (done) => {
    moip.order.create(orderModel)
      .then(({body}) => {
        orderId = body.id
        done()
      })
      .catch(done)
  })

  it('Should successfully create a payment for an order', (done) => {
    moip.payment.create(orderId, paymentModel)
      .then(({body}) => {
        // Verify and add to schema
        body.should.have.property('id')
        paymentModel.id = body.id
        done()
      })
      .catch(done)
  })

  it('Should successfully refund the payment', (done) => {
    moip.payment.refund(paymentModel.id)
      .then(({body}) => {
        body.should.have.property('id')
        body.should.have.property('status')
        body.status.should.be.eql('COMPLETED')
        done()
      })
      .catch(done)
  })
})

describe('Moip Order Refunds', () => {
  beforeEach((done) => {
    setTimeout(done, 2000)
  })

  before((done) => {
    orderModel.ownId = shortid.generate()
    orderModel.customer.ownId = shortid.generate()
    done()
  })

  let orderId

  it('Should successfully create an order', (done) => {
    moip.order.create(orderModel)
      .then(({body}) => {
        orderId = body.id
        done()
      })
      .catch(done)
  })

  it('Should successfully create a payment for an order', (done) => {
    moip.payment.create(orderId, paymentModel)
      .then(({body}) => {
        // Verify and add to schema
        body.should.have.property('id')
        paymentModel.id = body.id
        done()
      })
      .catch(done)
  })

  it('Should successfully refund the payment', (done) => {
    moip.order.refund(orderId)
      .then(({body}) => {
        body.should.have.property('id')
        body.should.have.property('status')
        body.status.should.be.eql('COMPLETED')
        done()
      })
      .catch(done)
  })
})