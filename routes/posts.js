//npm third-module
const router = require('express').Router();
const midtransClient = require('midtrans-client');
//user-defined model
const User = require('../model/User');
const zakatFitrah = require('../model/Fitrah');
//token login jwt
const verify = require('./verifyToken');
const logout = require('./logout');

router.post('/zakat-fitrah/:id', verify, async (req, res) => {
        await User.findById(req.params.id, async (error, data) => {
            if(error) res.send(error);
            const transaksi = new zakatFitrah({
                nama: data.nama,
                email: data.email,
                hp: data.hp,
                nama_amil: 'lazismu',
                provinsi_amil: 'jambi',
                jumlah_tanggungan: 3,
                harga_beras: 10000,
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

router.get('/riwayat/:email', verify, async (req, res) => {
    await zakatFitrah.find({email: req.params.email}, async (error, data) => {
        if(error) res.send(error);
        res.send(data);
    });
});

router.delete('/hapus-riwayat/:id', verify, async (req, res) => {
    await zakatFitrah.findByIdAndDelete(req.params.id, async (error, data) => {
        if(error) res.send(error);
        res.send(` riwayat transaksi dengan id ${data._id} telah dihapus.`);
    });
});

router.get('/logout/:id', logout, async (req, res) => {
    await User.findById(req.params.id, async (error, data) => {
        if(error) res.send(error);
        res.redirect('/api/posts/coba');
    })
});

router.get('/coba', async (req, res) => {
    res.send('coba-coba redirect');
})

module.exports = router;