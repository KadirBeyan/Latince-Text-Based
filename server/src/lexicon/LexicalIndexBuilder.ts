import type { LexicalEntry, LexicalForm, LexicalIndex } from "./LexicalTypes";
import { normalizeLatinToken, unique } from "./LexicalText";

type FormFeatures = LexicalForm["features"];

export function buildFormsForEntry(entry: LexicalEntry): LexicalForm[] {
  const generated = [
    ...entry.principalParts.map((part) => form(entry, part, {}, 0.95, "principal-parts")),
    ...(entry.pos === "noun" ? buildNounForms(entry) : []),
    ...(entry.pos === "adjective" ? buildAdjectiveForms(entry) : []),
    ...(entry.pos === "verb" ? buildVerbForms(entry) : []),
    ...(["preposition", "conjunction", "adverb", "pronoun", "particle", "interjection", "numeral"].includes(entry.pos) ? buildFunctionWordForms(entry) : [])
  ];
  const seen = new Set<string>();
  return generated.filter((item) => {
    const key = `${item.normalizedForm}:${JSON.stringify(item.features)}:${item.source}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(item.normalizedForm);
  });
}

export function buildNounForms(entry: LexicalEntry): LexicalForm[] {
  const lemma = entry.normalizedLemma;
  const gender = entry.morphology.gender || (lemma.endsWith("um") ? "neuter" : lemma.endsWith("a") ? "feminine" : "masculine");
  if (entry.morphology.declension === "1" || lemma.endsWith("a")) return nounPattern(entry, lemma.slice(0, -1), gender, "1", [["a", "nominative", "singular"], ["ae", "genitive", "singular"], ["ae", "dative", "singular"], ["am", "accusative", "singular"], ["a", "ablative", "singular"], ["a", "vocative", "singular"], ["ae", "nominative", "plural"], ["arum", "genitive", "plural"], ["is", "dative", "plural"], ["as", "accusative", "plural"], ["is", "ablative", "plural"], ["ae", "vocative", "plural"]]);
  if (entry.morphology.declension === "2" || lemma.endsWith("us") || lemma.endsWith("um")) {
    const neuter = lemma.endsWith("um") || gender === "neuter";
    if (!neuter && lemma.endsWith("er")) {
      const genitive = entry.principalParts.find((part) => part.endsWith("i") && part !== lemma);
      const stem = genitive ? genitive.slice(0, -1) : lemma;
      return nounPattern(entry, "", gender, "2", [[lemma, "nominative", "singular"], [stem + "i", "genitive", "singular"], [stem + "o", "dative", "singular"], [stem + "um", "accusative", "singular"], [stem + "o", "ablative", "singular"], [lemma, "vocative", "singular"], [stem + "i", "nominative", "plural"], [stem + "orum", "genitive", "plural"], [stem + "is", "dative", "plural"], [stem + "os", "accusative", "plural"], [stem + "is", "ablative", "plural"], [stem + "i", "vocative", "plural"]]);
    }
    const stem = lemma.replace(/(us|um)$/u, "");
    return nounPattern(entry, stem, neuter ? "neuter" : gender, "2", neuter
      ? [["um", "nominative", "singular"], ["i", "genitive", "singular"], ["o", "dative", "singular"], ["um", "accusative", "singular"], ["o", "ablative", "singular"], ["um", "vocative", "singular"], ["a", "nominative", "plural"], ["orum", "genitive", "plural"], ["is", "dative", "plural"], ["a", "accusative", "plural"], ["is", "ablative", "plural"], ["a", "vocative", "plural"]]
      : [["us", "nominative", "singular"], ["i", "genitive", "singular"], ["o", "dative", "singular"], ["um", "accusative", "singular"], ["o", "ablative", "singular"], ["e", "vocative", "singular"], ["i", "nominative", "plural"], ["orum", "genitive", "plural"], ["is", "dative", "plural"], ["os", "accusative", "plural"], ["is", "ablative", "plural"], ["i", "vocative", "plural"]]);
  }
  return [form(entry, lemma, { gender }, 0.7, "generated-morphology")];
}

export function buildAdjectiveForms(entry: LexicalEntry): LexicalForm[] {
  const parts = entry.principalParts;
  const masc = parts[0] || entry.normalizedLemma;
  const fem = parts[1] || masc.replace(/us$/u, "a");
  const neut = parts[2] || masc.replace(/us$/u, "um");
  return unique([masc, fem, neut]).flatMap((lemma) => buildNounForms({ ...entry, normalizedLemma: lemma, morphology: { ...entry.morphology, declension: "2", gender: lemma.endsWith("a") ? "feminine" : lemma.endsWith("um") ? "neuter" : "masculine" } }).map((item) => ({ ...item, pos: "adjective" as const })));
}

export function buildVerbForms(entry: LexicalEntry): LexicalForm[] {
  if (entry.normalizedLemma === "sum" || entry.principalParts.includes("esse")) {
    return [
      verb(entry, "sum", "1", "singular"), verb(entry, "es", "2", "singular"), verb(entry, "est", "3", "singular"), verb(entry, "sumus", "1", "plural"), verb(entry, "estis", "2", "plural"), verb(entry, "sunt", "3", "plural"),
      form(entry, "esse", { mood: "infinitive", tense: "present", voice: "active" }, 0.95, "principal-parts")
    ];
  }
  const lemma = entry.normalizedLemma;
  const conj = entry.morphology.conjugation;
  const stem = conj === "1" ? lemma.replace(/o$/u, "") : conj === "2" ? lemma.replace(/eo$/u, "") : conj === "4" ? lemma.replace(/io$/u, "") : lemma.replace(/o$/u, "");
  const endings = conj === "1" ? ["o", "as", "at", "amus", "atis", "ant"] : conj === "2" ? ["eo", "es", "et", "emus", "etis", "ent"] : conj === "4" ? ["io", "is", "it", "imus", "itis", "iunt"] : ["o", "is", "it", "imus", "itis", "unt"];
  const persons: Array<["1" | "2" | "3", "singular" | "plural"]> = [["1", "singular"], ["2", "singular"], ["3", "singular"], ["1", "plural"], ["2", "plural"], ["3", "plural"]];
  const forms = endings.map((ending, index) => verb(entry, `${stem}${ending}`, persons[index][0], persons[index][1]));
  const imperative = conj === "1" ? [stem + "a", stem + "ate"] : conj === "2" ? [stem + "e", stem + "ete"] : conj === "4" ? [stem + "i", stem + "ite"] : [stem, stem + "ite"];
  return [...forms, form(entry, imperative[0], { person: "2", number: "singular", tense: "present", mood: "imperative", voice: "active" }, 0.8, "generated-morphology"), form(entry, imperative[1], { person: "2", number: "plural", tense: "present", mood: "imperative", voice: "active" }, 0.8, "generated-morphology")];
}

export function buildFunctionWordForms(entry: LexicalEntry): LexicalForm[] {
  return unique([entry.normalizedLemma, ...entry.principalParts]).map((value) => form(entry, value, {}, 0.95, "principal-parts"));
}

export function buildLexicalIndex(entries: LexicalEntry[]): LexicalIndex {
  const lemmaIndex: LexicalIndex["lemmaIndex"] = {};
  const formIndex: LexicalIndex["formIndex"] = {};
  const frequencyIndex: LexicalIndex["frequencyIndex"] = {};
  for (const entry of entries) {
    (lemmaIndex[entry.normalizedLemma] ||= []).push(entry.id);
    (frequencyIndex[entry.frequency.band] ||= []).push(entry.id);
    for (const lexicalForm of entry.forms) (formIndex[lexicalForm.normalizedForm] ||= []).push({ entryId: entry.id, form: lexicalForm });
  }
  return { builtAt: new Date().toISOString(), entryCount: entries.length, formCount: entries.reduce((sum, entry) => sum + entry.forms.length, 0), lemmaIndex, formIndex, frequencyIndex };
}

function nounPattern(entry: LexicalEntry, stem: string, gender: NonNullable<FormFeatures["gender"]>, declension: string, rows: Array<[string, NonNullable<FormFeatures["case"]>, NonNullable<FormFeatures["number"]>]>): LexicalForm[] {
  return rows.map(([ending, caseName, number]) => form(entry, stem + ending, { case: caseName, number, gender }, declension === "1" || declension === "2" ? 0.82 : 0.7, "generated-morphology"));
}

function verb(entry: LexicalEntry, value: string, person: "1" | "2" | "3", number: "singular" | "plural"): LexicalForm {
  return form(entry, value, { person, number, tense: "present", mood: "indicative", voice: "active" }, 0.82, "generated-morphology");
}

function form(entry: LexicalEntry, value: string, features: FormFeatures, confidence: number, source: LexicalForm["source"]): LexicalForm {
  return { form: value, normalizedForm: normalizeLatinToken(value), lemma: entry.normalizedLemma, pos: entry.pos, features, confidence, source };
}
