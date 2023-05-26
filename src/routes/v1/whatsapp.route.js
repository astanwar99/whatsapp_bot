const express = require('express');
const validate = require('../../middlewares/validate');
const { whatsappValidation } = require('../../validations');
const whatsappController = require('../../controllers/whatsapp.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/send-text-message', auth(), whatsappController.sendTextMessage);
router.post('/send-image-message', auth(), whatsappController.sendImageMessage);
router.post('/send-video-message', auth(), whatsappController.sendVideoMessage);
router.post('/send-audio-message', auth(), whatsappController.sendAudioMessage);
router.post('/send-document-message', auth(), whatsappController.sendDocumentMessage);
router.post('/send-location-message', auth(), whatsappController.sendLocationMessage);

router.post('/send-template-text-message', auth(), whatsappController.sendTemplateTextMessage);
router.post('/send-template-image-message', auth(), whatsappController.sendTemplateImageMessage);
router.post('/send-template-interactive-message', auth(), whatsappController.sendTemplateInteractiveMessage);

router.get('/callback', whatsappController.verificationCallback);
router.post('/callback', whatsappController.eventNotificationCallback);

// Whatsapp Journey
router.get('/journeys', auth(), validate(whatsappValidation.getWhatsappJourneys), whatsappController.getWhatsappJourneys);
router.post(
  '/journey',
  auth(),
  validate(whatsappValidation.createWhatsappJourney),
  whatsappController.createWhatsappJourney
);
router.get(
  '/journey/:journeyId',
  auth(),
  validate(whatsappValidation.getWhatsappJourney),
  whatsappController.getWhatsappJourney
);
router.put(
  '/journey/:journeyId',
  auth(),
  validate(whatsappValidation.updateWhatsappJourney),
  whatsappController.updateWhatsappJourney
);
router.delete(
  '/journey/:journeyId',
  auth(),
  validate(whatsappValidation.deleteWhatsappJourney),
  whatsappController.deleteWhatsappJourney
);

module.exports = router;
