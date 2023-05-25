const httpStatus = require('http-status');
const { whatsappService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const sendTextMessage = catchAsync(async (req, res) => {
  const response = await whatsappService.sendWhatsappMessage(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const sendImageMessage = catchAsync(async (req, res) => {
  const response = await whatsappService.sendWhatsappMessage(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const sendVideoMessage = catchAsync(async (req, res) => {
  const response = await whatsappService.sendWhatsappMessage(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const sendAudioMessage = catchAsync(async (req, res) => {
  const response = await whatsappService.sendWhatsappMessage(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const sendDocumentMessage = catchAsync(async (req, res) => {
  const response = await whatsappService.sendWhatsappMessage(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const sendLocationMessage = catchAsync(async (req, res) => {
  const response = await whatsappService.sendWhatsappMessage(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const sendTemplateTextMessage = catchAsync(async (req, res) => {
  const response = await whatsappService.sendWhatsappMessage(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const sendTemplateImageMessage = catchAsync(async (req, res) => {
  const response = await whatsappService.sendWhatsappMessage(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const sendTemplateInteractiveMessage = catchAsync(async (req, res) => {
  const response = await whatsappService.sendWhatsappMessage(req.body);
  res.status(httpStatus.CREATED).send(response);
});

const getWhatsappJourneys = catchAsync(async (req, res) => {
  const filter = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await whatsappService.getWhatsappJourneys(filter, options);
  res.send(result);
});

const getWhatsappJourney = catchAsync(async (req, res) => {
  const whatsappJourney = await whatsappService.getWhatsappJourneyById(req.params.journeyId);
  if (!whatsappJourney) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Whatsapp Journey not found');
  }
  res.send(whatsappJourney);
});

const createWhatsappJourney = catchAsync(async (req, res) => {
  const whatsappJourney = await whatsappService.createWhatsappJourney(req.body);
  res.status(httpStatus.CREATED).send(whatsappJourney);
});

const updateWhatsappJourney = catchAsync(async (req, res) => {
  const whatsappJourney = await whatsappService.updateWhatsappJourneyById(req.params.journeyId, req.body);
  res.send(whatsappJourney);
});

const deleteWhatsappJourney = catchAsync(async (req, res) => {
  await whatsappService.deleteWhatsappJourneyById(req.params.journeyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  sendTextMessage,
  sendImageMessage,
  sendVideoMessage,
  sendAudioMessage,
  sendDocumentMessage,
  sendLocationMessage,
  sendTemplateTextMessage,
  sendTemplateImageMessage,
  sendTemplateInteractiveMessage,
  getWhatsappJourneys,
  getWhatsappJourney,
  createWhatsappJourney,
  updateWhatsappJourney,
  deleteWhatsappJourney,
};
