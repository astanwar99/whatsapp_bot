const axios = require('axios');
const httpStatus = require('http-status');
const { WhatsappJourney, WhatsappMessage } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { whatsappContext } = require('../config/whatsapp');

const sendWhatsappMessage = async (body) => {
  const data = JSON.stringify(body);
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://graph.facebook.com/v16.0/117146298044675/messages',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer EAAM1ZAxFAFIcBANVTVsRjeyZCZAlrUhcqkZCZBTARmAwOLzoU3vUeZBGZCEPPriPljrUCSVWAtskV6rnSaJEsLhSUoKt3KdbIW2VDyY6n0wF995K8BVqW3f6czwxDvMDYoCIjcq5CpiIw9wZBKnhKKQNFfypmqodZBjQJy3ZArptkrl9LcODSFWkGGtHirVVSZCUI4bkrK2b7DYG2rkDTLXY9XZC`,
    },
    data,
  };

  return new Promise((resolve, reject) => {
    axios
      .request(config)
      .then((response) => {
        logger.info('whatsapp message sent');
        logger.info(JSON.stringify(response.data));
        resolve(response.data);
      })
      .catch((error) => {
        logger.error(`failed to send whatsapp message: ${error}`);
        reject(error);
      });
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

const verificationCallback = async (hubMode, hubChallenge, hubVerifyToken) => {
  // TODO: add your own verification token
  if (hubMode === 'subscribe' && hubVerifyToken === 'whatsapp-callback-token') {
    return hubChallenge;
  }
};

const whatsappMessageSerializer = (body) => {
  // const sample = {
  //   object: 'whatsapp_business_account',
  //   entry: [
  //     {
  //       id: '109371382161521',
  //       changes: [
  //         {
  //           value: {
  //             messaging_product: 'whatsapp',
  //             metadata: { display_phone_number: '15550082668', phone_number_id: '117146298044675' },
  //             contacts: [{ profile: { name: 'Ashwani Tanwar' }, wa_id: '917999710236' }],
  //             messages: [
  //               {
  //                 from: '917999710236',
  //                 id: 'wamid.HBgMOTE3OTk5NzEwMjM2FQIAEhggMjhCOTA5RDg1MTFDOTIwNzg1NTIzNTlBQTBDRjQzMzQA',
  //                 timestamp: '1685071652',
  //                 text: { body: 'Hi 2' },
  //                 type: 'text',
  //               },
  //             ],
  //           },
  //           field: 'messages',
  //         },
  //       ],
  //     },
  //   ],
  // };
  const message = {
    senderWaId: body.entry[0].changes[0].value.contacts[0].wa_id,
    senderProfileName: body.entry[0].changes[0].value.contacts[0].profile.name,
    senderDisplayPhoneNumber: body.entry[0].changes[0].value.metadata.display_phone_number,
    senderPhoneId: body.entry[0].changes[0].value.metadata.phone_number_id,
    senderPhoneNumber: body.entry[0].changes[0].value.messages[0].from,
    waMessageId: body.entry[0].changes[0].value.messages[0].id,
    waMessageType: body.entry[0].changes[0].value.messages[0].type,
    waMessageTimestamp: body.entry[0].changes[0].value.messages[0].timestamp,
    waMessageContent: body.entry[0].changes[0].value.messages[0].text.body,
  };
  return message;
};

const getMessageContext = async (text) => {
  const processedText = text.toLowerCase();
  const positiveKeywords = ['yes', 'yep', 'yup', 'yeah', 'sure', 'ok', 'okay', 'fine', 'good'];
  const negativeKeywords = ['no', 'nope', 'nah', 'not', 'no way', 'never'];
  const initiateKeywords = ['hi', 'hello', 'hey', 'hola', 'bonjour', 'hallo', 'namaste'];
  const positiveKeywordsFound = positiveKeywords.filter((keyword) => processedText.includes(keyword));
  const negativeKeywordsFound = negativeKeywords.filter((keyword) => processedText.includes(keyword));
  const initiateKeywordsFound = initiateKeywords.filter((keyword) => processedText.includes(keyword));
  if (negativeKeywordsFound.length > 0) {
    return whatsappContext.NEGATIVE;
  }
  if (positiveKeywordsFound.length > 0) {
    return whatsappContext.POSITIVE;
  }
  if (initiateKeywordsFound.length > 0) {
    return whatsappContext.INITIATE;
  }
  return whatsappContext.END;
};
const triggerNextMessage = async (message, journey) => {
  return { message, journey };
};

const selectWhatsappJourney = async (message) => {
  let journey = await WhatsappJourney.find({ identifier: 'J0' });

  const lastMessage = await WhatsappMessage.findOne({
    senderWaId: message.senderWaId,
  }).sort({ waMessageTimestamp: -1 });

  if (!lastMessage) {
    return { journey, sequence: 1 };
  }

  journey = await WhatsappJourney.find({ _id: lastMessage.journeyId });
  const messageContext = await getMessageContext(message.waMessageContent);
  if (messageContext === whatsappContext.END) {
    return { journey, sequence: 0 };
  }
  if (messageContext === whatsappContext.POSITIVE) {
    return { journey, sequence: lastMessage.journeyMessageSequence + 1 };
  }
  return { journey, sequence: lastMessage.journeyMessageSequence + 1 };
};

const eventNotificationCallback = async (req) => {
  // TODO: sha256 validation
  // console.log(JSON.stringify(req.body));
  const serializedMessage = whatsappMessageSerializer(req.body);
  const whatsappJourney = await selectWhatsappJourney(serializedMessage);
  await triggerNextMessage(serializedMessage, whatsappJourney);
  return serializedMessage;
};

module.exports = {
  sendWhatsappMessage,
  getWhatsappJourneys,
  getWhatsappJourneyById,
  createWhatsappJourney,
  updateWhatsappJourneyById,
  deleteWhatsappJourneyById,
  verificationCallback,
  eventNotificationCallback,
};
