import React from "react";
import { ArrowRight, Backpack, ChartLineUp, Lightbulb, Shield, Warning } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";

export const SessionSummaryModal: React.FC = () => {
  const { activeModal, sessionSummary, closeModal } = useGameStore();

  if (activeModal !== "session-summary" || !sessionSummary) return null;

  const totalAnswers = sessionSummary.correctAnswers + sessionSummary.wrongAnswers;
  const accuracy = totalAnswers > 0 ? Math.round((sessionSummary.correctAnswers / totalAnswers) * 100) : 0;

  return (
    <div className="roman-modal-backdrop animate-fade-in">
      <div className="roman-modal-container gold-frame session-summary-container animate-modal-zoom">
        <div className="roman-modal-header session-summary-header">
          <h2 className="roman-title-gold">SENATUS CONSULTUM</h2>
          <p className="roman-subtitle">Oturum Değerlendirme Özeti</p>
        </div>

        <div className="roman-modal-body session-summary-body">
          <div className="session-stat-grid">
            <Stat label="Tamamlanan Sahne" value={sessionSummary.completedScenes} />
            <Stat label="Başarı Oranı" value={`%${accuracy}`} detail={`(${sessionSummary.correctAnswers} / ${totalAnswers})`} success />
            <Stat label="Kazanılan XP" value={`+${sessionSummary.xpGained}`} />
            <Stat label="Kazanılan Denarii" value={`+${sessionSummary.currencyGained}`} />
          </div>

          {sessionSummary.improvedMastery.length > 0 && (
            <section className="summary-section">
              <SectionTitle icon={<ChartLineUp size={17} weight="duotone" />}>Gelişen Konular &amp; Beceriler</SectionTitle>
              <div className="mastery-change-list">
                {sessionSummary.improvedMastery.map((item, index) => (
                  <div key={index} className="mastery-change-row">
                    <span className="mastery-name">{item.targetId}</span>
                    <div className="mastery-values">
                      <span>%{item.before ?? 0}</span>
                      <ArrowRight size={14} weight="bold" aria-hidden="true" />
                      <strong>%{item.after}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(sessionSummary.newSkills.length > 0 || sessionSummary.newItems.length > 0) && (
            <div className="session-summary-columns">
              {sessionSummary.newSkills.length > 0 && (
                <SummaryList icon={<Shield size={17} weight="duotone" />} title="Gelişen Yetenekler" items={sessionSummary.newSkills} />
              )}
              {sessionSummary.newItems.length > 0 && (
                <SummaryList icon={<Backpack size={17} weight="duotone" />} title="Yeni Eşyalar" items={sessionSummary.newItems} />
              )}
            </div>
          )}

          <div className="session-summary-columns">
            {sessionSummary.weakTags.length > 0 && (
              <section className="summary-section summary-section-warning">
                <SectionTitle icon={<Warning size={17} weight="duotone" />}>Tekrar Edilmesi Önerilen Konular</SectionTitle>
                <div className="weak-tag-list">
                  {sessionSummary.weakTags.map((tag, index) => <span key={index}>{tag}</span>)}
                </div>
              </section>
            )}
            {sessionSummary.reviewSuggestions.length > 0 && (
              <SummaryList icon={<Lightbulb size={17} weight="duotone" />} title="Çalışma Tavsiyeleri" items={sessionSummary.reviewSuggestions} />
            )}
          </div>
        </div>

        <div className="roman-modal-footer session-summary-footer">
          <button className="btn-roman gold-frame" onClick={closeModal}>KAPAT</button>
        </div>
      </div>
    </div>
  );
};

function Stat({ label, value, detail, success = false }: { label: string; value: React.ReactNode; detail?: string; success?: boolean }) {
  return <div className="stat-card"><span className="stat-label">{label}</span><span className={success ? "stat-value stat-value-success" : "stat-value"}>{value}</span>{detail ? <span className="stat-detail">{detail}</span> : null}</div>;
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <h4 className="section-title">{icon}{children}</h4>;
}

function SummaryList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return <section className="summary-section"><SectionTitle icon={icon}>{title}</SectionTitle><ul className="summary-list">{items.map((item, index) => <li key={index}>{item}</li>)}</ul></section>;
}
