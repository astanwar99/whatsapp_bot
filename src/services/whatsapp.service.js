const axios = require('axios');
const httpStatus = require('http-status');
const { WhatsappJourney } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const sendWhatsappMessage = async (body) => {
  const data = JSON.stringify(body);
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://graph.facebook.com/v16.0/117146298044675/messages',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FACEBOOK_ACCESS_TOKEN}`,
    },
    data,
  };

  axios
    .request(config)
    .then((response) => {
      logger.info('whatsapp message sent');
      return response;
    })
    .catch((error) => {
      logger.error(`failed to send whatsapp message: ${error}`);
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to send whatsapp message');
    });
};

const getWhatsappJourneys = async (filter, options) => {
  const whatsappJourneys = await WhatsappJourney.paginate(filter, options);
  return whatsappJourneys;
};

const getWhatsappJourneyById = async (id) => {
  return WhatsappJourney.findById(id);
};

const createWhatsappJourney = async (whatsappJourneyBody) => {
  const whatsappJourney = await WhatsappJourney.create(whatsappJourneyBody);
  return whatsappJourney;
};

const updateWhatsappJourneyById = async (whatsappJourneyId, updateBody) => {
  const whatsappJourney = await getWhatsappJourneyById(whatsappJourneyId);
  if (!whatsappJourney) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WhatsappJourney not found');
  }
  Object.assign(whatsappJourney, updateBody);
  await whatsappJourney.save();
  return whatsappJourney;
};

const deleteWhatsappJourneyById = async (whatsappJourneyId) => {
  const whatsappJourney = await getWhatsappJourneyById(whatsappJourneyId);
  if (!whatsappJourney) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WhatsappJourney not found');
  }
  await whatsappJourney.remove();
  return whatsappJourney;
};

module.exports = {
  sendWhatsappMessage,
  getWhatsappJourneys,
  getWhatsappJourneyById,
  createWhatsappJourney,
  updateWhatsappJourneyById,
  deleteWhatsappJourneyById,
};
