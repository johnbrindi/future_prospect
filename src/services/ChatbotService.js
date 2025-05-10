export const generateContentWithGemini = async (prompt, messages, apiKey) => {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    // System knowledge base specifically for FutureProspect Bamenda
    const systemKnowledge = `FutureProspect is an internship platform for University of Bamenda students, connecting them with local companies.  
    Features: Student/Company portals, 
    map integration, Bamenda focus.  Partners: Bamenda Tech Hub, Regional Hospital, etc.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Role: You are the AI assistant for FutureProspect Bamenda.
                Purpose: Help University of Bamenda students find internships.
                
                System Knowledge:
                ${systemKnowledge}
                
                Conversation History:
                ${messages.map(m => `${m.sender}: ${m.text}`).join("\n")}
                
                Response Guidelines:
                1. Focus on Bamenda-specific opportunities
                2. Explain features simply (many year one students)
                3. For location questions, emphasize map feature
                5. Direct complex queries to johnbrindimazwewoh@gmail.com
                
                Current Question: ${prompt}`
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "API request failed");
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 
             "Please visit FutureProspect.com for internship opportunities around Bamenda.";
    } catch (error) {
      console.error("API Error:", error);
      return "System busy. Try again later or email johnbrindimazwewoh@gmail.com";
    }
};