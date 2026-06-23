# Dialogue Challenge Migration Suggestions

This report outlines suggestions for migrating existing `textChallenge` configurations into dialogue-first configurations (`DialogueResponseChallenge`).

## Campaign: Via Prima (via-prima)

### Quest: Prima Dies (quest_prima_dies)

#### Scene: [The First Answer](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.first_latin_question)
- **Scene ID**: `first_latin_question`
- **Old Prompt**: "Magister sana 'Salve' dedi. Ona Latince selam ver."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Magister sana 'Salve' dedi. Ona Latince selam ver.",
  "canonicalAnswers": [
    "Salve.",
    "Salve magister.",
    "Salve, magister."
  ],
  "acceptedVariants": [
    "Salve",
    "Salve magister"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Prologus: secunda (prologus_main_secunda)

#### Scene: [Prologus 004](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.prologus_004_reply)
- **Scene ID**: `prologus_004_reply`
- **Old Prompt**: "Latince yaz: Mihi nomen est."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Mihi nomen est.",
  "canonicalAnswers": [
    "Mihi nomen est.",
    "Mihi nomen est",
    "mihi nomen est."
  ],
  "acceptedVariants": [
    "Mihi nomen est",
    "mihi nomen est"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Prologus 006](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.prologus_006_path)
- **Scene ID**: `prologus_006_path`
- **Old Prompt**: "Latince yaz: Salve, magister."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "lucius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Salve, magister.",
  "canonicalAnswers": [
    "Salve, magister.",
    "Salve, magister",
    "salve, magister."
  ],
  "acceptedVariants": [
    "Salve magister",
    "salve magister"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Prologus: tertia (prologus_main_tertia)

#### Scene: [Prologus 008](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.prologus_008_practice)
- **Scene ID**: `prologus_008_practice`
- **Old Prompt**: "Latince yaz: Tu es Marcus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Tu es Marcus.",
  "canonicalAnswers": [
    "Tu es Marcus.",
    "Tu es Marcus",
    "tu es marcus."
  ],
  "acceptedVariants": [
    "Tu es Marcus",
    "tu es marcus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Prologus 009](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.prologus_009_voice)
- **Scene ID**: `prologus_009_voice`
- **Old Prompt**: "Latince yaz: Mihi nomen est."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "lucius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Mihi nomen est.",
  "canonicalAnswers": [
    "Mihi nomen est.",
    "Mihi nomen est",
    "mihi nomen est."
  ],
  "acceptedVariants": [
    "Mihi nomen est",
    "mihi nomen est"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Prologus: quarta (prologus_main_quarta)

#### Scene: [Prologus 010](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.prologus_010_reply)
- **Scene ID**: `prologus_010_reply`
- **Old Prompt**: "Latince yaz: Vale, amice."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Vale, amice.",
  "canonicalAnswers": [
    "Vale, amice.",
    "Vale, amice",
    "vale, amice."
  ],
  "acceptedVariants": [
    "Vale amice",
    "vale amice"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Prologus: auxilium (prologus_side_auxilium)

#### Scene: [Prologus 013](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.prologus_013_arrival)
- **Scene ID**: `prologus_013_arrival`
- **Old Prompt**: "Latince yaz: Tu es Marcus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Tu es Marcus.",
  "canonicalAnswers": [
    "Tu es Marcus.",
    "Tu es Marcus",
    "tu es marcus."
  ],
  "acceptedVariants": [
    "Tu es Marcus",
    "tu es marcus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Prologus 014](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.prologus_014_practice)
- **Scene ID**: `prologus_014_practice`
- **Old Prompt**: "Latince yaz: Mihi nomen est."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Mihi nomen est.",
  "canonicalAnswers": [
    "Mihi nomen est.",
    "Mihi nomen est",
    "mihi nomen est."
  ],
  "acceptedVariants": [
    "Mihi nomen est",
    "mihi nomen est"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Prologus: amicus (prologus_side_amicus)

#### Scene: [Prologus 015](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.prologus_015_voice)
- **Scene ID**: `prologus_015_voice`
- **Old Prompt**: "Latince yaz: Vale, amice."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "lucius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Vale, amice.",
  "canonicalAnswers": [
    "Vale, amice.",
    "Vale, amice",
    "vale, amice."
  ],
  "acceptedVariants": [
    "Vale amice",
    "vale amice"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Prologus: memoria (prologus_side_memoria)

#### Scene: [Prologus 019](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.prologus_019_arrival)
- **Scene ID**: `prologus_019_arrival`
- **Old Prompt**: "Latince yaz: Mihi nomen est."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Mihi nomen est.",
  "canonicalAnswers": [
    "Mihi nomen est.",
    "Mihi nomen est",
    "mihi nomen est."
  ],
  "acceptedVariants": [
    "Mihi nomen est",
    "mihi nomen est"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Ludus: prima (ludus_main_prima)

#### Scene: [Ludus 002](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_002_practice)
- **Scene ID**: `ludus_002_practice`
- **Old Prompt**: "Latince yaz: Puella est bona."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella est bona.",
  "canonicalAnswers": [
    "Puella est bona.",
    "Puella est bona",
    "puella est bona."
  ],
  "acceptedVariants": [
    "Puella est bona",
    "puella est bona"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Ludus 004](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_004_reply)
- **Scene ID**: `ludus_004_reply`
- **Old Prompt**: "Latince yaz: Ego sum discipulus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Ego sum discipulus.",
  "canonicalAnswers": [
    "Ego sum discipulus.",
    "Ego sum discipulus",
    "ego sum discipulus."
  ],
  "acceptedVariants": [
    "Ego sum discipulus",
    "ego sum discipulus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Ludus: secunda (ludus_main_secunda)

#### Scene: [Ludus 006](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_006_path)
- **Scene ID**: `ludus_006_path`
- **Old Prompt**: "Latince yaz: Puer est discipulus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puer est discipulus.",
  "canonicalAnswers": [
    "Puer est discipulus.",
    "Puer est discipulus",
    "puer est discipulus."
  ],
  "acceptedVariants": [
    "Puer est discipulus",
    "puer est discipulus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Ludus 007](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_007_arrival)
- **Scene ID**: `ludus_007_arrival`
- **Old Prompt**: "Latince yaz: Puella est bona."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella est bona.",
  "canonicalAnswers": [
    "Puella est bona.",
    "Puella est bona",
    "puella est bona."
  ],
  "acceptedVariants": [
    "Puella est bona",
    "puella est bona"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Ludus 008](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_008_practice)
- **Scene ID**: `ludus_008_practice`
- **Old Prompt**: "Latince yaz: Liber est novus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Liber est novus.",
  "canonicalAnswers": [
    "Liber est novus.",
    "Liber est novus",
    "liber est novus."
  ],
  "acceptedVariants": [
    "Liber est novus",
    "liber est novus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Ludus: tertia (ludus_main_tertia)

#### Scene: [Ludus 010](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_010_reply)
- **Scene ID**: `ludus_010_reply`
- **Old Prompt**: "Latince yaz: Tu es magister."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Tu es magister.",
  "canonicalAnswers": [
    "Tu es magister.",
    "Tu es magister",
    "tu es magister."
  ],
  "acceptedVariants": [
    "Tu es magister",
    "tu es magister"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Ludus 012](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_012_path)
- **Scene ID**: `ludus_012_path`
- **Old Prompt**: "Latince yaz: Puella est bona."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella est bona.",
  "canonicalAnswers": [
    "Puella est bona.",
    "Puella est bona",
    "puella est bona."
  ],
  "acceptedVariants": [
    "Puella est bona",
    "puella est bona"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Ludus: quarta (ludus_main_quarta)

#### Scene: [Ludus 014](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_014_practice)
- **Scene ID**: `ludus_014_practice`
- **Old Prompt**: "Latince yaz: Ego sum discipulus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Ego sum discipulus.",
  "canonicalAnswers": [
    "Ego sum discipulus.",
    "Ego sum discipulus",
    "ego sum discipulus."
  ],
  "acceptedVariants": [
    "Ego sum discipulus",
    "ego sum discipulus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Ludus 016](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_016_reply)
- **Scene ID**: `ludus_016_reply`
- **Old Prompt**: "Latince yaz: Puer est discipulus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puer est discipulus.",
  "canonicalAnswers": [
    "Puer est discipulus.",
    "Puer est discipulus",
    "puer est discipulus."
  ],
  "acceptedVariants": [
    "Puer est discipulus",
    "puer est discipulus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Ludus: auxilium (ludus_side_auxilium)

#### Scene: [Ludus 017](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_017_review)
- **Scene ID**: `ludus_017_review`
- **Old Prompt**: "Latince yaz: Puella est bona."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella est bona.",
  "canonicalAnswers": [
    "Puella est bona.",
    "Puella est bona",
    "puella est bona."
  ],
  "acceptedVariants": [
    "Puella est bona",
    "puella est bona"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Ludus 018](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_018_path)
- **Scene ID**: `ludus_018_path`
- **Old Prompt**: "Latince yaz: Liber est novus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Liber est novus.",
  "canonicalAnswers": [
    "Liber est novus.",
    "Liber est novus",
    "liber est novus."
  ],
  "acceptedVariants": [
    "Liber est novus",
    "liber est novus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Ludus: amicus (ludus_side_amicus)

#### Scene: [Ludus 020](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_020_practice)
- **Scene ID**: `ludus_020_practice`
- **Old Prompt**: "Latince yaz: Tu es magister."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Tu es magister.",
  "canonicalAnswers": [
    "Tu es magister.",
    "Tu es magister",
    "tu es magister."
  ],
  "acceptedVariants": [
    "Tu es magister",
    "tu es magister"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Ludus: nota (ludus_side_nota)

#### Scene: [Ludus 022](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_022_reply)
- **Scene ID**: `ludus_022_reply`
- **Old Prompt**: "Latince yaz: Puella est bona."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella est bona.",
  "canonicalAnswers": [
    "Puella est bona.",
    "Puella est bona",
    "puella est bona."
  ],
  "acceptedVariants": [
    "Puella est bona",
    "puella est bona"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Ludus: memoria (ludus_side_memoria)

#### Scene: [Ludus 024](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.ludus_024_path)
- **Scene ID**: `ludus_024_path`
- **Old Prompt**: "Latince yaz: Ego sum discipulus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Ego sum discipulus.",
  "canonicalAnswers": [
    "Ego sum discipulus.",
    "Ego sum discipulus",
    "ego sum discipulus."
  ],
  "acceptedVariants": [
    "Ego sum discipulus",
    "ego sum discipulus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Domus: prima (domus_main_prima)

#### Scene: [Domus 002](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_002_practice)
- **Scene ID**: `domus_002_practice`
- **Old Prompt**: "Latince yaz: Pater est magnus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Pater est magnus.",
  "canonicalAnswers": [
    "Pater est magnus.",
    "Pater est magnus",
    "pater est magnus."
  ],
  "acceptedVariants": [
    "Pater est magnus",
    "pater est magnus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Domus 004](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_004_reply)
- **Scene ID**: `domus_004_reply`
- **Old Prompt**: "Latince yaz: Servus est in domo."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Servus est in domo.",
  "canonicalAnswers": [
    "Servus est in domo.",
    "Servus est in domo",
    "servus est in domo."
  ],
  "acceptedVariants": [
    "Servus est in domo",
    "servus est in domo"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Domus: secunda (domus_main_secunda)

#### Scene: [Domus 006](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_006_path)
- **Scene ID**: `domus_006_path`
- **Old Prompt**: "Latince yaz: Mater est bona."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Mater est bona.",
  "canonicalAnswers": [
    "Mater est bona.",
    "Mater est bona",
    "mater est bona."
  ],
  "acceptedVariants": [
    "Mater est bona",
    "mater est bona"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Domus 007](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_007_arrival)
- **Scene ID**: `domus_007_arrival`
- **Old Prompt**: "Latince yaz: Pater est magnus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "cornelia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Pater est magnus.",
  "canonicalAnswers": [
    "Pater est magnus.",
    "Pater est magnus",
    "pater est magnus."
  ],
  "acceptedVariants": [
    "Pater est magnus",
    "pater est magnus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Domus 008](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_008_practice)
- **Scene ID**: `domus_008_practice`
- **Old Prompt**: "Latince yaz: Filia est parva."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Filia est parva.",
  "canonicalAnswers": [
    "Filia est parva.",
    "Filia est parva",
    "filia est parva."
  ],
  "acceptedVariants": [
    "Filia est parva",
    "filia est parva"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Domus: tertia (domus_main_tertia)

#### Scene: [Domus 010](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_010_reply)
- **Scene ID**: `domus_010_reply`
- **Old Prompt**: "Latince yaz: Familia est magna."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Familia est magna.",
  "canonicalAnswers": [
    "Familia est magna.",
    "Familia est magna",
    "familia est magna."
  ],
  "acceptedVariants": [
    "Familia est magna",
    "familia est magna"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Domus 012](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_012_path)
- **Scene ID**: `domus_012_path`
- **Old Prompt**: "Latince yaz: Pater est magnus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Pater est magnus.",
  "canonicalAnswers": [
    "Pater est magnus.",
    "Pater est magnus",
    "pater est magnus."
  ],
  "acceptedVariants": [
    "Pater est magnus",
    "pater est magnus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Domus: quarta (domus_main_quarta)

#### Scene: [Domus 014](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_014_practice)
- **Scene ID**: `domus_014_practice`
- **Old Prompt**: "Latince yaz: Servus est in domo."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Servus est in domo.",
  "canonicalAnswers": [
    "Servus est in domo.",
    "Servus est in domo",
    "servus est in domo."
  ],
  "acceptedVariants": [
    "Servus est in domo",
    "servus est in domo"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Domus 016](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_016_reply)
- **Scene ID**: `domus_016_reply`
- **Old Prompt**: "Latince yaz: Mater est bona."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Mater est bona.",
  "canonicalAnswers": [
    "Mater est bona.",
    "Mater est bona",
    "mater est bona."
  ],
  "acceptedVariants": [
    "Mater est bona",
    "mater est bona"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Domus: auxilium (domus_side_auxilium)

#### Scene: [Domus 017](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_017_review)
- **Scene ID**: `domus_017_review`
- **Old Prompt**: "Latince yaz: Pater est magnus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "cornelia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Pater est magnus.",
  "canonicalAnswers": [
    "Pater est magnus.",
    "Pater est magnus",
    "pater est magnus."
  ],
  "acceptedVariants": [
    "Pater est magnus",
    "pater est magnus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Domus 018](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_018_path)
- **Scene ID**: `domus_018_path`
- **Old Prompt**: "Latince yaz: Filia est parva."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Filia est parva.",
  "canonicalAnswers": [
    "Filia est parva.",
    "Filia est parva",
    "filia est parva."
  ],
  "acceptedVariants": [
    "Filia est parva",
    "filia est parva"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Domus: amicus (domus_side_amicus)

#### Scene: [Domus 020](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_020_practice)
- **Scene ID**: `domus_020_practice`
- **Old Prompt**: "Latince yaz: Familia est magna."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Familia est magna.",
  "canonicalAnswers": [
    "Familia est magna.",
    "Familia est magna",
    "familia est magna."
  ],
  "acceptedVariants": [
    "Familia est magna",
    "familia est magna"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Domus: nota (domus_side_nota)

#### Scene: [Domus 022](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_022_reply)
- **Scene ID**: `domus_022_reply`
- **Old Prompt**: "Latince yaz: Pater est magnus."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Pater est magnus.",
  "canonicalAnswers": [
    "Pater est magnus.",
    "Pater est magnus",
    "pater est magnus."
  ],
  "acceptedVariants": [
    "Pater est magnus",
    "pater est magnus"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Domus: memoria (domus_side_memoria)

#### Scene: [Domus 024](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.domus_024_path)
- **Scene ID**: `domus_024_path`
- **Old Prompt**: "Latince yaz: Servus est in domo."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Servus est in domo.",
  "canonicalAnswers": [
    "Servus est in domo.",
    "Servus est in domo",
    "servus est in domo."
  ],
  "acceptedVariants": [
    "Servus est in domo",
    "servus est in domo"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Forum: prima (forum_main_prima)

#### Scene: [Forum 002](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_002_practice)
- **Scene ID**: `forum_002_practice`
- **Old Prompt**: "Latince yaz: Puella panem portat."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella panem portat.",
  "canonicalAnswers": [
    "Puella panem portat.",
    "Puella panem portat",
    "puella panem portat."
  ],
  "acceptedVariants": [
    "Puella panem portat",
    "puella panem portat"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Forum 004](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_004_reply)
- **Scene ID**: `forum_004_reply`
- **Old Prompt**: "Latince yaz: Mercator pecuniam quaerit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "mercator",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Mercator pecuniam quaerit.",
  "canonicalAnswers": [
    "Mercator pecuniam quaerit.",
    "Mercator pecuniam quaerit",
    "mercator pecuniam quaerit."
  ],
  "acceptedVariants": [
    "Mercator pecuniam quaerit",
    "mercator pecuniam quaerit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Forum: secunda (forum_main_secunda)

#### Scene: [Forum 006](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_006_path)
- **Scene ID**: `forum_006_path`
- **Old Prompt**: "Latince yaz: Puer librum videt."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "lydia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puer librum videt.",
  "canonicalAnswers": [
    "Puer librum videt.",
    "Puer librum videt",
    "puer librum videt."
  ],
  "acceptedVariants": [
    "Puer librum videt",
    "puer librum videt"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Forum 007](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_007_arrival)
- **Scene ID**: `forum_007_arrival`
- **Old Prompt**: "Latince yaz: Puella panem portat."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "mercator",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella panem portat.",
  "canonicalAnswers": [
    "Puella panem portat.",
    "Puella panem portat",
    "puella panem portat."
  ],
  "acceptedVariants": [
    "Puella panem portat",
    "puella panem portat"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Forum 008](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_008_practice)
- **Scene ID**: `forum_008_practice`
- **Old Prompt**: "Latince yaz: Marcus tabulam habet."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus tabulam habet.",
  "canonicalAnswers": [
    "Marcus tabulam habet.",
    "Marcus tabulam habet",
    "marcus tabulam habet."
  ],
  "acceptedVariants": [
    "Marcus tabulam habet",
    "marcus tabulam habet"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Forum 010](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_010_reply)
- **Scene ID**: `forum_010_reply`
- **Old Prompt**: "Latince yaz: Non vinum emo."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "mercator",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Non vinum emo.",
  "canonicalAnswers": [
    "Non vinum emo.",
    "Non vinum emo",
    "non vinum emo."
  ],
  "acceptedVariants": [
    "Non vinum emo",
    "non vinum emo"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Forum: tertia (forum_main_tertia)

#### Scene: [Forum 012](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_012_path)
- **Scene ID**: `forum_012_path`
- **Old Prompt**: "Latince yaz: Puella panem portat."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "lydia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella panem portat.",
  "canonicalAnswers": [
    "Puella panem portat.",
    "Puella panem portat",
    "puella panem portat."
  ],
  "acceptedVariants": [
    "Puella panem portat",
    "puella panem portat"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Forum 014](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_014_practice)
- **Scene ID**: `forum_014_practice`
- **Old Prompt**: "Latince yaz: Mercator pecuniam quaerit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Mercator pecuniam quaerit.",
  "canonicalAnswers": [
    "Mercator pecuniam quaerit.",
    "Mercator pecuniam quaerit",
    "mercator pecuniam quaerit."
  ],
  "acceptedVariants": [
    "Mercator pecuniam quaerit",
    "mercator pecuniam quaerit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Forum: quarta (forum_main_quarta)

#### Scene: [Forum 016](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_016_reply)
- **Scene ID**: `forum_016_reply`
- **Old Prompt**: "Latince yaz: Puer librum videt."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "mercator",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puer librum videt.",
  "canonicalAnswers": [
    "Puer librum videt.",
    "Puer librum videt",
    "puer librum videt."
  ],
  "acceptedVariants": [
    "Puer librum videt",
    "puer librum videt"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Forum 017](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_017_review)
- **Scene ID**: `forum_017_review`
- **Old Prompt**: "Latince yaz: Puella panem portat."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella panem portat.",
  "canonicalAnswers": [
    "Puella panem portat.",
    "Puella panem portat",
    "puella panem portat."
  ],
  "acceptedVariants": [
    "Puella panem portat",
    "puella panem portat"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Forum 018](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_018_path)
- **Scene ID**: `forum_018_path`
- **Old Prompt**: "Latince yaz: Marcus tabulam habet."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "lydia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus tabulam habet.",
  "canonicalAnswers": [
    "Marcus tabulam habet.",
    "Marcus tabulam habet",
    "marcus tabulam habet."
  ],
  "acceptedVariants": [
    "Marcus tabulam habet",
    "marcus tabulam habet"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Forum: auxilium (forum_side_auxilium)

#### Scene: [Forum 020](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_020_practice)
- **Scene ID**: `forum_020_practice`
- **Old Prompt**: "Latince yaz: Non vinum emo."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Non vinum emo.",
  "canonicalAnswers": [
    "Non vinum emo.",
    "Non vinum emo",
    "non vinum emo."
  ],
  "acceptedVariants": [
    "Non vinum emo",
    "non vinum emo"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Forum 022](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_022_reply)
- **Scene ID**: `forum_022_reply`
- **Old Prompt**: "Latince yaz: Puella panem portat."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "mercator",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella panem portat.",
  "canonicalAnswers": [
    "Puella panem portat.",
    "Puella panem portat",
    "puella panem portat."
  ],
  "acceptedVariants": [
    "Puella panem portat",
    "puella panem portat"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Forum: amicus (forum_side_amicus)

#### Scene: [Forum 024](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_024_path)
- **Scene ID**: `forum_024_path`
- **Old Prompt**: "Latince yaz: Mercator pecuniam quaerit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "lydia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Mercator pecuniam quaerit.",
  "canonicalAnswers": [
    "Mercator pecuniam quaerit.",
    "Mercator pecuniam quaerit",
    "mercator pecuniam quaerit."
  ],
  "acceptedVariants": [
    "Mercator pecuniam quaerit",
    "mercator pecuniam quaerit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Forum: nota (forum_side_nota)

#### Scene: [Forum 026](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_026_practice)
- **Scene ID**: `forum_026_practice`
- **Old Prompt**: "Latince yaz: Puer librum videt."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puer librum videt.",
  "canonicalAnswers": [
    "Puer librum videt.",
    "Puer librum videt",
    "puer librum videt."
  ],
  "acceptedVariants": [
    "Puer librum videt",
    "puer librum videt"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Forum: brevis (forum_side_brevis)

#### Scene: [Forum 027](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_027_voice)
- **Scene ID**: `forum_027_voice`
- **Old Prompt**: "Latince yaz: Puella panem portat."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "lydia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella panem portat.",
  "canonicalAnswers": [
    "Puella panem portat.",
    "Puella panem portat",
    "puella panem portat."
  ],
  "acceptedVariants": [
    "Puella panem portat",
    "puella panem portat"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Forum 028](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_028_reply)
- **Scene ID**: `forum_028_reply`
- **Old Prompt**: "Latince yaz: Marcus tabulam habet."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "mercator",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus tabulam habet.",
  "canonicalAnswers": [
    "Marcus tabulam habet.",
    "Marcus tabulam habet",
    "marcus tabulam habet."
  ],
  "acceptedVariants": [
    "Marcus tabulam habet",
    "marcus tabulam habet"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Forum: recapitulatio (forum_review_recapitulatio)

#### Scene: [Forum 030](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.forum_030_path)
- **Scene ID**: `forum_030_path`
- **Old Prompt**: "Latince yaz: Non vinum emo."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "lydia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Non vinum emo.",
  "canonicalAnswers": [
    "Non vinum emo.",
    "Non vinum emo",
    "non vinum emo."
  ],
  "acceptedVariants": [
    "Non vinum emo",
    "non vinum emo"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Bibliotheca: prima (bibliotheca_main_prima)

#### Scene: [Bibliotheca 002](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_002_practice)
- **Scene ID**: `bibliotheca_002_practice`
- **Old Prompt**: "Latince yaz: Puella tabulam scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella tabulam scribit.",
  "canonicalAnswers": [
    "Puella tabulam scribit.",
    "Puella tabulam scribit",
    "puella tabulam scribit."
  ],
  "acceptedVariants": [
    "Puella tabulam scribit",
    "puella tabulam scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Bibliotheca 004](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_004_reply)
- **Scene ID**: `bibliotheca_004_reply`
- **Old Prompt**: "Latince yaz: Marcus legit et Julia scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "scriba",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus legit et Julia scribit.",
  "canonicalAnswers": [
    "Marcus legit et Julia scribit.",
    "Marcus legit et Julia scribit",
    "marcus legit et julia scribit."
  ],
  "acceptedVariants": [
    "Marcus legit et Julia scribit",
    "marcus legit et julia scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Bibliotheca: secunda (bibliotheca_main_secunda)

#### Scene: [Bibliotheca 006](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_006_path)
- **Scene ID**: `bibliotheca_006_path`
- **Old Prompt**: "Latince yaz: Puer librum legit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puer librum legit.",
  "canonicalAnswers": [
    "Puer librum legit.",
    "Puer librum legit",
    "puer librum legit."
  ],
  "acceptedVariants": [
    "Puer librum legit",
    "puer librum legit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Bibliotheca 007](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_007_arrival)
- **Scene ID**: `bibliotheca_007_arrival`
- **Old Prompt**: "Latince yaz: Puella tabulam scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "scriba",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella tabulam scribit.",
  "canonicalAnswers": [
    "Puella tabulam scribit.",
    "Puella tabulam scribit",
    "puella tabulam scribit."
  ],
  "acceptedVariants": [
    "Puella tabulam scribit",
    "puella tabulam scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Bibliotheca 008](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_008_practice)
- **Scene ID**: `bibliotheca_008_practice`
- **Old Prompt**: "Latince yaz: Magister discipulos docet."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Magister discipulos docet.",
  "canonicalAnswers": [
    "Magister discipulos docet.",
    "Magister discipulos docet",
    "magister discipulos docet."
  ],
  "acceptedVariants": [
    "Magister discipulos docet",
    "magister discipulos docet"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Bibliotheca: tertia (bibliotheca_main_tertia)

#### Scene: [Bibliotheca 010](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_010_reply)
- **Scene ID**: `bibliotheca_010_reply`
- **Old Prompt**: "Latince yaz: Scriba bene scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "scriba",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Scriba bene scribit.",
  "canonicalAnswers": [
    "Scriba bene scribit.",
    "Scriba bene scribit",
    "scriba bene scribit."
  ],
  "acceptedVariants": [
    "Scriba bene scribit",
    "scriba bene scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Bibliotheca 012](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_012_path)
- **Scene ID**: `bibliotheca_012_path`
- **Old Prompt**: "Latince yaz: Puella tabulam scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella tabulam scribit.",
  "canonicalAnswers": [
    "Puella tabulam scribit.",
    "Puella tabulam scribit",
    "puella tabulam scribit."
  ],
  "acceptedVariants": [
    "Puella tabulam scribit",
    "puella tabulam scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Bibliotheca: quarta (bibliotheca_main_quarta)

#### Scene: [Bibliotheca 014](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_014_practice)
- **Scene ID**: `bibliotheca_014_practice`
- **Old Prompt**: "Latince yaz: Marcus legit et Julia scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus legit et Julia scribit.",
  "canonicalAnswers": [
    "Marcus legit et Julia scribit.",
    "Marcus legit et Julia scribit",
    "marcus legit et julia scribit."
  ],
  "acceptedVariants": [
    "Marcus legit et Julia scribit",
    "marcus legit et julia scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Bibliotheca 016](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_016_reply)
- **Scene ID**: `bibliotheca_016_reply`
- **Old Prompt**: "Latince yaz: Puer librum legit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "scriba",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puer librum legit.",
  "canonicalAnswers": [
    "Puer librum legit.",
    "Puer librum legit",
    "puer librum legit."
  ],
  "acceptedVariants": [
    "Puer librum legit",
    "puer librum legit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Bibliotheca: auxilium (bibliotheca_side_auxilium)

#### Scene: [Bibliotheca 017](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_017_review)
- **Scene ID**: `bibliotheca_017_review`
- **Old Prompt**: "Latince yaz: Puella tabulam scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella tabulam scribit.",
  "canonicalAnswers": [
    "Puella tabulam scribit.",
    "Puella tabulam scribit",
    "puella tabulam scribit."
  ],
  "acceptedVariants": [
    "Puella tabulam scribit",
    "puella tabulam scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Bibliotheca 018](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_018_path)
- **Scene ID**: `bibliotheca_018_path`
- **Old Prompt**: "Latince yaz: Magister discipulos docet."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Magister discipulos docet.",
  "canonicalAnswers": [
    "Magister discipulos docet.",
    "Magister discipulos docet",
    "magister discipulos docet."
  ],
  "acceptedVariants": [
    "Magister discipulos docet",
    "magister discipulos docet"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Bibliotheca: amicus (bibliotheca_side_amicus)

#### Scene: [Bibliotheca 020](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_020_practice)
- **Scene ID**: `bibliotheca_020_practice`
- **Old Prompt**: "Latince yaz: Scriba bene scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Scriba bene scribit.",
  "canonicalAnswers": [
    "Scriba bene scribit.",
    "Scriba bene scribit",
    "scriba bene scribit."
  ],
  "acceptedVariants": [
    "Scriba bene scribit",
    "scriba bene scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Bibliotheca: nota (bibliotheca_side_nota)

#### Scene: [Bibliotheca 022](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_022_reply)
- **Scene ID**: `bibliotheca_022_reply`
- **Old Prompt**: "Latince yaz: Puella tabulam scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "scriba",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella tabulam scribit.",
  "canonicalAnswers": [
    "Puella tabulam scribit.",
    "Puella tabulam scribit",
    "puella tabulam scribit."
  ],
  "acceptedVariants": [
    "Puella tabulam scribit",
    "puella tabulam scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Bibliotheca: memoria (bibliotheca_side_memoria)

#### Scene: [Bibliotheca 024](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.bibliotheca_024_path)
- **Scene ID**: `bibliotheca_024_path`
- **Old Prompt**: "Latince yaz: Marcus legit et Julia scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus legit et Julia scribit.",
  "canonicalAnswers": [
    "Marcus legit et Julia scribit.",
    "Marcus legit et Julia scribit",
    "marcus legit et julia scribit."
  ],
  "acceptedVariants": [
    "Marcus legit et Julia scribit",
    "marcus legit et julia scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Castra: prima (castra_main_prima)

#### Scene: [Castra 002](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_002_practice)
- **Scene ID**: `castra_002_practice`
- **Old Prompt**: "Latince yaz: Audi, Marce!"
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Audi, Marce.",
  "canonicalAnswers": [
    "Audi, Marce!",
    "Audi, Marce",
    "audi, marce!"
  ],
  "acceptedVariants": [
    "Audi Marce",
    "audi marce"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Castra 004](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_004_reply)
- **Scene ID**: `castra_004_reply`
- **Old Prompt**: "Latince yaz: Ducite puerum."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "miles",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Ducite puerum.",
  "canonicalAnswers": [
    "Ducite puerum.",
    "Ducite puerum",
    "ducite puerum."
  ],
  "acceptedVariants": [
    "Ducite puerum",
    "ducite puerum"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Castra: secunda (castra_main_secunda)

#### Scene: [Castra 006](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_006_path)
- **Scene ID**: `castra_006_path`
- **Old Prompt**: "Latince yaz: Veni!"
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Veni.",
  "canonicalAnswers": [
    "Veni!",
    "Veni",
    "veni!"
  ],
  "acceptedVariants": [
    "Veni",
    "veni"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Castra 007](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_007_arrival)
- **Scene ID**: `castra_007_arrival`
- **Old Prompt**: "Latince yaz: Audi, Marce!"
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "miles",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Audi, Marce.",
  "canonicalAnswers": [
    "Audi, Marce!",
    "Audi, Marce",
    "audi, marce!"
  ],
  "acceptedVariants": [
    "Audi Marce",
    "audi marce"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Castra 008](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_008_practice)
- **Scene ID**: `castra_008_practice`
- **Old Prompt**: "Latince yaz: Porta scutum."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Porta scutum.",
  "canonicalAnswers": [
    "Porta scutum.",
    "Porta scutum",
    "porta scutum."
  ],
  "acceptedVariants": [
    "Porta scutum",
    "porta scutum"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Castra: tertia (castra_main_tertia)

#### Scene: [Castra 010](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_010_reply)
- **Scene ID**: `castra_010_reply`
- **Old Prompt**: "Latince yaz: State ad portam."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "miles",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "State ad portam.",
  "canonicalAnswers": [
    "State ad portam.",
    "State ad portam",
    "state ad portam."
  ],
  "acceptedVariants": [
    "State ad portam",
    "state ad portam"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Castra 012](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_012_path)
- **Scene ID**: `castra_012_path`
- **Old Prompt**: "Latince yaz: Audi, Marce!"
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Audi, Marce.",
  "canonicalAnswers": [
    "Audi, Marce!",
    "Audi, Marce",
    "audi, marce!"
  ],
  "acceptedVariants": [
    "Audi Marce",
    "audi marce"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Castra: quarta (castra_main_quarta)

#### Scene: [Castra 014](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_014_practice)
- **Scene ID**: `castra_014_practice`
- **Old Prompt**: "Latince yaz: Ducite puerum."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Ducite puerum.",
  "canonicalAnswers": [
    "Ducite puerum.",
    "Ducite puerum",
    "ducite puerum."
  ],
  "acceptedVariants": [
    "Ducite puerum",
    "ducite puerum"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Castra 016](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_016_reply)
- **Scene ID**: `castra_016_reply`
- **Old Prompt**: "Latince yaz: Veni!"
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "miles",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Veni.",
  "canonicalAnswers": [
    "Veni!",
    "Veni",
    "veni!"
  ],
  "acceptedVariants": [
    "Veni",
    "veni"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Castra: auxilium (castra_side_auxilium)

#### Scene: [Castra 017](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_017_review)
- **Scene ID**: `castra_017_review`
- **Old Prompt**: "Latince yaz: Audi, Marce!"
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Audi, Marce.",
  "canonicalAnswers": [
    "Audi, Marce!",
    "Audi, Marce",
    "audi, marce!"
  ],
  "acceptedVariants": [
    "Audi Marce",
    "audi marce"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Castra 018](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_018_path)
- **Scene ID**: `castra_018_path`
- **Old Prompt**: "Latince yaz: Porta scutum."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Porta scutum.",
  "canonicalAnswers": [
    "Porta scutum.",
    "Porta scutum",
    "porta scutum."
  ],
  "acceptedVariants": [
    "Porta scutum",
    "porta scutum"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Castra: amicus (castra_side_amicus)

#### Scene: [Castra 020](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_020_practice)
- **Scene ID**: `castra_020_practice`
- **Old Prompt**: "Latince yaz: State ad portam."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "State ad portam.",
  "canonicalAnswers": [
    "State ad portam.",
    "State ad portam",
    "state ad portam."
  ],
  "acceptedVariants": [
    "State ad portam",
    "state ad portam"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Castra: nota (castra_side_nota)

#### Scene: [Castra 022](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_022_reply)
- **Scene ID**: `castra_022_reply`
- **Old Prompt**: "Latince yaz: Audi, Marce!"
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "miles",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Audi, Marce.",
  "canonicalAnswers": [
    "Audi, Marce!",
    "Audi, Marce",
    "audi, marce!"
  ],
  "acceptedVariants": [
    "Audi Marce",
    "audi marce"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Castra: memoria (castra_side_memoria)

#### Scene: [Castra 024](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.castra_024_path)
- **Scene ID**: `castra_024_path`
- **Old Prompt**: "Latince yaz: Ducite puerum."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Ducite puerum.",
  "canonicalAnswers": [
    "Ducite puerum.",
    "Ducite puerum",
    "ducite puerum."
  ],
  "acceptedVariants": [
    "Ducite puerum",
    "ducite puerum"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Via Appia: prima (via-appia_main_prima)

#### Scene: [Via Appia 002](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_002_practice)
- **Scene ID**: `via-appia_002_practice`
- **Old Prompt**: "Latince yaz: Puella in villa est."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella in villa est.",
  "canonicalAnswers": [
    "Puella in villa est.",
    "Puella in villa est",
    "puella in villa est."
  ],
  "acceptedVariants": [
    "Puella in villa est",
    "puella in villa est"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Via Appia 004](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_004_reply)
- **Scene ID**: `via-appia_004_reply`
- **Old Prompt**: "Latince yaz: Servus sine gladio venit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Servus sine gladio venit.",
  "canonicalAnswers": [
    "Servus sine gladio venit.",
    "Servus sine gladio venit",
    "servus sine gladio venit."
  ],
  "acceptedVariants": [
    "Servus sine gladio venit",
    "servus sine gladio venit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Via Appia: secunda (via-appia_main_secunda)

#### Scene: [Via Appia 006](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_006_path)
- **Scene ID**: `via-appia_006_path`
- **Old Prompt**: "Latince yaz: Marcus ad portam venit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus ad portam venit.",
  "canonicalAnswers": [
    "Marcus ad portam venit.",
    "Marcus ad portam venit",
    "marcus ad portam venit."
  ],
  "acceptedVariants": [
    "Marcus ad portam venit",
    "marcus ad portam venit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Via Appia 007](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_007_arrival)
- **Scene ID**: `via-appia_007_arrival`
- **Old Prompt**: "Latince yaz: Puella in villa est."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "lydia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella in villa est.",
  "canonicalAnswers": [
    "Puella in villa est.",
    "Puella in villa est",
    "puella in villa est."
  ],
  "acceptedVariants": [
    "Puella in villa est",
    "puella in villa est"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Via Appia 008](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_008_practice)
- **Scene ID**: `via-appia_008_practice`
- **Old Prompt**: "Latince yaz: Puer cum Marco ambulat."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puer cum Marco ambulat.",
  "canonicalAnswers": [
    "Puer cum Marco ambulat.",
    "Puer cum Marco ambulat",
    "puer cum marco ambulat."
  ],
  "acceptedVariants": [
    "Puer cum Marco ambulat",
    "puer cum marco ambulat"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Via Appia: tertia (via-appia_main_tertia)

#### Scene: [Via Appia 010](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_010_reply)
- **Scene ID**: `via-appia_010_reply`
- **Old Prompt**: "Latince yaz: Viator tabernam intrat."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Viator tabernam intrat.",
  "canonicalAnswers": [
    "Viator tabernam intrat.",
    "Viator tabernam intrat",
    "viator tabernam intrat."
  ],
  "acceptedVariants": [
    "Viator tabernam intrat",
    "viator tabernam intrat"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Via Appia 012](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_012_path)
- **Scene ID**: `via-appia_012_path`
- **Old Prompt**: "Latince yaz: Puella in villa est."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella in villa est.",
  "canonicalAnswers": [
    "Puella in villa est.",
    "Puella in villa est",
    "puella in villa est."
  ],
  "acceptedVariants": [
    "Puella in villa est",
    "puella in villa est"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Via Appia: quarta (via-appia_main_quarta)

#### Scene: [Via Appia 014](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_014_practice)
- **Scene ID**: `via-appia_014_practice`
- **Old Prompt**: "Latince yaz: Servus sine gladio venit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Servus sine gladio venit.",
  "canonicalAnswers": [
    "Servus sine gladio venit.",
    "Servus sine gladio venit",
    "servus sine gladio venit."
  ],
  "acceptedVariants": [
    "Servus sine gladio venit",
    "servus sine gladio venit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Via Appia 016](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_016_reply)
- **Scene ID**: `via-appia_016_reply`
- **Old Prompt**: "Latince yaz: Marcus ad portam venit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus ad portam venit.",
  "canonicalAnswers": [
    "Marcus ad portam venit.",
    "Marcus ad portam venit",
    "marcus ad portam venit."
  ],
  "acceptedVariants": [
    "Marcus ad portam venit",
    "marcus ad portam venit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Via Appia: auxilium (via-appia_side_auxilium)

#### Scene: [Via Appia 017](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_017_review)
- **Scene ID**: `via-appia_017_review`
- **Old Prompt**: "Latince yaz: Puella in villa est."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "lydia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella in villa est.",
  "canonicalAnswers": [
    "Puella in villa est.",
    "Puella in villa est",
    "puella in villa est."
  ],
  "acceptedVariants": [
    "Puella in villa est",
    "puella in villa est"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Via Appia 018](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_018_path)
- **Scene ID**: `via-appia_018_path`
- **Old Prompt**: "Latince yaz: Puer cum Marco ambulat."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puer cum Marco ambulat.",
  "canonicalAnswers": [
    "Puer cum Marco ambulat.",
    "Puer cum Marco ambulat",
    "puer cum marco ambulat."
  ],
  "acceptedVariants": [
    "Puer cum Marco ambulat",
    "puer cum marco ambulat"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Via Appia: amicus (via-appia_side_amicus)

#### Scene: [Via Appia 020](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_020_practice)
- **Scene ID**: `via-appia_020_practice`
- **Old Prompt**: "Latince yaz: Viator tabernam intrat."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Viator tabernam intrat.",
  "canonicalAnswers": [
    "Viator tabernam intrat.",
    "Viator tabernam intrat",
    "viator tabernam intrat."
  ],
  "acceptedVariants": [
    "Viator tabernam intrat",
    "viator tabernam intrat"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Via Appia: nota (via-appia_side_nota)

#### Scene: [Via Appia 022](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_022_reply)
- **Scene ID**: `via-appia_022_reply`
- **Old Prompt**: "Latince yaz: Puella in villa est."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Puella in villa est.",
  "canonicalAnswers": [
    "Puella in villa est.",
    "Puella in villa est",
    "puella in villa est."
  ],
  "acceptedVariants": [
    "Puella in villa est",
    "puella in villa est"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Via Appia: memoria (via-appia_side_memoria)

#### Scene: [Via Appia 024](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.via-appia_024_path)
- **Scene ID**: `via-appia_024_path`
- **Old Prompt**: "Latince yaz: Servus sine gladio venit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "flavius",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Servus sine gladio venit.",
  "canonicalAnswers": [
    "Servus sine gladio venit.",
    "Servus sine gladio venit",
    "servus sine gladio venit."
  ],
  "acceptedVariants": [
    "Servus sine gladio venit",
    "servus sine gladio venit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Capitolium: prima (capitolium_main_prima)

#### Scene: [Capitolium 002](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_002_practice)
- **Scene ID**: `capitolium_002_practice`
- **Old Prompt**: "Latince yaz: Marcus librum videt."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus librum videt.",
  "canonicalAnswers": [
    "Marcus librum videt.",
    "Marcus librum videt",
    "marcus librum videt."
  ],
  "acceptedVariants": [
    "Marcus librum videt",
    "marcus librum videt"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Capitolium 004](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_004_reply)
- **Scene ID**: `capitolium_004_reply`
- **Old Prompt**: "Latince yaz: Julia bene scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "mercator",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Julia bene scribit.",
  "canonicalAnswers": [
    "Julia bene scribit.",
    "Julia bene scribit",
    "julia bene scribit."
  ],
  "acceptedVariants": [
    "Julia bene scribit",
    "julia bene scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Capitolium: secunda (capitolium_main_secunda)

#### Scene: [Capitolium 006](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_006_path)
- **Scene ID**: `capitolium_006_path`
- **Old Prompt**: "Latince yaz: Salve, amici."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "miles",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Salve, amici.",
  "canonicalAnswers": [
    "Salve, amici.",
    "Salve, amici",
    "salve, amici."
  ],
  "acceptedVariants": [
    "Salve amici",
    "salve amici"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Capitolium 007](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_007_arrival)
- **Scene ID**: `capitolium_007_arrival`
- **Old Prompt**: "Latince yaz: Marcus librum videt."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "magister",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus librum videt.",
  "canonicalAnswers": [
    "Marcus librum videt.",
    "Marcus librum videt",
    "marcus librum videt."
  ],
  "acceptedVariants": [
    "Marcus librum videt",
    "marcus librum videt"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Capitolium 008](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_008_practice)
- **Scene ID**: `capitolium_008_practice`
- **Old Prompt**: "Latince yaz: Veni ad templum."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Veni ad templum.",
  "canonicalAnswers": [
    "Veni ad templum.",
    "Veni ad templum",
    "veni ad templum."
  ],
  "acceptedVariants": [
    "Veni ad templum",
    "veni ad templum"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Capitolium 010](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_010_reply)
- **Scene ID**: `capitolium_010_reply`
- **Old Prompt**: "Latince yaz: Discipulus viae primae es."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "mercator",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Discipulus viae primae es.",
  "canonicalAnswers": [
    "Discipulus viae primae es.",
    "Discipulus viae primae es",
    "discipulus viae primae es."
  ],
  "acceptedVariants": [
    "Discipulus viae primae es",
    "discipulus viae primae es"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Capitolium: tertia (capitolium_main_tertia)

#### Scene: [Capitolium 012](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_012_path)
- **Scene ID**: `capitolium_012_path`
- **Old Prompt**: "Latince yaz: Marcus librum videt."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "miles",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus librum videt.",
  "canonicalAnswers": [
    "Marcus librum videt.",
    "Marcus librum videt",
    "marcus librum videt."
  ],
  "acceptedVariants": [
    "Marcus librum videt",
    "marcus librum videt"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Capitolium 014](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_014_practice)
- **Scene ID**: `capitolium_014_practice`
- **Old Prompt**: "Latince yaz: Julia bene scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Julia bene scribit.",
  "canonicalAnswers": [
    "Julia bene scribit.",
    "Julia bene scribit",
    "julia bene scribit."
  ],
  "acceptedVariants": [
    "Julia bene scribit",
    "julia bene scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Capitolium: quarta (capitolium_main_quarta)

#### Scene: [Capitolium 016](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_016_reply)
- **Scene ID**: `capitolium_016_reply`
- **Old Prompt**: "Latince yaz: Salve, amici."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "mercator",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Salve, amici.",
  "canonicalAnswers": [
    "Salve, amici.",
    "Salve, amici",
    "salve, amici."
  ],
  "acceptedVariants": [
    "Salve amici",
    "salve amici"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Capitolium 017](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_017_review)
- **Scene ID**: `capitolium_017_review`
- **Old Prompt**: "Latince yaz: Marcus librum videt."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "scriba",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus librum videt.",
  "canonicalAnswers": [
    "Marcus librum videt.",
    "Marcus librum videt",
    "marcus librum videt."
  ],
  "acceptedVariants": [
    "Marcus librum videt",
    "marcus librum videt"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Capitolium 018](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_018_path)
- **Scene ID**: `capitolium_018_path`
- **Old Prompt**: "Latince yaz: Veni ad templum."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "miles",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Veni ad templum.",
  "canonicalAnswers": [
    "Veni ad templum.",
    "Veni ad templum",
    "veni ad templum."
  ],
  "acceptedVariants": [
    "Veni ad templum",
    "veni ad templum"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Capitolium: auxilium (capitolium_side_auxilium)

#### Scene: [Capitolium 020](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_020_practice)
- **Scene ID**: `capitolium_020_practice`
- **Old Prompt**: "Latince yaz: Discipulus viae primae es."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Discipulus viae primae es.",
  "canonicalAnswers": [
    "Discipulus viae primae es.",
    "Discipulus viae primae es",
    "discipulus viae primae es."
  ],
  "acceptedVariants": [
    "Discipulus viae primae es",
    "discipulus viae primae es"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Capitolium 022](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_022_reply)
- **Scene ID**: `capitolium_022_reply`
- **Old Prompt**: "Latince yaz: Marcus librum videt."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "mercator",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus librum videt.",
  "canonicalAnswers": [
    "Marcus librum videt.",
    "Marcus librum videt",
    "marcus librum videt."
  ],
  "acceptedVariants": [
    "Marcus librum videt",
    "marcus librum videt"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Capitolium: amicus (capitolium_side_amicus)

#### Scene: [Capitolium 024](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_024_path)
- **Scene ID**: `capitolium_024_path`
- **Old Prompt**: "Latince yaz: Julia bene scribit."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "miles",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Julia bene scribit.",
  "canonicalAnswers": [
    "Julia bene scribit.",
    "Julia bene scribit",
    "julia bene scribit."
  ],
  "acceptedVariants": [
    "Julia bene scribit",
    "julia bene scribit"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Capitolium: nota (capitolium_side_nota)

#### Scene: [Capitolium 026](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_026_practice)
- **Scene ID**: `capitolium_026_practice`
- **Old Prompt**: "Latince yaz: Salve, amici."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "marcus",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Salve, amici.",
  "canonicalAnswers": [
    "Salve, amici.",
    "Salve, amici",
    "salve, amici."
  ],
  "acceptedVariants": [
    "Salve amici",
    "salve amici"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Capitolium: brevis (capitolium_side_brevis)

#### Scene: [Capitolium 027](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_027_voice)
- **Scene ID**: `capitolium_027_voice`
- **Old Prompt**: "Latince yaz: Marcus librum videt."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "julia",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Marcus librum videt.",
  "canonicalAnswers": [
    "Marcus librum videt.",
    "Marcus librum videt",
    "marcus librum videt."
  ],
  "acceptedVariants": [
    "Marcus librum videt",
    "marcus librum videt"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

#### Scene: [Capitolium 028](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_028_reply)
- **Scene ID**: `capitolium_028_reply`
- **Old Prompt**: "Latince yaz: Veni ad templum."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "mercator",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Veni ad templum.",
  "canonicalAnswers": [
    "Veni ad templum.",
    "Veni ad templum",
    "veni ad templum."
  ],
  "acceptedVariants": [
    "Veni ad templum",
    "veni ad templum"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```

### Quest: Capitolium: recapitulatio (capitolium_review_recapitulatio)

#### Scene: [Capitolium 030](file:////Users/kadirbeyan/Downloads/Latince Text Based/data/campaigns/via-prima.json#scenes.capitolium_030_path)
- **Scene ID**: `capitolium_030_path`
- **Old Prompt**: "Latince yaz: Discipulus viae primae es."
- **Proposed Dialogue Challenge JSON**:
```json
{
  "mode": "dialogue-response",
  "speakerNpcId": "miles",
  "npcPromptLatin": "Quis es?",
  "npcPromptTr": "Kim olduğunu soruyor.",
  "playerIntentTr": "Kendini tanıt/Cevap ver.",
  "targetMeaningTr": "Discipulus viae primae es.",
  "canonicalAnswers": [
    "Discipulus viae primae es.",
    "Discipulus viae primae es",
    "discipulus viae primae es."
  ],
  "acceptedVariants": [
    "Discipulus viae primae es",
    "discipulus viae primae es"
  ],
  "retryAllowed": true,
  "maxAttempts": 3,
  "evaluation": {
    "allowEquivalentMeaning": true,
    "allowWordOrderVariation": true,
    "requireContextMatch": true,
    "useLlmSemanticJudge": true,
    "minimumConfidence": 0.5
  }
}
```


**Total scenes analyzed**: 116
