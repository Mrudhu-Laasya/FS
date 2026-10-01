const API_URL = import.meta.env.VITE_API_URL;

export async function getCertificates() {
  const response = await fetch(`${API_URL}/api/certification`);

  if (!response.ok) {
    throw new Error("Failed to fetch certificates");
  }

  return response.json();
}

export async function createCertificate(certificate) {
  const response = await fetch(`${API_URL}/api/certification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(certificate),
  });
  if (!response.ok) {
    throw new Error("Failed to create certificate");
  }
  return response.json();
}

export async function updateCertificate(id, certificate) {
  const response = await fetch(`${API_URL}/api/certification/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(certificate),
  });
  if (!response.ok) {
    throw new Error("Failed to update certificate");
  }
  return response.json();
}

export async function deleteCertificate(id) {
  const response = await fetch(`${API_URL}/api/certification/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete certificate");
  }

  return response.json();
}
