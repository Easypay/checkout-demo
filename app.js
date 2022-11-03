const express = require('express')
const https = require('https')
const path = require('path')
require('dotenv').config()

const app = express()
const port = 3000

// TODO: remove after inclusion from CDN
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/files', express.static(path.join(__dirname, 'files')))

app.get('/checkoutmanifest/:type', createCheckoutSession)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/sdk', (req, res) => {
  const sdkVersion = '2.4.0'
  if (!process.env.SDK_URL) {
    // Include from production CDN
    res.redirect(`https://cdn.easypay.pt/checkout/${sdkVersion}/`)
    return
  }
  if (process.env.SDK_URL.startsWith('http')) {
    // Include from a different URL (other testing environments)
    try {
      const _url = new URL(process.env.SDK_URL)
    } catch (e) {
      res.status(500).send('SDK_URL is not a valid URL.')
      return
    }
    res.redirect(new URL(`${sdkVersion}/`, process.env.SDK_URL))
  } else {
    // Return file from disk (to debug local version)
    res.sendFile(process.env.SDK_URL)
  }
})

app.get('/iframeUrl', (req, res) => {
  res.send(process.env.IFRAME_URL || '')
})

app.get('/popup', (req, res) => {
  res.sendFile(path.join(__dirname, 'popup.html'))
})

app.get('/inline', (req, res) => {
  res.sendFile(path.join(__dirname, 'inline.html'))
})

app.listen(port, () => {
  console.log(`Checkout page running on http://localhost:${port}`)
})

/**
 * Uses the Account ID and API Key to send an authenticated request from this server
 * to easypay's APIs, creating a new Checkout Session.
 * Receives a Checkout Manifest and returns it to the client, which will use it
 * to initialize the Checkout SDK in the client side.
 */
function createCheckoutSession(req, res) {
  const accountId = process.env.TEST_ACCOUNT_ID
  const apiKey = process.env.TEST_API_KEY
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const host = 'api.test.easypay.pt'

  console.log("payment type: ", req.params.type)

  let payment = {
    methods: ['cc', 'mb', 'mbw', 'dd', 'vi', 'uf', 'sc'],
    type: 'sale',
    capture: {
      transaction_key: 'string',
      descriptive: 'Descriptive Example',
    },
    currency: 'EUR',
    expiration_time: tomorrow.toISOString().slice(0, 16).replace('T', ' '),
  }

  if (req.params.type === 'subscription') {
    const today = new Date()
    today.setDate(today.getHours() + 1)
    payment.start_time = today.toISOString().slice(0, 16).replace('T', ' ')
    payment.frequency = '1W'
  }

  const payload = JSON.stringify({
    type: [req.params.type],
    payment: payment,
    order: {
      value: 302,
      key: 'order-key',
      items: [
        {
          description: 'Item in cart',
          quantity: 1,
          key: 'product-1',
          value: 150,
        },
        {
          description: 'Item 2 in cart',
          quantity: 1,
          key: 'product-2',
          value: 152,
        },
      ],
    },
    config: {},
    customer: {
      name: 'Customer Example',
      email: 'customer@example.com',
      phone: '911234567',
      phone_indicative: '+351',
      fiscal_number: 'PT123456789',
      key: 'Key Example',
      language: 'PT',
    },
  })

  const options = {
    hostname: host,
    path: '/2.0/checkout',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
      AccountId: accountId,
      ApiKey: apiKey,
    },
  }

  var httpreq = https.request(options, function (response) {
    let manifest = ''
    response.on('data', function (chunk) {
      manifest += chunk
    })
    response.on('end', function () {
      console.log('received: ', manifest)
      res.send(manifest)
    })
  })

  httpreq.write(payload)
  httpreq.end()
}
