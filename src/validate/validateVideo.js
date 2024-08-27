const Joi = require('joi');

const videoSchema = Joi.object({
    videoPath: Joi.string().required(),
    title: Joi.string().max(255).required(),
    description: Joi.string().max(500).optional(),
    thumbnail: Joi.string().required(),
    duration: Joi.number().integer().optional(),
    isPublic: Joi.boolean().default(true),
    views: Joi.number().integer().default(0)
});

module.exports = {
    videoSchema
};
