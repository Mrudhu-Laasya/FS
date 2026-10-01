const API_URL = import.meta.env.VITE_API_URL;

export async function getEducation() {
  const response = await fetch(`${API_URL}/api/education`);

  if (!response.ok) {
    throw new Error("Failed to fetch education");
  }

  return response.json();
}

export async function createEducation(education) {
  const response = await fetch(`${API_URL}/api/education`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(education),
  });
  if (!response.ok) {
    throw new Error("Failed to create education");
  }
  return response.json();
}

export async function updateEducation(id, education) {
  const response = await fetch(`${API_URL}/api/education/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(education),
  });
  if (!response.ok) {
    throw new Error("Failed to update education");
  }
  return response.json();
}

export async function deleteEducation(id) {
  const response = await fetch(`${API_URL}/api/education/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete education");
  }

  return response.json();
}
