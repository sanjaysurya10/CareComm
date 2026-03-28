import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
    try {
        const { scenario, userResponse, mode } = await req.json();
        if (!scenario || !userResponse) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        let systemPrompt;

        if (mode === 'comprehension') {
            systemPrompt = `
You are a healthcare communication assessor. A patient said:
"${scenario.patientSays}"

The user was asked: "${scenario.task || 'Summarise what the patient said.'}"
Key words/ideas they should have captured: ${(scenario.keyPoints || []).join(', ')}

Score their transcription/summary out of 25 in each category:
- relevance: Did they capture the core meaning? (0-25)
- clarity: Is their summary clear and concise? (0-25)
- safety: Did they identify any safety or clinical concerns? (0-25)
- tone: Appropriate framing/language? (0-25)

totalScore = sum of all four (0-100).
Provide brief 2-sentence feedback. Start with what was right, then what was missed.
Return ONLY valid JSON, no markdown:
{"scores":{"relevance":<0-25>,"clarity":<0-25>,"safety":<0-25>,"tone":<0-25>},"feedback":"...","totalScore":<0-100>}
`;
        } else {
            systemPrompt = `
You are a master healthcare communication assessor in Ireland.
Evaluate the user's response to this scenario:
Setting: ${scenario.setting}
Background Context: ${scenario.background || 'None provided.'}
Patient Says: "${scenario.patientSays}"
Category: ${scenario.category}
Key Points Required: ${(scenario.keyPoints || []).join(', ')}

Score out of 25 in each:
- relevance: Did they answer correctly and hit key points? (0-25)
- clarity: Simple, clear English a patient can understand? (0-25)
- safety: Safe instruction, no harmful advice? (0-25)
- tone: Empathetic and appropriate, not robotic? (0-25)

totalScore = sum. 2-sentence feedback: what was good, what to improve.
Return ONLY valid JSON, no markdown:
{"scores":{"relevance":<0-25>,"clarity":<0-25>,"safety":<0-25>,"tone":<0-25>},"feedback":"...","totalScore":<0-100>}
`;
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.1,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userResponse }
            ],
            response_format: { type: 'json_object' },
        });

        const result = JSON.parse(completion.choices[0].message.content);
        return NextResponse.json(result);

    } catch (error) {
        console.error('Evaluate API error:', error);
        return NextResponse.json({
            scores: { relevance: 12, clarity: 12, safety: 12, tone: 12 },
            feedback: 'AI evaluation failed. Please try again.',
            totalScore: 48
        }, { status: 500 });
    }
}
