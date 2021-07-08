const Joi = require('joi');

// Register VALIDATION with JOI
const registerValidation = data => {
    const schema = Joi.object(
        {
            nama: Joi.string().min(6).required(),
            tempat_lahir: Joi.string().min(3).max(150).required(),
            tgl_lahir: Joi.string().min(8).max(50).required(),
            gender: Joi.string().min(1).max(9).required(),
            alamat: Joi.string().min(10).max(250).required(),
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(6).required(),
            ulang_password: Joi.ref('password'),
            hp: Joi.string().min(10).max(14).required(),
            pekerjaan: Joi.string().min(6).max(100).required(),
        }
    );
    return schema.validate(data);
}

// Login VALIDATION with JOI
const loginValidation = data => {
    const schema = Joi.object(
        {
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(6).required()
        }
    );
    return schema.validate(data);
}

module.exports = { registerValidation, loginValidation };