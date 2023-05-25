const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createWhatsappJourney = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    identifier: Joi.string().required(),
    messages: Joi.array()
      .items(
        Joi.object().keys({
          sequence: Joi.number().required(),
          message: Joi.string().required(),
          type: Joi.string().required(),
          templateId: Joi.string(),
          weight: Joi.number().required(),
          context: Joi.string().required(),
        })
      )
      .required(),
  }),
};

const updateWhatsappJourney = {
  body: Joi.object().keys({
    name: Joi.string(),
    messages: Joi.array()
      .items(
        Joi.object().keys({
          sequence: Joi.number().required(),
          message: Joi.string().required(),
          type: Joi.string().required(),
          templateId: Joi.string(),
          weight: Joi.number().required(),
        })
      )
      .required(),
  }),
  params: Joi.object().keys({
    journeyId: Joi.string().custom(objectId),
  }),
};

const getWhatsappJourney = {
  query: Joi.object().keys({
    identifier: Joi.string(),
  }),
  params: Joi.object().keys({
    journeyId: Joi.string().custom(objectId),
  }),
};

const getWhatsappJourneys = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteWhatsappJourney = {
  params: Joi.object().keys({
    journeyId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createWhatsappJourney,
  updateWhatsappJourney,
  getWhatsappJourney,
  getWhatsappJourneys,
  deleteWhatsappJourney,
};
