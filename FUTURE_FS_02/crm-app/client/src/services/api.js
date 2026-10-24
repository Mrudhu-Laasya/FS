const API_BASE_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const createLead = async (leadData) => {
  const response = await fetch(`${API_BASE_URL}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leadData),
  });
  return response.json();
};

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 1. Get follow-ups grouped by category
export const getFollowups = async () => {
  const response = await fetch(`${API_BASE_URL}/api/followups`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return response.json();
};

// 2. Create a follow-up
export const createFollowup = async ({
  lead,
  followUpDate,
  followUpPurpose,
}) => {
  const response = await fetch(`${API_BASE_URL}/api/followups`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      lead,
      followUpDate,
      followUpPurpose,
    }),
  });

  return response.json();
};

// 3. Mark a follow-up as completed
export const markCompletion = async (id, outcome) => {
  const response = await fetch(`${API_BASE_URL}/api/followups/${id}/complete`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ outcome }),
  });

  return response.json();
};

// 4. Reschedule a follow-up
export const rescheduleFollowup = async (id, followUpDate) => {
  const response = await fetch(
    `${API_BASE_URL}/api/followups/${id}/reschedule`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ followUpDate }),
    },
  );

  return response.json();
};

// Get leads with optional endpoint parameter
export const getLeads = async (endpoint = "") => {
  const response = await fetch(`${API_BASE_URL}/api/leads/${endpoint}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch leads");
  }

  return data;
};

export const getDashboardSummary = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.startDate && filters.endDate) {
    params.set("period", "custom");
    params.set("startDate", filters.startDate);
    params.set("endDate", filters.endDate);
  } else {
    params.set("period", filters.period || "month");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/dashboard/summary?${params.toString()}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load dashboard");
  }

  return data;
};

export default API_BASE_URL;
