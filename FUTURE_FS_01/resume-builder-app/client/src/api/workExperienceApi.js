const API_URL = import.meta.env.VITE_API_URL;

export async function getWorkExperiences() {
  const response = await fetch(`${API_URL}/api/work-experience`);

  if (!response.ok) {
    throw new Error("Failed to fetch Work Experience");
  }

  return response.json();
}

export async function createWorkExperience(workExperience) {
  const response = await fetch(`${API_URL}/api/work-experience`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workExperience),
  });
  if (!response.ok) {
    throw new Error("Failed to create Work Experience");
  }
  return response.json();
}

export async function updateWorkExperience(id, workExperience) {
  const response = await fetch(`${API_URL}/api/work-experience/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workExperience),
  });
  if (!response.ok) {
    throw new Error("Failed to update Work Experience");
  }
  return response.json();
}

export async function deleteWorkExperience(id) {
  const response = await fetch(`${API_URL}/api/work-experience/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete Work Experience");
  }

  return response.json();
}

export async function updateRole(workExId, roleIndex, role) {
  const response = await fetch(
    `${API_URL}/api/work-experience/${workExId}/roles/${roleIndex}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(role),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to update Role in WorkExperience");
  }
  return response.json();
}

export async function deleteRole(workExId, roleIndex) {
  const response = await fetch(
    `${API_URL}/api/work-experience/${workExId}/roles/${roleIndex}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to delete Work Experience");
  }

  return response.json();
}
