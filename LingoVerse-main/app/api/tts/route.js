import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
    try {
        const { text, accent } = await req.json();
        if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

        // Preprocess text for more natural Irish rhythms:
        // - Add pauses around fillers common in Irish speech
        // - Slightly slow pacing cues (commas)
        const processedText = text
            .replace(/\bya\b/gi, 'ya')
            .replace(/\bfergettin\b/gi, 'fergettin\'')
            .replace(/\bsomethin\b/gi, 'somethin\'')
            .replace(/\bI'd a\b/gi, "I'd a,")  // short pause for rhythm
            .replace(/like\./gi, 'like...')     // trailing "like" pause
            .trim();

        const mp3 = await openai.audio.speech.create({
            model: 'tts-1',
            // "fable" has the warmest, most European/Irish English quality
            voice: accent === 'cork' ? 'shimmer' : accent === 'galway' ? 'onyx' : 'fable',
            input: processedText,
            speed: 0.88, // slightly slower — elderly / deliberate speech
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());

        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': buffer.length.toString(),
                'Cache-Control': 'no-store',
            },
        });
    } catch (err) {
        console.error('TTS error:', err);
        return NextResponse.json({ error: 'TTS failed' }, { status: 500 });
    }
}
