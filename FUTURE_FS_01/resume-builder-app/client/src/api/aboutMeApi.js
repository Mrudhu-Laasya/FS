const API_URL = import.meta.env.VITE_API_URL;

export async function getAboutMe() {
  const response = await fetch(`${API_URL}/api/about-me`);

  if (!response.ok) {
    throw new Error("Failed to fetch About Me");
  }

  return response.json();
}

export async function updateAboutMe(id, description) {
  const response = await fetch(`${API_URL}/api/about-me/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: description,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update About Me");
  }

  return response.json();
}
