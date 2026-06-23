import React, { useState } from "react";
import { VpBadge, VpButton, VpTextarea, VpInput } from "../../ui";
import { LinesField, SelectField, TextField, NumberField } from "./editorUtils";
import { useSettingsStore } from "../../../stores/settingsStore";
import { getApiBase } from "../../../api/apiBase";

function rejectedMeaningsToText(items: any[] = []): string {
  return items.map((item) => [item.exampleLatin ?? "", item.meaningTr ?? "", item.reasonTr ?? ""].join(" | ")).join("\n");
}

function rejectedMeaningsFromText(text: string): any[] {
  return text.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [exampleLatin = "", meaningTr = "", reasonTr = ""] = line.split("|").map((part) => part.trim());
    return { exampleLatin: exampleLatin || undefined, meaningTr, reasonTr };
  });
}

export function DialogueChallengeEditor({
  value,
  onChange,
  sceneIds = []
}: {
  value: any;
  onChange: (value: any) => void;
  sceneIds?: string[];
}) {
  const challenge = value ?? {
    mode: "dialogue-response",
    playerIntentTr: "",
    targetMeaningTr: "",
    canonicalAnswers: [],
    acceptedVariants: [],
    rejectedMeanings: [],
    expectedLevel: "A0",
    retryAllowed: true,
    maxAttempts: 3,
    evaluation: {
      allowEquivalentMeaning: true,
      allowWordOrderVariation: true,
      requireContextMatch: true,
      useLlmSemanticJudge: true,
      minimumConfidence: 0.5
    },
    reactions: {
      correct: { npcLineLatin: "", npcLineTr: "", feedbackTr: "", hintTr: "" },
      nearMiss: { npcLineLatin: "", npcLineTr: "", feedbackTr: "", hintTr: "" },
      wrong: { npcLineLatin: "", npcLineTr: "", feedbackTr: "", hintTr: "" },
      contextWrong: { npcLineLatin: "", npcLineTr: "", feedbackTr: "", hintTr: "" }
    }
  };

  const { getLlmConfigOrUndefined } = useSettingsStore();

  // Test state
  const [testAnswer, setTestAnswer] = useState("");
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [canonicalAnalysis, setCanonicalAnalysis] = useState<any>(null);

  async function handleTest() {
    if (!testAnswer.trim()) return;
    setTestLoading(true);
    setTestResult(null);
    try {
      const apiBase = await getApiBase();
      const response = await fetch(`${apiBase}/api/authoring/dialogue/test-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: testAnswer,
          challenge,
          sceneContext: { sceneId: "studio-test-scene" },
          playerContext: { level: 1, assessmentLevel: "A0" },
          llmConfig: getLlmConfigOrUndefined()
        })
      });
      if (response.ok) {
        const data = await response.json();
        setTestResult(data);
      } else {
        const text = await response.text();
        alert("Hata: " + text);
      }
    } catch (e: any) {
      alert("Hata: " + e.message);
    } finally {
      setTestLoading(false);
    }
  }

  async function handleSuggest() {
    if (!challenge.canonicalAnswers || challenge.canonicalAnswers.length === 0) {
      alert("Lütfen önce canonicalAnswers ekleyin.");
      return;
    }
    setSuggestLoading(true);
    setSuggestions([]);
    try {
      const apiBase = await getApiBase();
      const response = await fetch(`${apiBase}/api/authoring/dialogue/suggest-variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canonicalAnswers: challenge.canonicalAnswers,
          targetMeaningTr: challenge.targetMeaningTr,
          llmConfig: getLlmConfigOrUndefined()
        })
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.variants || []);
      } else {
        const text = await response.text();
        alert("Hata: " + text);
      }
    } catch (e: any) {
      alert("Hata: " + e.message);
    } finally {
      setSuggestLoading(false);
    }
  }

  async function handleCanonicalAnalysis() {
    const canonical = challenge.canonicalAnswers?.[0];
    if (!canonical) return;
    const apiBase = await getApiBase();
    const response = await fetch(`${apiBase}/api/latin/analyze-sentence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: canonical }),
    });
    setCanonicalAnalysis(response.ok ? await response.json() : { summaryTr: await response.text() });
  }

  function addSuggestedVariant(variant: string) {
    const current = challenge.acceptedVariants || [];
    if (!current.includes(variant)) {
      onChange({
        ...challenge,
        acceptedVariants: [...current, variant]
      });
    }
  }

  const updateEvaluation = (key: string, val: any) => {
    onChange({
      ...challenge,
      evaluation: {
        ...(challenge.evaluation || {}),
        [key]: val
      }
    });
  };

  const updateReaction = (vKey: string, rKey: string, val: any) => {
    const rx = challenge.reactions || {};
    onChange({
      ...challenge,
      reactions: {
        ...rx,
        [vKey]: {
          ...(rx[vKey] || {}),
          [rKey]: val
        }
      }
    });
  };

  return (
    <div className="authoring-dialogue-challenge-editor">
      <div className="authoring-form-grid">
        <TextField
          label="speakerNpcId (NPC ID)"
          value={challenge.speakerNpcId}
          onChange={val => onChange({ ...challenge, speakerNpcId: val })}
        />
        <TextField
          label="npcPromptLatin (NPC Latince replik)"
          value={challenge.npcPromptLatin}
          onChange={val => onChange({ ...challenge, npcPromptLatin: val })}
        />
        <TextField
          label="npcPromptTr (NPC Türkçe açıklama)"
          value={challenge.npcPromptTr}
          onChange={val => onChange({ ...challenge, npcPromptTr: val })}
        />
        <TextField
          label="playerIntentTr (Oyuncu Niyeti - Türkçe)"
          value={challenge.playerIntentTr}
          onChange={val => onChange({ ...challenge, playerIntentTr: val })}
        />
        <TextField
          label="targetMeaningTr (Hedeflenen Anlam - Türkçe)"
          value={challenge.targetMeaningTr}
          onChange={val => onChange({ ...challenge, targetMeaningTr: val })}
        />
        
        <SelectField
          label="expectedLevel"
          value={challenge.expectedLevel || "A0"}
          options={["A0", "A1", "A2", "B1", "B2"]}
          onChange={val => onChange({ ...challenge, expectedLevel: val })}
        />

        <LinesField
          label="canonicalAnswers (En Doğru Cevaplar - Satır Satır)"
          value={challenge.canonicalAnswers || []}
          onChange={val => onChange({ ...challenge, canonicalAnswers: val })}
        />

        <LinesField
          label="acceptedVariants (Kabul Edilebilir Diğer Cevaplar)"
          value={challenge.acceptedVariants || []}
          onChange={val => onChange({ ...challenge, acceptedVariants: val })}
        />

        <LinesField
          label="grammarFocusIds"
          value={challenge.grammarFocusIds || []}
          onChange={val => onChange({ ...challenge, grammarFocusIds: val })}
        />

        <LinesField
          label="vocabularyFocusIds"
          value={challenge.vocabularyFocusIds || []}
          onChange={val => onChange({ ...challenge, vocabularyFocusIds: val })}
        />

        <label className="authoring-wide">
          <span>rejectedMeanings — her satır: Latince örnek | Türkçe anlam | reddetme nedeni</span>
          <VpTextarea
            value={rejectedMeaningsToText(challenge.rejectedMeanings)}
            onChange={event => onChange({ ...challenge, rejectedMeanings: rejectedMeaningsFromText(event.target.value) })}
          />
        </label>

        <div className="authoring-wide authoring-grid-subhead">Gelişmiş Değerlendirme Ayarları</div>

        <label>
          <span>useLlmSemanticJudge (LLM Desteği)</span>
          <select
            value={String(challenge.evaluation?.useLlmSemanticJudge ?? true)}
            onChange={e => updateEvaluation("useLlmSemanticJudge", e.target.value === "true")}
          >
            <option value="true">Evet</option>
            <option value="false">Hayır</option>
          </select>
        </label>

        <label>
          <span>allowWordOrderVariation (Kelime Sırası)</span>
          <select value={String(challenge.evaluation?.allowWordOrderVariation ?? true)} onChange={e => updateEvaluation("allowWordOrderVariation", e.target.value === "true")}>
            <option value="true">Evet</option><option value="false">Hayır</option>
          </select>
        </label>

        <label>
          <span>requireContextMatch (Bağlam Eşleşmesi)</span>
          <select value={String(challenge.evaluation?.requireContextMatch ?? true)} onChange={e => updateEvaluation("requireContextMatch", e.target.value === "true")}>
            <option value="true">Evet</option><option value="false">Hayır</option>
          </select>
        </label>

        <label>
          <span>allowAdvancedCorrectAnswer</span>
          <select value={String(challenge.evaluation?.allowAdvancedCorrectAnswer ?? true)} onChange={e => updateEvaluation("allowAdvancedCorrectAnswer", e.target.value === "true")}>
            <option value="true">Evet</option><option value="false">Hayır</option>
          </select>
        </label>

        <label>
          <span>allowEquivalentMeaning (Eş Değer Anlam)</span>
          <select
            value={String(challenge.evaluation?.allowEquivalentMeaning ?? true)}
            onChange={e => updateEvaluation("allowEquivalentMeaning", e.target.value === "true")}
          >
            <option value="true">Evet</option>
            <option value="false">Hayır</option>
          </select>
        </label>

        <NumberField
          label="minimumConfidence (Minimum LLM Güven Puanı [0..1])"
          value={challenge.evaluation?.minimumConfidence ?? 0.5}
          onChange={val => updateEvaluation("minimumConfidence", val)}
          min={0}
          max={1}
        />

        <label>
          <span>retryAllowed (Tekrar İzni)</span>
          <select
            value={String(challenge.retryAllowed ?? true)}
            onChange={e => onChange({ ...challenge, retryAllowed: e.target.value === "true" })}
          >
            <option value="true">Evet</option>
            <option value="false">Hayır</option>
          </select>
        </label>

        <NumberField
          label="maxAttempts (Maksimum Tekrar Sayısı)"
          value={challenge.maxAttempts ?? 3}
          onChange={val => onChange({ ...challenge, maxAttempts: val })}
          min={1}
          max={10}
        />

        <SelectField
          label="successNextSceneId"
          value={challenge.successNextSceneId || ""}
          options={sceneIds}
          onChange={val => onChange({ ...challenge, successNextSceneId: val })}
        />

        <SelectField
          label="failureNextSceneId"
          value={challenge.failureNextSceneId || ""}
          options={sceneIds}
          onChange={val => onChange({ ...challenge, failureNextSceneId: val })}
        />

        <div className="authoring-wide authoring-grid-subhead">NPC Reaksiyonları & Pedagojik Cevaplar</div>

        {/* Correct Reaction */}
        <div className="authoring-reaction-block authoring-wide">
          <h4>Doğru Reaksiyon (correct)</h4>
          <div className="authoring-form-grid">
            <TextField label="NPC Latin" value={challenge.reactions?.correct?.npcLineLatin} onChange={val => updateReaction("correct", "npcLineLatin", val)} />
            <TextField label="NPC Tr" value={challenge.reactions?.correct?.npcLineTr} onChange={val => updateReaction("correct", "npcLineTr", val)} />
            <TextField label="Pedagojik Feedback (Tr)" value={challenge.reactions?.correct?.feedbackTr} onChange={val => updateReaction("correct", "feedbackTr", val)} />
          </div>
        </div>

        {/* Near Miss Reaction */}
        <div className="authoring-reaction-block authoring-wide">
          <h4>Yakın Yanıt Reaksiyon (nearMiss)</h4>
          <div className="authoring-form-grid">
            <TextField label="NPC Latin" value={challenge.reactions?.nearMiss?.npcLineLatin} onChange={val => updateReaction("nearMiss", "npcLineLatin", val)} />
            <TextField label="NPC Tr" value={challenge.reactions?.nearMiss?.npcLineTr} onChange={val => updateReaction("nearMiss", "npcLineTr", val)} />
            <TextField label="Pedagojik Feedback (Tr)" value={challenge.reactions?.nearMiss?.feedbackTr} onChange={val => updateReaction("nearMiss", "feedbackTr", val)} />
          </div>
        </div>

        <div className="authoring-reaction-block authoring-wide">
          <h4>Eşdeğer Doğru Reaksiyon (equivalentCorrect)</h4>
          <div className="authoring-form-grid">
            <TextField label="NPC Latin" value={challenge.reactions?.equivalentCorrect?.npcLineLatin} onChange={val => updateReaction("equivalentCorrect", "npcLineLatin", val)} />
            <TextField label="NPC Tr" value={challenge.reactions?.equivalentCorrect?.npcLineTr} onChange={val => updateReaction("equivalentCorrect", "npcLineTr", val)} />
            <TextField label="Pedagojik Feedback (Tr)" value={challenge.reactions?.equivalentCorrect?.feedbackTr} onChange={val => updateReaction("equivalentCorrect", "feedbackTr", val)} />
          </div>
        </div>

        <div className="authoring-reaction-block authoring-wide">
          <h4>Bağlam Hatası Reaksiyonu (contextWrong)</h4>
          <div className="authoring-form-grid">
            <TextField label="NPC Latin" value={challenge.reactions?.contextWrong?.npcLineLatin} onChange={val => updateReaction("contextWrong", "npcLineLatin", val)} />
            <TextField label="NPC Tr" value={challenge.reactions?.contextWrong?.npcLineTr} onChange={val => updateReaction("contextWrong", "npcLineTr", val)} />
            <TextField label="Pedagojik Feedback (Tr)" value={challenge.reactions?.contextWrong?.feedbackTr} onChange={val => updateReaction("contextWrong", "feedbackTr", val)} />
          </div>
        </div>

        {/* Wrong Reaction */}
        <div className="authoring-reaction-block authoring-wide">
          <h4>Yanlış Reaksiyon (wrong)</h4>
          <div className="authoring-form-grid">
            <TextField label="NPC Latin" value={challenge.reactions?.wrong?.npcLineLatin} onChange={val => updateReaction("wrong", "npcLineLatin", val)} />
            <TextField label="NPC Tr" value={challenge.reactions?.wrong?.npcLineTr} onChange={val => updateReaction("wrong", "npcLineTr", val)} />
            <TextField label="Pedagojik Feedback (Tr)" value={challenge.reactions?.wrong?.feedbackTr} onChange={val => updateReaction("wrong", "feedbackTr", val)} />
          </div>
        </div>
      </div>

      {/* Interactive Testing Panel */}
      <div className="authoring-dialogue-testing panel-card" style={{ marginTop: "24px", padding: "16px" }}>
        <h3>Diyalog Test Laboratuvarı</h3>
        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          <VpInput
            style={{ flex: 1 }}
            value={testAnswer}
            placeholder="Cevabı test edin... (örn: Ego sum Marcus.)"
            onChange={e => setTestAnswer(e.target.value)}
          />
          <VpButton type="button" disabled={testLoading} onClick={handleTest}>
            {testLoading ? "Değerlendiriliyor..." : "Cevabı Test Et"}
          </VpButton>
          <VpButton type="button" variant="ghost" disabled={suggestLoading} onClick={handleSuggest}>
            {suggestLoading ? "Öneriliyor..." : "Alternatif Öner"}
          </VpButton>
          <VpButton type="button" variant="ghost" disabled={!challenge.canonicalAnswers?.[0]} onClick={handleCanonicalAnalysis}>
            Canonical Cevabı Analiz Et
          </VpButton>
        </div>

        {/* Test Result Card */}
        {testResult && (
          <div className={`authoring-test-result-card ${testResult.acceptedAsCorrect ? "success" : "danger"}`} style={{ marginTop: "16px", padding: "12px", border: "1px solid #ccc", borderRadius: "4px" }}>
            <h4>Sonuç: {testResult.acceptedAsCorrect ? "BAŞARILI" : "BAŞARISIZ"} (verdict: {testResult.verdict})</h4>
            <p><strong>Feedback:</strong> {testResult.feedbackTr}</p>
            {testResult.grammarNoteTr && <p><strong>Gramer Notu:</strong> {testResult.grammarNoteTr}</p>}
            {testResult.contextNoteTr && <p><strong>Bağlam Notu:</strong> {testResult.contextNoteTr}</p>}
            {testResult.detectedMeaningTr && <p><strong>Tespit Edilen Anlam:</strong> {testResult.detectedMeaningTr}</p>}
            <p><small>Güven: {Math.round(testResult.confidence * 100)}% | Kaynak: {testResult.debug?.source}</small></p>
          </div>
        )}

        {canonicalAnalysis && (
          <div className="authoring-test-result-card" style={{ marginTop: "16px", padding: "12px", border: "1px solid #ccc", borderRadius: "4px" }}>
            <h4>Canonical Analiz</h4>
            <p>{canonicalAnalysis.summaryTr}</p>
          </div>
        )}

        <div className="authoring-dialogue-preview" style={{ marginTop: "16px" }}>
          <h4>Dialogue Preview</h4>
          <p><strong>{challenge.speakerNpcId || "NPC"}:</strong> “{challenge.npcPromptLatin || "…"}”</p>
          {challenge.npcPromptTr && <p><small>({challenge.npcPromptTr})</small></p>}
          <p><strong>Oyuncu niyeti:</strong> {challenge.playerIntentTr || "Tanımlanmadı"}</p>
          <p><strong>Hedef:</strong> {challenge.targetMeaningTr || "Tanımlanmadı"}</p>
        </div>

        {/* Suggestion list */}
        {suggestions.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <h4>Alternatif Doğru Cevap Önerileri (Tıklayarak acceptedVariants'a ekleyin):</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
              {suggestions.map((v, i) => (
                <VpBadge
                  key={i}
                  variant="muted"
                  style={{ cursor: "pointer" }}
                  onClick={() => addSuggestedVariant(v)}
                >
                  + {v}
                </VpBadge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
