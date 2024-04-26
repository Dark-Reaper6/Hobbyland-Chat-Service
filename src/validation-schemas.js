const yup = require("yup");
const { isValidObjectId } = require("mongoose");

const SendMessageSchema = yup.object().shape({
    room_id: yup.string().test('is-objectId', 'Invalid room_id.', (value) => isValidObjectId(value)).required(),
    message: yup.string().min(1).required(),
});

module.exports = {
    SendMessageSchema
}