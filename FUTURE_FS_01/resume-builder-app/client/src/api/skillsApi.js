const API_URL = import.meta.env.VITE_API_URL;

export async function getTechnicalSkills() {
  const response = await fetch(`${API_URL}/api/technical-skill`);

  if (!response.ok) {
    throw new Error("Failed to fetch technical Skill");
  }

  return response.json();
}

export async function createTechnicalSkill(technicalSkill) {
  const response = await fetch(`${API_URL}/api/technical-skill`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(technicalSkill),
  });
  if (!response.ok) {
    throw new Error("Failed to create technical Skill");
  }
  return response.json();
}

export async function updateTechnicalSkill(id, technicalSkill) {
  const response = await fetch(`${API_URL}/api/technical-skill/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(technicalSkill),
  });
  if (!response.ok) {
    throw new Error("Failed to update technical Skill");
  }
  return response.json();
}

export async function deleteTechnicalSkill(id) {
  const response = await fetch(`${API_URL}/api/technical-skill/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete technical Skill");
  }

  return response.json();
}

export async function getSoftSkills() {
  const response = await fetch(`${API_URL}/api/soft-skill`);

  if (!response.ok) {
    throw new Error("Failed to fetch Soft Skill");
  }

  return response.json();
}

export async function createSoftSkill(softSkill) {
  const response = await fetch(`${API_URL}/api/soft-skill`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(softSkill),
  });
  if (!response.ok) {
    throw new Error("Failed to create Soft Skill");
  }
  return response.json();
}

export async function updateSoftSkill(id, softSkill) {
  const response = await fetch(`${API_URL}/api/soft-skill/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(softSkill),
  });
  if (!response.ok) {
    throw new Error("Failed to update Soft Skill");
  }
  return response.json();
}

export async function deleteSoftSkill(id) {
  const response = await fetch(`${API_URL}/api/soft-skill/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete Soft Skill");
  }

  return response.json();
}
