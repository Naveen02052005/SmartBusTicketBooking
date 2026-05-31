const Joi = require('joi');
const schema = require("./Models/schema.sql");

module.exports.userSchema = Joi.object({
    fullName: Joi.string().min(3).max(100).required(),
    email : Joi.string().email().required(),
    phone: Joi.string().min(10).max(10).required(),
    password: Joi.string().min(6).required(),
})