import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeAlert(rawData: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return 'Alert received but summary unavailable';
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `Summarize this crisis/disaster report in 1-2 sentences, extracting the key danger: "${rawData}"`,
        },
      ],
      temperature: 0.2,
    });

    return completion.choices[0]?.message?.content?.trim() || 'Unable to process alert';
  } catch (error) {
    console.error('Summarization error:', error);
    return 'Alert received but summary unavailable';
  }
}
