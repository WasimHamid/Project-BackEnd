const cors = require("cors")
const express = require("express")
const stripe = require("stripe")("sk_test_51GxCClIrZ1H4aOKzaRlZoyrD30FJ9wUIG2bkLP88eM73Psw7to0fn6r5Bcc8n75bNNHOfjB210HXvWaucetgKthR00PyZCfQ9A")
const { v4: uuidv4 } = require('uuid');




const app = express();



app.use(express.json())
app.use(cors())



app.get("/", (req, res) => {
    res.send("It Works")
})


app.post("/payment", (req, res) => {

    const { product, token } = req.body;
    console.log("PRODUCT", product);
    console.log("PRODUCT", product.price);
    const idempontencyKey = uuidv4()

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: product.name,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, { idempontencyKey })
    })
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err))

})



app.listen(process.env.PORT || 8282, () => console.log("Listening at port 8282"))