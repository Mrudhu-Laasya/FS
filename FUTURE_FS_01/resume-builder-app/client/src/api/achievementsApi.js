const API_URL = import.meta.env.VITE_API_URL;

export async function getAchievements() {
  const response = await fetch(`${API_URL}/api/achievement`);

  if (!response.ok) {
    throw new Error("Failed to fetch Achievements");
  }

  return response.json();
}

export async function createAchievement(achievement) {
  const response = await fetch(`${API_URL}/api/achievement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(achievement),
  });
  if (!response.ok) {
    throw new Error("Failed to create achievement");
  }
  return response.json();
}

export async function updateAchievement(id, achievement) {
  const response = await fetch(`${API_URL}/api/achievement/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(achievement),
  });
  if (!response.ok) {
    throw new Error("Failed to update achievement");
  }
  return response.json();
}

export async function deleteAchievement(id) {
  const response = await fetch(`${API_URL}/api/achievement/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete achievement");
  }

  return response.json();
}
