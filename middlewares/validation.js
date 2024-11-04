const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required().messages({
      "string.length": "The ID must be a 24-character hexadecimal string",
      "string.hex": "The ID must be a valid hexadecimal string",
      "any.required": "The ID is required",
    }),
  }),
});

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    weather: Joi.string().required().valid("hot", "cold", "warm").messages({
      "any.required": "Weather condition is required",
      "any.only": "Weather must be one of 'hot', 'cold', or 'warm'",
    }),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateQueryParams = celebrate({
  query: Joi.object().keys({
    filter: Joi.string().optional().messages({
      "string.base": "Filter must be a string",
    }),
    page: Joi.number().integer().min(1).messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be greater than or equal to 1",
    }),
  }),
});

module.exports.validateHeaders = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().required().messages({
        "string.empty": "Authorization header is required",
      }),
      "x-api-version": Joi.string().required().valid("1.0", "2.0").messages({
        "any.only": "API version must be either 1.0 or 2.0",
        "any.required": "API version is required",
      }),
    })
    .unknown(),
});
