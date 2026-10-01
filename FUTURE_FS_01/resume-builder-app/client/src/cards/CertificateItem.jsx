import { useState } from "react";
import "../index.css";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import CertificatesForm from "../forms/CertificatesForm";
import { updateCertificate, deleteCertificate } from "../api/certificationApi";
import useEdit from "../context/useEdit";

export default function CertificateItem({
  id,
  title,
  issuer,
  issuedDate,
  certificateUrl,
  onRefresh,
}) {
  const { isEditValid } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const certificate = {
    title,
    issuer,
    issuedDate,
    certificateUrl,
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateCertificate(id, updatedData);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteCertificate(id);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  if (isEditing) {
    return (
      <div className="achievement-item">
        <div className="item-header">
          <div className="section-edit-title">EDIT CERTIFICATE</div>
        </div>

        <CertificatesForm
          initialData={certificate}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }
  return (
    <div className="certificate-item">
      {isEditValid && (
        <div class="item-header">
          {" "}
          <EditButton onClick={handleEdit} />
          <DeleteButton onClick={handleDelete} />
        </div>
      )}
      <div className="certificate-header">
        <span className="certificate-title">{title}</span>

        <span className="certificate-issuer">{issuer}</span>
      </div>

      <div className="certificate-meta">
        {issuedDate && (
          <span className="certificate-date">Issued: {issuedDate}</span>
        )}

        {certificateUrl && (
          <a
            className="certificate-link"
            href={certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Certificate ↗
          </a>
        )}
      </div>
    </div>
  );
}
