const mongoose  = require('mongoose');

//user schema
const userSchema = new mongoose.Schema(
    {
        nama: { type: String, required: true, min: 6, max: 200 },
        tempat_lahir: { type: String, required: true, min: 3, max: 150 },
        tgl_lahir: { type: String, required: true, min: 8, max: 50 },
        gender: { type: String, required: true, min: 1, max: 9 },
        alamat: { type: String, required: true, min: 10, max: 250 },
        email: { type: String,required: true, min: 6, max: 150 },
        password: { type: String, required: true, min: 6, max: 1024 },
        ulang_password: { type: String, required: true, min: 6, max: 1024 },
        hp: { type: String, required: true, min: 10, max: 14 },
        pekerjaan: { type: String, required: true, min: 6, max: 100 },
        date: { type: Date, default: Date.now }
    }
);

module.exports = mongoose.model('User', userSchema);