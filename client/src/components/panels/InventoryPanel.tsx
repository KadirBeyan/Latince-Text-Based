import { useGameStore } from "../../stores/gameStore";

const itemLabels: Record<string, string> = {
  wax_tablet: "Balmumu tablet",
  stylus: "Yazı kalemi",
};

export function InventoryPanel() {
  const { gameState } = useGameStore();
  const inventory = gameState?.inventory ?? [];

  return (
    <section className="panel-card inventory-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Sarcina</p>
        <h3>Envanter</h3>
      </div>
      {inventory.length === 0 ? <p className="empty-state">Henüz eşyan yok.</p> : null}
      <div className="inventory-grid">
        {inventory.map((item) => (
          <div className="item-slot" key={item.itemId}>
            <span>{itemLabels[item.itemId] || item.itemId.replaceAll("_", " ")}</span>
            <strong>{item.quantity}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
