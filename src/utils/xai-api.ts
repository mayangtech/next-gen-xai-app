const API_KEY = import.meta.env.VITE_XAI_API_KEY;
const API_URL = "https://api.x.ai/v1/chat/completions";

export const sendMessage = async (message: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content: "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."
          },
          { role: "user", content: message }
        ],
        stream: false,
        temperature: 0
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