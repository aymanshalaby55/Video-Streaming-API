const Joi = require('joi');

const commentSchema = Joi.object({
    content: Joi.string().max(1000).required(),
    videoId: Joi.string().required(),
    userId: Joi.string().required()
});

module.exports = {
    commentSchema
};
