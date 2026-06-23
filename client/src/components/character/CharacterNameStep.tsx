import { useCharacterCreationStore } from "../../stores/characterCreationStore";

export function CharacterNameStep() {
  const { name, setName } = useCharacterCreationStore();
  return (
    <div className="creation-step">
      <p className="eyebrow">I · Kimliğin</p>
      <h2>İnsanlar seni nasıl çağırıyor?</h2>
      <p>Roma dünyasında küçük bir vicus'ta doğdun. Henüz kimse kaderini bilmiyor; köy seni adınla ve yaptıklarınla tanıyacak.</p>
      <label>
        Karakter adı
        <input className="parchment-input" value={name} maxLength={32} onChange={(event) => setName(event.target.value)} placeholder="Marcus" autoFocus />
      </label>
    </div>
  );
}
