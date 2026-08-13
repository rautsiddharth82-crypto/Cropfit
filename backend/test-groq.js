require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Explain importance of low latency LLMs' }],
      model: 'llama-3.3-70b-versatile',
    });
    console.log(chatCompletion.choices[0]?.message?.content);
  } catch (err) {
    console.error('Groq Error Details:');
    if (err instanceof Groq.APIError) {
      console.error(err.status);
      console.error(err.name);
      console.error(err.error);
    } else {
      console.error(err);
    }
  }
}

main();
