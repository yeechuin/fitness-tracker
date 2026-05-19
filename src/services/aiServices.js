export async function askAI(context) {
  const { user, todayMeals, recentWorkouts, userMessage } = context;

  const userText = `
User:
- Name: ${user.name}
- Age: ${user.age}
- Weight: ${user.weight}
- Height: ${user.height}
- Gender: ${user.gender}
- Calorie Goal: ${user.calorieGoal}
  `.trim();

  const mealsText =
    todayMeals.length > 0
      ? todayMeals.map((m) => `- ${m.type}: ${m.calories} kcal`).join("\n")
      : "No meals logged today";

  const workoutsText =
    recentWorkouts.length > 0
      ? recentWorkouts
          .map((w) => `- ${w.exercise.name}: ${w.reps} x ${w.sets}`)
          .join("\n")
      : "No workouts recently";

  const prompt = `
You are an expert fitness coach and nutrition assistant.

Be concise and practical (max 5 bullet points).

User Profile:
${userText}

Today's Meals:
${mealsText}

Recent Workouts:
${workoutsText}

User Question:
${userMessage}
  `.trim();

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Fitness AI App",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    },
  );

  const data = await response.json();
  const aiReply = data.choices?.[0]?.message?.content;

  return aiReply;
}
