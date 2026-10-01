const express = require("express");
const router = express.Router();

const {
  getCertificates,
  createCertificate,
  deleteCertificate,
  updateCertificate,
} = require("../controllers/certificationController");

router.get("/", getCertificates);
router.post("/", createCertificate);
router.patch("/:id", updateCertificate);
router.delete("/:id", deleteCertificate);

module.exports = router;
