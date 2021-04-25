const Joi = require("joi");

module.exports.mmruSchema = Joi.object({
  mmru: Joi.object({
    ville: Joi.string().required(),
    nom: Joi.string().required(),
    adresse: Joi.string().required(),
  }).required(),
});
