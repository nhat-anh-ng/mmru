const Joi = require("joi");

module.exports.mmruSchema = Joi.object({
  mmru: Joi.object({
    ville: Joi.string().required(),
    nom: Joi.string().required(),
    adresse: Joi.string().required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
