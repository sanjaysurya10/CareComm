// lib/scenarios.js — v2.1 (Advanced Difficulty)

// ─── COMPREHENSION SCENARIOS ────────────────────────────────────────────────
// These are played as audio via the TTS engine. Users must transcribe or
// summarise exactly what clinically relevant information was communicated.

export const COMPREHENSION_SCENARIOS = [
    {
        id: 'comp1',
        type: 'comprehension',
        accentNote: 'Elderly Dublin woman, 84, confused and distressed — rambling, rapid',
        audioText: "I'm after fallin' out of the bed last night, I think it was around half two or three in the mornin'. I didn't want to bother anyone, sure I managed to get back up meself, but me hip is somethin' woeful today. And I haven't gone to the toilet since yesterday morning either — I'm afraid to move off the chair in case I fall again.",
        task: 'List every clinical concern the patient has disclosed. Do not miss any.',
        keyWords: ['fall', 'hip pain', 'constipation', 'night', 'afraid to move', 'self-managed'],
        idealSummary: 'Patient had an unwitnessed fall at ~2:30am, did not report it, has hip pain, has not had a bowel movement since yesterday, and is now afraid to mobilise.',
    },
    {
        id: 'comp2',
        type: 'comprehension',
        accentNote: 'Rural Galway man, 78, strong accent, speaking fast and quietly',
        audioText: "The doctor was in earlier and he changed me tablets again — took me off the water tablet he said, and put me on something else. I can't remember the name of it. But I told him the last fella gave me tablets that made me chest tight and he said this one is different. I'm a bit worried like, because I haven't told the family yet either.",
        task: 'What medication change happened? What safety concern did the patient raise? What is the communication gap?',
        keyWords: ['medication change', 'diuretic stopped', 'chest tightness', 'allergy or ADR', 'family not informed'],
        idealSummary: 'Doctor changed the patient\'s diuretic to an unknown new medication. Patient has a history of chest tightness from previous medication (possible ADR). Family has not been informed of the change.',
    },
    {
        id: 'comp3',
        type: 'comprehension',
        accentNote: 'Cork woman, 91, very soft voice, pausing mid-sentence, hard to follow',
        audioText: "I had… the worst night ever, love. I was up three times… and every time I got up I was… very dizzy like. And honestly… I nearly went over the second time. I grabbed the locker… thank God. I did tell the night girl… Mary or whoever was on… but she just sort of nodded, I don't think she wrote it down at all. I'm still feeling it now.",
        task: 'Describe the clinical situation and the safeguarding/reporting concern raised.',
        keyWords: ['dizziness', 'up 3 times', 'near fall', 'fall risk', 'night staff not documenting', 'still symptomatic'],
        idealSummary: 'Patient had three nocturnal episodes of severe dizziness with one near-fall (saved by locker). Night staff were informed verbally but likely did not document. Patient is still symptomatic. This is a documentation failure and active fall risk.',
    },
    {
        id: 'comp4',
        type: 'comprehension',
        accentNote: 'Mayo man, 69, cognitively intact but clearly angry and speaking over you',
        audioText: "Look, I've said it twice now — I do NOT want the hoist. I've been using the hoist for six months and me back is in agony every single time. I've told the physio, I've told the nurse, nobody's doing anything. I want to walk to the chair myself — I can do it with one person. If ye put me in that hoist again today I'll be ringing me solicitor, I'm not joking ya.",
        task: 'What is the patient refusing and why? What is the legal/ethical concern? What should you do next?',
        keyWords: ['refusing hoist', 'back pain', 'previously reported', 'autonomy', 'capacity', 'escalate', 'physio review needed'],
        idealSummary: 'Patient is refusing hoist transfer citing back pain caused by it, which has been previously reported with no action. Patient has capacity and is invoking their right to refuse. Legal threat made. Requires immediate escalation to nurse and physiotherapist review — do not proceed with hoist without further assessment.',
    },
];

// ─── SIMULATION RESPONSE SCENARIOS ──────────────────────────────────────────
// These are used in the main /simulate flow (Phase 2). Users must type their
// exact spoken response to each patient. AI evaluates on 4 dimensions.

