import { useState, useEffect } from "react";
import "../index.css";
import CertificateItem from "../cards/CertificateItem";
import { createCertificate, getCertificates } from "../api/certificationApi";
import AddButton from "../components/AddButton.jsx";
import CertificatesForm from "../forms/CertificatesForm.jsx";
import useEdit from "../context/useEdit";

export default function Certifications() {
  const { isEditValid } = useEdit();
  const [certificates, setCertificates] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const fetchCertificates = async () => {
    try {
      const certificatesRes = await getCertificates();
      setCertificates(certificatesRes);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchCertificates();
    };
    fetchData();
  }, []);

  const handleAdd = async (newCertificate) => {
    console.log("New certificate:", newCertificate);

    // POST API here
    try {
      await createCertificate(newCertificate);

      await fetchCertificates();
    } catch (error) {
      console.error(error);
    }

    setShowAddForm(false);
  };
  return (
    <>
      <div className="certifications-card">
        <div className="section-header">
          <h4 className="section-title">CERTIFICATIONS</h4>
          {isEditValid && (
            <AddButton onClick={() => setShowAddForm(true)}>
              Add Certificates
            </AddButton>
          )}
        </div>

        {certificates.map((certificate) => (
          <CertificateItem
            key={certificate._id}
            id={certificate._id}
            title={certificate.title}
            issuer={certificate.issuer}
            issueDate={certificate.issuedDate}
            certificateUrl={certificate.certificateUrl}
            onRefresh={fetchCertificates}
          />
        ))}
        {showAddForm && (
          <>
            <div className="item-header">
              <div className="section-edit-title">NEW CERTIFICATE</div>
            </div>
            <CertificatesForm
              initialData={{}}
              onUpdate={handleAdd}
              onCancel={() => setShowAddForm(false)}
            />
          </>
        )}
      </div>
    </>
  );
}
