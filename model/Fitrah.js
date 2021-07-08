const mongoose  = require('mongoose');

//user transaction shema before payment checkout
const zakatSchema = new mongoose.Schema(
    {
        nama: { type: String, required: true, min: 6, max: 200 },
        email: { type: String,required: true, min: 6, max: 150 },
        hp: { type: String, required: true, min: 10, max: 14 },
        nama_amil: { type: String, required: true, min: 3, max: 150 },
        provinsi_amil: { type: String, required: true, min: 3, max: 150 },
        jumlah_tanggungan: { type: Number, required: true},
        harga_beras: { type: Number, required: true, min: 8000 },
        date: { type: Date, default: Date.now }
    }
);

module.exports = mongoose.model('Fitrah', zakatSchema);