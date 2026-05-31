export async function chatWithLuna(
  message: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  context: {
    userName: string;
    nickname?: string;
    age?: number;
    cycleLength?: number;
    periodLength?: number;
    currentCycleDay: number;
    todaySymptoms: string[];
    todayMood: string;
    language?: 'pt' | 'en' | 'es';
  }
): Promise<string> {
  try {
    const response = await fetch("/api/chat-with-luna", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, history, context }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "Desculpe, não consegui obter resposta da Luna.";
  } catch (error) {
    console.error("Client fetch error from Gemini API proxy:", error);
    if (context.language === 'en') {
      return "Sorry, I had trouble communicating with Luna AI. Please verify your internet connection and try again.";
    } else if (context.language === 'es') {
      return "Lo siento, tuve un problema al conectarme con Luna IA. Por favor, comprueba tu conexión e inténtalo de nuevo.";
    }
    return "Desculpe, tive um problema de ligação ao servidor da Luna. Verifique a sua conexão e tente novamente.";
  }
}

