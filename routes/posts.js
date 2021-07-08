//npm third-module
const router = require('express').Router();
const midtransClient = require('midtrans-client');
//user-defined model
const User = require('../model/User');
const zakatFitrah = require('../model/Fitrah');
//token login jwt
const verify = require('./verifyToken');

router.post('/zakat-fitrah', verify, async (req, res) => {
        await User.findById(req.user, async (error, data) => {
            if(error) res.send(error);
            const transaksi = new zakatFitrah({
                nama: data.nama,
                email: data.email,
                hp: data.hp,
                nama_amil: 'lazismu',
                provinsi_amil: 'jambi',
                jumlah_tanggungan: 3,
                harga_beras: 11000,
            })
            try {
                await transaksi.save();
                // midtrans payment gateway
                let snap = new midtransClient.Snap({
                    // Set to true if you want Production Environment (accept real transaction).
                    isProduction : false,
                    serverKey : 'SB-Mid-server-aofgMwYKMF9eTl-hpxrn_Vxe'
                });

                let parameter = {
                    "transaction_details": {
                        "order_id": transaksi._id,
                        "gross_amount": (transaksi.harga_beras * 3) * (1 + transaksi.jumlah_tanggungan)
                    },
                    "credit_card":{
                        "secure" : true
                    },
                    "customer_details": {
                        "first_name": transaksi.nama,
                        "email": transaksi.email,
                        "phone": transaksi.hp
                    }
                };

                snap.createTransaction(parameter)
                .then((transaction)=>{
                    // transaction token
                    let transactionToken = transaction.token;
                    res.send('https://app.sandbox.midtrans.com/snap/v2/vtweb/' + transactionToken);
                }
                );
                } catch (err) {
                    res.status(400).send(err);
                }
        }); 
})

module.exports = router;