export const RESPONSE_SCENARIOS = [
    {
        id: 'resp1',
        type: 'response',
        category: 'Fall Risk — Escalation',
        setting: 'Nursing Home Room, 7:15am',
        difficulty: 'Hard',
        background: 'You are doing morning rounds. Mrs. Faherty, 83, is sitting on the edge of her bed without the cot sides up. You notice the call bell is on the floor. Her gait has been unsteady this week following a UTI. She looks pale and says:',
        patientSays: "I was just going to try and get to the bathroom myself — I didn't want to bother anyone sure, there were only two of ye on last night.",
        keyPoints: ['Stop her from standing alone', 'Stay with patient — do not leave', 'Acknowledge her consideration for staff', 'Explain fall risk without being dismissive', 'Call for nurse or assist her safely — document'],
    },
    {
        id: 'resp2',
        type: 'response',
        category: 'Dementia — Distress & Reality Orientation',
        setting: 'Day Room, 3:00pm',
        difficulty: 'Hard',
        background: 'Mr. Collins, 79, has moderate dementia. He has become increasingly distressed and is standing at the front door trying to leave. He believes he needs to pick up his children from school. His children are in their 50s. He is getting agitated when redirected. He turns to you and says:',
        patientSays: "Please, please, I have to go — they'll be waiting for me. Nobody is listening to me in here. Can YOU help me? Just open the door.",
        keyPoints: ['Do not bluntly correct the delusion', 'Acknowledge feeling, not content', 'Gently redirect using distraction or joining the narrative', 'Keep tone calm, do not use force or block', 'Alert nurse if risk of elopement escalates'],
    },
    {
        id: 'resp3',
        type: 'response',
        category: 'Medication Refusal — Capacity & Safety',
        setting: 'Medication Round, 9:00am',
        difficulty: 'Hard',
        background: 'Mrs. Joyce, 71, had a stroke 2 years ago. She is cognitively intact but low mood. This morning she is refusing her blood thinner (anticoagulant) for the third day in a row. She was hospitalised 8 months ago for a clot. The nurse is aware of the previous two refusals. She says:',
        patientSays: "I told ye yesterday and the day before — I'm not taking it. It bruises me terrible and I just don't want it anymore. Don't give me that look. I know my own body.",
        keyPoints: ['Respect autonomy — do not force', 'Acknowledge her concern about bruising as valid', 'Explain risk briefly without lecturing', 'Do NOT administer if refused', 'Inform nurse immediately — document the refusal with exact words', 'Escalate for nurse/GP review of capacity and care plan'],
    },
    {
        id: 'resp4',
        type: 'response',
        category: 'Nutritional Concern — Structured Reporting',
        setting: 'Lunch, Dining Room',
        difficulty: 'Medium',
        background: 'Mr. Brennan, 85, has had poor appetite for the last 4 days. Today at lunch he ate less than a quarter of his meal and refused dessert. He used to eat well. He also mentioned his dentures are uncomfortable. He is on a soft diet following a choking incident last month. You are giving handover to the oncoming nurse:',
        patientSays: '[NURSE] How has Mr. Brennan been this afternoon? Anything to flag?',
        keyPoints: ['Use SBAR format (Situation, Background, Assessment, Recommendation)', 'Mention food intake %, appetite trend, denture issue', 'Reference previous choking and diet type', 'Flag need for dietitian or GP review', 'Suggest denture check or dental referral'],
    },
    {
        id: 'resp5',
        type: 'response',
        category: 'Emotional Distress — End-of-Life Conversation',
        setting: 'Patient Bedroom, Evening',
        difficulty: 'Very Hard',
        background: 'Mrs. Ryan, 88, has a terminal diagnosis and is under palliative care. Her family visited today but there was visible tension — her daughter and son disagreed about resuscitation preferences in front of her. Mrs. Ryan is now alone and you notice she has been crying. She looks at you and says:',
        patientSays: "I heard them fighting. They were arguing about what to do with me… like I wasn't even in the room. I just want to go peacefully. Is that too much to ask?",
        keyPoints: ['Sit down — do not stand over her', 'Listen first, do not immediately problem-solve', 'Acknowledge what she said and validate her feelings', 'Do NOT promise anything about care decisions', 'Do NOT engage with family conflict or take sides', 'Let her speak — offer presence over advice', 'Alert nurse and document emotional state/family conflict', 'Ask if she would like the chaplain or social worker'],
    },
];
