const API_URL = import.meta.env.VITE_API_URL;

export async function getHobbies() {
  const response = await fetch(`${API_URL}/api/hobby`);

  if (!response.ok) {
    throw new Error("Failed to fetch hobby");
  }

  return response.json();
}

export async function createHobby(hobby) {
  const response = await fetch(`${API_URL}/api/hobby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hobby),
  });
  if (!response.ok) {
    throw new Error("Failed to create hobby");
  }
  return response.json();
}

export async function updateHobby(id, hobby) {
  const response = await fetch(`${API_URL}/api/hobby/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hobby),
  });
  if (!response.ok) {
    throw new Error("Failed to update hobby");
  }
  return response.json();
}

export async function deleteHobby(id) {
  const response = await fetch(`${API_URL}/api/hobby/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete hobby");
  }

  return response.json();
}
