import { useState } from "react";
import { VpCard, VpSectionHeader, VpButton, VpInput, VpTextarea } from "../../ui";
import { Field, JsonBlock, split } from "../SceneEditor";

type ConversationFlowEditorProps = {
  data: any;
  onChange: (patch: any) => void;
};

export function ConversationFlowEditor({ data, onChange }: ConversationFlowEditorProps) {
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingOptionId, setEditingOptionId] = useState<{ nodeId: string; optionId: string } | null>(null);

  const nodes = data?.nodes ?? [];
  const activeNode = nodes.find((n: any) => n.id === editingNodeId);

  const updateNode = (nodeId: string, nodePatch: any) => {
    const updatedNodes = nodes.map((n: any) => {
      if (n.id === nodeId) {
        return { ...n, ...nodePatch };
      }
      return n;
    });
    onChange({ nodes: updatedNodes });
  };

  const addNode = () => {
    const newId = `node_${Date.now().toString().slice(-4)}`;
    const newNode = {
      id: newId,
      speakerNpcId: data?.npcIds?.[0] || "",
      narrationTr: "Yeni anlatım metni.",
      options: []
    };
    onChange({ nodes: [...nodes, newNode] });
    setEditingNodeId(newId);
  };

  const deleteNode = (nodeId: string) => {
    if (!window.confirm(`Node ${nodeId} silinsin mi?`)) return;
    onChange({ nodes: nodes.filter((n: any) => n.id !== nodeId) });
    if (editingNodeId === nodeId) setEditingNodeId(null);
  };

  const addOption = (nodeId: string) => {
    const node = nodes.find((n: any) => n.id === nodeId);
    if (!node) return;
    const newOptId = `opt_${Date.now().toString().slice(-4)}`;
    const newOption = {
      id: newOptId,
      labelTr: "Yeni Seçenek",
      verb: "speak",
      requiresLatin: false,
      nextNodeId: ""
    };
    updateNode(nodeId, { options: [...(node.options ?? []), newOption] });
    setEditingOptionId({ nodeId, optionId: newOptId });
  };

  const updateOption = (nodeId: string, optionId: string, optionPatch: any) => {
    const node = nodes.find((n: any) => n.id === nodeId);
    if (!node) return;
    const updatedOptions = (node.options ?? []).map((o: any) => {
      if (o.id === optionId) {
        return { ...o, ...optionPatch };
      }
      return o;
    });
    updateNode(nodeId, { options: updatedOptions });
  };

  const deleteOption = (nodeId: string, optionId: string) => {
    if (!window.confirm("Bu seçeneği silmek istediğinize emin misiniz?")) return;
    const node = nodes.find((n: any) => n.id === nodeId);
    if (!node) return;
    updateNode(nodeId, { options: (node.options ?? []).filter((o: any) => o.id !== optionId) });
    if (editingOptionId?.optionId === optionId) setEditingOptionId(null);
  };

  return (
    <div className="authoring-editor-stack" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* 1. Main Conversation Flow Info */}
      <VpCard variant="compact">
        <VpSectionHeader eyebrow="Conversation Flow" title={data?.titleTr ?? "Yeni Diyalog Akışı"} />
        <div className="authoring-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem" }}>
          <Field label="ID" value={data?.id} onChange={(id) => onChange({ id })} />
          <Field label="Başlık (Türkçe)" value={data?.titleTr} onChange={(titleTr) => onChange({ titleTr })} />
          <Field label="Başlangıç Node ID" value={data?.startNodeId} onChange={(startNodeId) => onChange({ startNodeId })} />
          <Field label="İlişkili Görev (Quest ID)" value={data?.relatedQuestId} onChange={(relatedQuestId) => onChange({ relatedQuestId })} />
          <Field label="İlişkili Aktivite ID" value={data?.relatedActivityId} onChange={(relatedActivityId) => onChange({ relatedActivityId })} />
          <Field label="NPC IDs (Virgülle ayırın)" value={(data?.npcIds ?? []).join(", ")} onChange={(val) => onChange({ npcIds: split(val) })} />
          <Field label="Konum IDs (Virgülle ayırın)" value={(data?.locationIds ?? []).join(", ")} onChange={(val) => onChange({ locationIds: split(val) })} />
        </div>
      </VpCard>

      {/* 2. Nodes List */}
      <VpCard variant="compact">
        <VpSectionHeader eyebrow="Nodes Graph" title={`${nodes.length} Nodes`} />
        <div style={{ padding: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {nodes.map((n: any) => (
            <div 
              key={n.id} 
              style={{ 
                border: editingNodeId === n.id ? "2px solid var(--accent-gold, #c3a05c)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                padding: "0.5rem",
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <button 
                type="button" 
                onClick={() => { setEditingNodeId(n.id); setEditingOptionId(null); }}
                style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontWeight: "600" }}
              >
                {n.id} {n.speakerNpcId ? `(${n.speakerNpcId})` : ""}
              </button>
              <button 
                type="button" 
                onClick={() => deleteNode(n.id)} 
                style={{ background: "none", border: "none", color: "#ff8b8b", cursor: "pointer", fontSize: "0.8rem" }}
              >
                X
              </button>
            </div>
          ))}
          <VpButton onClick={addNode}>+ Add Node</VpButton>
        </div>
      </VpCard>

      {/* 3. Selected Node Editor */}
      {activeNode && (
        <VpCard variant="compact" style={{ border: "1px solid var(--accent-gold, #c3a05c)" }}>
          <VpSectionHeader eyebrow="Node Editor" title={`Editing: ${activeNode.id}`} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
            <div className="authoring-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Node ID" value={activeNode.id} onChange={(id) => updateNode(activeNode.id, { id })} />
              <Field label="Konuşan NPC ID" value={activeNode.speakerNpcId} onChange={(speakerNpcId) => updateNode(activeNode.id, { speakerNpcId })} />
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
                <input 
                  type="checkbox" 
                  checked={Boolean(activeNode.isEnding)} 
                  onChange={(e) => updateNode(activeNode.id, { isEnding: e.target.checked })} 
                />
                <span>Sonuçlandırıcı mı? (isEnding)</span>
              </label>
              {activeNode.isEnding && (
                <Field label="Sonuç Özeti (Türkçe)" value={activeNode.endingSummaryTr} onChange={(endingSummaryTr) => updateNode(activeNode.id, { endingSummaryTr })} />
              )}
            </div>

            <label className="authoring-wide">
              <span>Anlatım Metni (Türkçe - narrationTr)</span>
              <VpTextarea 
                value={activeNode.narrationTr ?? ""} 
                onChange={(e) => updateNode(activeNode.id, { narrationTr: e.target.value })} 
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <label>
                <span>NPC Latince Repliği (npcLineLatin)</span>
                <VpTextarea 
                  value={activeNode.npcLineLatin ?? ""} 
                  onChange={(e) => updateNode(activeNode.id, { npcLineLatin: e.target.value })} 
                />
              </label>
              <label>
                <span>NPC Türkçe Çevirisi (npcLineTr)</span>
                <VpTextarea 
                  value={activeNode.npcLineTr ?? ""} 
                  onChange={(e) => updateNode(activeNode.id, { npcLineTr: e.target.value })} 
                />
              </label>
            </div>

            <label className="authoring-wide">
              <span>Oyuncu İçerik/Bağlam İpucu (playerContextTr)</span>
              <VpInput 
                value={activeNode.playerContextTr ?? ""} 
                onChange={(e) => updateNode(activeNode.id, { playerContextTr: e.target.value })} 
              />
            </label>

            {/* 3a. Node Options List */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h4 style={{ margin: 0, color: "var(--accent-gold, #c3a05c)" }}>Seçenekler / Kararlar ({activeNode.options?.length ?? 0})</h4>
                <VpButton variant="ghost" onClick={() => addOption(activeNode.id)}>+ Add Option</VpButton>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(activeNode.options ?? []).map((o: any) => (
                  <div 
                    key={o.id} 
                    style={{ 
                      padding: "0.5rem", 
                      backgroundColor: "rgba(255,255,255,0.02)", 
                      border: editingOptionId?.optionId === o.id ? "1px solid var(--accent-gold, #c3a05c)" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <strong>{o.id}:</strong> {o.labelTr} {o.requiresLatin && <span style={{ color: "#e6b450", fontSize: "0.8rem", marginLeft: "0.5rem" }}>[Latince]</span>}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <VpButton variant="ghost" onClick={() => setEditingOptionId({ nodeId: activeNode.id, optionId: o.id })}>Düzenle</VpButton>
                      <button 
                        type="button" 
                        onClick={() => deleteOption(activeNode.id, o.id)}
                        style={{ background: "none", border: "none", color: "#ff8b8b", cursor: "pointer" }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3b. Option Detail Form */}
            {editingOptionId && editingOptionId.nodeId === activeNode.id && (
              (() => {
                const opt = activeNode.options?.find((o: any) => o.id === editingOptionId.optionId);
                if (!opt) return null;
                return (
                  <div style={{ border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "6px", padding: "1rem", marginTop: "1rem", backgroundColor: "rgba(0,0,0,0.1)" }}>
                    <h5 style={{ margin: "0 0 1rem 0", color: "#e6b450" }}>Seçenek Düzenle: {opt.id}</h5>
                    <div className="authoring-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <Field label="Seçenek ID" value={opt.id} onChange={(id) => updateOption(activeNode.id, opt.id, { id })} />
                      <Field label="Seçenek Metni (labelTr)" value={opt.labelTr} onChange={(labelTr) => updateOption(activeNode.id, opt.id, { labelTr })} />
                      <Field label="Açıklama (descriptionTr)" value={opt.descriptionTr} onChange={(descriptionTr) => updateOption(activeNode.id, opt.id, { descriptionTr })} />
                      <label>
                        <span>Eylem Fiili (verb)</span>
                        <select 
                          value={opt.verb ?? "speak"} 
                          onChange={(e) => updateOption(activeNode.id, opt.id, { verb: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", backgroundColor: "rgba(0,0,0,0.3)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
                        >
                          {["speak", "ask", "inspect", "listen", "wait", "help", "refuse", "leave", "remember", "read", "custom"].map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
                        <input 
                          type="checkbox" 
                          checked={Boolean(opt.requiresLatin)} 
                          onChange={(e) => updateOption(activeNode.id, opt.id, { requiresLatin: e.target.checked })} 
                        />
                        <span>Latince Cevap Gerektirir</span>
                      </label>
                    </div>

                    {opt.requiresLatin && (
                      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <Field label="Oyuncu Niyeti (Türkçe)" value={opt.playerIntentTr} onChange={(playerIntentTr) => updateOption(activeNode.id, opt.id, { playerIntentTr })} />
                        <Field label="Hedef Latince Anlamı (Türkçe)" value={opt.targetMeaningTr} onChange={(targetMeaningTr) => updateOption(activeNode.id, opt.id, { targetMeaningTr })} />
                        
                        <label>
                          <span>Kabul Edilen Doğru Cevaplar (Her satıra bir tane)</span>
                          <VpTextarea 
                            value={(opt.canonicalAnswers ?? []).join("\n")} 
                            placeholder="Örn: salve mater"
                            onChange={(e) => updateOption(activeNode.id, opt.id, { canonicalAnswers: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} 
                          />
                        </label>
                        <label>
                          <span>Kabul Edilen Varyantlar (Her satıra bir tane)</span>
                          <VpTextarea 
                            value={(opt.acceptedVariants ?? []).join("\n")} 
                            placeholder="Örn: salve"
                            onChange={(e) => updateOption(activeNode.id, opt.id, { acceptedVariants: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} 
                          />
                        </label>
                        <label>
                          <span>Başarısızlık Davranışı (failureBehavior)</span>
                          <select 
                            value={opt.failureBehavior ?? "retry"} 
                            onChange={(e) => updateOption(activeNode.id, opt.id, { failureBehavior: e.target.value })}
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", backgroundColor: "rgba(0,0,0,0.3)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
                          >
                            <option value="retry">Tekrar dene (retry)</option>
                            <option value="node">Vazgeç/Dallan (node)</option>
                            <option value="soft-fail">Yumuşak Hata (soft-fail)</option>
                            <option value="continue">Devam Et (continue)</option>
                          </select>
                        </label>
                      </div>
                    )}

                    <div className="authoring-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                      <Field label="Hedef Node ID (nextNodeId)" value={opt.nextNodeId} onChange={(nextNodeId) => updateOption(activeNode.id, opt.id, { nextNodeId })} />
                      <Field label="Başarı Hedef Node ID" value={opt.successNextNodeId} onChange={(successNextNodeId) => updateOption(activeNode.id, opt.id, { successNextNodeId })} />
                      <Field label="Başarısızlık Hedef Node ID" value={opt.failureNextNodeId} onChange={(failureNextNodeId) => updateOption(activeNode.id, opt.id, { failureNextNodeId })} />
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </VpCard>
      )}

      {/* 4. Advanced JSON Block */}
      <JsonBlock data={data} onChange={onChange} />
    </div>
  );
}
