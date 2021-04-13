const Joi =require("joi");
const { STATES } = require("mongoose");

module.exports.campgroundSchema =Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // img: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages:Joi.array()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required(),
        reviewbody:Joi.string().required()
    }).required()
});