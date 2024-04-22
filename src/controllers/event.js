const { isValidObjectId } = require("mongoose");
const StandardApi = require("../middlewares/standard-api");

const DispatchEvent = async (req, res) => StandardApi(req, res, async () => {

})

module.exports = {
    DispatchEvent
};