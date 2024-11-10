const API_KEY = import.meta.env.VITE_XAI_API_KEY;
const API_URL = "https://api.xai.com/v1/chat"; // Replace with actual xAI API endpoint

export const sendMessage = async (message: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling xAI API:", error);
    throw error;
  }
};