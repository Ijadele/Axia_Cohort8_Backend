const kycModel = require("../models/kyc.model");
const userModel = require("../models/user.model");

const createKyc = async (req, res) => {
  const payload = req.body;
  const { id } = req.user;

  try {
    const existingKyc = await kycModel.findOne({ user: id });
    if (existingKyc) {
      return res.json({ message: "KYC already exists" });
    }

    const newKyc = new kycModel({ user: id, ...payload });
    const savedKyc = await newKyc.save();

    const updatedUser = await userModel
      .findByIdAndUpdate(id, { kyc: savedKyc.id }, { new: true })
      .populate("kyc");

    return res.json({ message: "KYC added successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};



const getOneKyc = async (req, res) => {
    const {kycId} = req.query

    try {
        const kyc = await kycModel.findById(kycId).populate("user");
        return res.json(kyc)
    } catch (error) {
        return res.send(error.message)
    }
}

module.exports = {createKyc, getOneKyc}