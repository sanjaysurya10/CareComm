// lib/scoring.js

/**
 * v2 Scoring Model — 4 Categories:
 * 1. Accent Comprehension (from comprehension engine results)
 * 2. Patient Interaction (from response engine - relevance)
 * 3. Safety Communication (from response engine - safety)
 * 4. Reporting Clarity (from response engine - clarity)
 *
 * Weights: Accent 25%, Patient 30%, Safety 30%, Clarity 15%
 */

export function calculateReadinessScore(results) {
    if (!results || results.length === 0) {
        return {
            overall: 0,
            categoryScores: {
                'Accent Comprehension': 0,
                'Patient Interaction': 0,
                'Safety Communication': 0,
                'Reporting Clarity': 0,
            },
            label: '❌ Not Ready',
            labelShort: 'Not Ready',
        };
    }

    // Separate comprehension results from response results
    const comprehensionResults = results.filter(r => r.type === 'comprehension');
    const responseResults = results.filter(r => r.type === 'response');

    // Accent comprehension: average score out of 100
    let accentScore = 0;
    if (comprehensionResults.length > 0) {
        accentScore = Math.round(
            comprehensionResults.reduce((sum, r) => sum + (r.totalScore || 0), 0) / comprehensionResults.length
        );
    }

    // Response dimensions: average from response results (each score out of 25 → ×4 for 100-scale)
    let patientScore = 0;
    let safetyScore = 0;
    let clarityScore = 0;
    if (responseResults.length > 0) {
        patientScore = Math.round(
            responseResults.reduce((sum, r) => sum + ((r.scores?.relevance || 0) * 4), 0) / responseResults.length
        );
        safetyScore = Math.round(
            responseResults.reduce((sum, r) => sum + ((r.scores?.safety || 0) * 4), 0) / responseResults.length
        );
        clarityScore = Math.round(
            responseResults.reduce((sum, r) => sum + ((r.scores?.clarity || 0) * 4), 0) / responseResults.length
        );
    }

    // Fallback: if no comprehension data, use tone as comprehension proxy
    if (comprehensionResults.length === 0 && responseResults.length > 0) {
        accentScore = Math.round(
            responseResults.reduce((sum, r) => sum + ((r.scores?.tone || 0) * 4), 0) / responseResults.length
        );
    }

    const categoryScores = {
        'Accent Comprehension': accentScore,
        'Patient Interaction': patientScore,
        'Safety Communication': safetyScore,
        'Reporting Clarity': clarityScore,
    };

    const overall = Math.round(
        (accentScore * 0.25) +
        (patientScore * 0.30) +
        (safetyScore * 0.30) +
        (clarityScore * 0.15)
    );

    let label = '❌ Not Ready';
    let labelShort = 'Not Ready';
    if (overall >= 80) { label = '✅ Job-Ready'; labelShort = 'Job-Ready'; }
    else if (overall >= 65) { label = '⚠️ Supervised Ready'; labelShort = 'Supervised Ready'; }
    else if (overall >= 50) { label = '🔶 Monitored Support Needed'; labelShort = 'Monitored'; }

    return { overall, categoryScores, label, labelShort };
}
