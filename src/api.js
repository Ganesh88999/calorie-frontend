// api.js
const API_BASE_URL = "https://calorie-backend-q4r0.onrender.com";
export default API_BASE_URL;
fetch(`${API_BASE_URL}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  

