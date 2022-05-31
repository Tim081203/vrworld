const paypal = require('paypal-rest-sdk')
const goodsModel = require('./goods-model')

paypal.configure({
    'mode': 'sandbox',
    'client_id': process.env.PAYPAL_ID,
    'client_secret': process.env.PAYPAL_SECRET
});

class PaymentController{
    async donatePaypal(req, res){
        try {
            const amount = req.params.amount
            const cart = req.params.id
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:5000/donate_success/" + amount + "/" + cart,
                    "cancel_url": "http://localhost:5000/profile"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "Payment",
                            "sku": "001",
                            "price": amount,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": amount
                    },
                    "description": "Top up balance"
                }]
            };

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.redirect(payment.links[i].href);
                        }
                    }
                }
            });
        }
        catch (e) {
            console.log(e)
        }
    }
    async donateSuccess(req, res){
        try {
            const payerId = req.query.PayerID;
            const paymentId = req.query.paymentId;
            const amount = req.params.amount
            const id = req.params.id

            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": amount
                    }
                }]
            };
            paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    await goodsModel.deleteOne({_id: id})
                    res.redirect('/profile');
                }
            });
        }
        catch (e) {
            console.log(e)
        }
    }

}

module.exports = new PaymentController()