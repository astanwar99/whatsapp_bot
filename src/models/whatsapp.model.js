const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const whatsappJourneyMessageSchema = mongoose.Schema(
  {
    sequence: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    templateId: {
      type: String,
    },
    weight: {
      type: Number,
      required: true,
      default: 1,
    },
    context: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const whatsappJourneySchema = mongoose.Schema({
  identifier: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  messages: [whatsappJourneyMessageSchema],
});

const whatsappMessageSchema = mongoose.Schema(
  {
    senderWaId: {
      type: String,
    },
    senderProfileName: {
      type: String,
    },
    senderDisplayPhoneNumber: {
      type: String,
    },
    senderPhoneId: {
      type: String,
    },
    senderPhoneNumber: {
      type: String,
    },
    waMessageId: {
      type: String,
      required: true,
    },
    waMessageType: {
      type: String,
    },
    waMessageTimestamp: {
      type: Number,
    },
    waMessageContent: {
      type: String,
    },
    journeyId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'WhatsappJourney',
    },
    journeyMessageSequence: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

whatsappJourneySchema.plugin(toJSON);
whatsappJourneySchema.plugin(paginate);

const WhatsappJourney = mongoose.model('WhatsappJourney', whatsappJourneySchema);
const WhatsappMessage = mongoose.model('WhatsappMessage', whatsappMessageSchema);

module.exports = {
  WhatsappJourney,
  WhatsappMessage,
};
