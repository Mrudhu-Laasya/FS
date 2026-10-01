const { response } = require("express");
const Certificates = require("../models/Certificates");

const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificates.find();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const createCertificate = async (req, res) => {
  try {
    const createCertificateResponse = await Certificates.create(req.body);
    res.json(createCertificateResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const updateCertificateResponse = await Certificates.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after" },
    );
    res.status(201).json(updateCertificateResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const deleteCertificateResponse = await Certificates.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteCertificateResponse) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }
    res.status(200).json({
      message: "Certificate deleted successfully",
      certificate: deleteCertificateResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCertificates,
  createCertificate,
  deleteCertificate,
  updateCertificate,
};
