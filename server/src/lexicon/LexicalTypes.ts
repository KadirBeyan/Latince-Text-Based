export type LexicalPos =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "interjection"
  | "numeral"
  | "particle"
  | "unknown";

export type LexicalLevel = "A1" | "A2" | "B1" | "B2" | "advanced";
export type FrequencyBand = "top-100" | "top-250" | "top-500" | "top-1000" | "top-2000" | "top-5000" | "rare" | "unknown";

export type LexicalForm = {
  form: string;
  normalizedForm: string;
  lemma: string;
  pos: LexicalPos;
  features: {
    case?: "nominative" | "genitive" | "dative" | "accusative" | "ablative" | "vocative" | "unknown";
    number?: "singular" | "plural" | "unknown";
    gender?: "masculine" | "feminine" | "neuter" | "common" | "unknown";
    person?: "1" | "2" | "3" | "unknown";
    tense?: "present" | "imperfect" | "future" | "perfect" | "pluperfect" | "future-perfect" | "unknown";
    mood?: "indicative" | "imperative" | "subjunctive" | "infinitive" | "participle" | "unknown";
    voice?: "active" | "passive" | "unknown";
  };
  confidence: number;
  source: "principal-parts" | "generated-morphology" | "heuristic" | "manual";
};

export type LexicalEntry = {
  id: string;
  lemma: string;
  displayLemma: string;
  normalizedLemma: string;
  principalParts: string[];
  pos: LexicalPos;
  morphology: {
    gender?: "masculine" | "feminine" | "neuter" | "common" | "unknown";
    declension?: "1" | "2" | "3" | "4" | "5" | "unknown";
    conjugation?: "1" | "2" | "3" | "3io" | "4" | "irregular" | "unknown";
    isDeponent?: boolean;
    isIrregular?: boolean;
    comparison?: "positive" | "comparative" | "superlative";
  };
  meanings: { en: string[]; tr?: string[]; shortEn?: string; shortTr?: string };
  frequency: { rank?: number; count?: number; band: FrequencyBand };
  pedagogy: {
    estimatedLevel: LexicalLevel;
    priority: number;
    teachAfterGrammarIds: string[];
    usefulChapterIds: string[];
    tags: string[];
    exampleDifficulty?: "easy" | "medium" | "hard";
  };
  forms: LexicalForm[];
  source: {
    type: "frequency-dictionary" | "app-core" | "manual" | "generated";
    sourceName?: string;
    importedAt?: string;
    sourceRank?: number;
    confidence: number;
  };
  quality: { parseConfidence: number; warnings: string[]; needsReview: boolean };
};

export type LexicalLookupResult = {
  query: string;
  normalizedQuery: string;
  exactLemmaMatches: LexicalEntry[];
  formMatches: Array<{ entry: LexicalEntry; form: LexicalForm }>;
  fuzzyMatches: LexicalEntry[];
  best?: { entry: LexicalEntry; form?: LexicalForm; confidence: number; reason: string };
};

export type RawLexicalEntry = {
  rawHeadword: string;
  rawGrammar?: string;
  rawMeaning: string;
  rawFrequency?: string;
  rawLines: string[];
  sourceIndex: number;
  parseConfidence: number;
  warnings: string[];
};

export type EpubExtractionResult = {
  sourcePath: string;
  files: Array<{ path: string; lineCount: number; lines: string[] }>;
  allLines: string[];
  warnings: string[];
};

export type LexicalImportReport = {
  importedAt: string;
  sourcePath: string;
  rawEntryCount: number;
  normalizedEntryCount: number;
  formCount: number;
  insertedCount: number;
  updatedCount: number;
  skippedCount: number;
  duplicateCount: number;
  posCounts: Record<string, number>;
  levelCounts: Record<string, number>;
  frequencyBandCounts: Record<string, number>;
  confidenceAverage: number;
  warnings: string[];
  errors: string[];
  sampleEntries: LexicalEntry[];
  wroteDb: boolean;
  wroteJson: boolean;
};

export type LexicalIndex = {
  builtAt: string;
  entryCount: number;
  formCount: number;
  lemmaIndex: Record<string, string[]>;
  formIndex: Record<string, Array<{ entryId: string; form: LexicalForm }>>;
  frequencyIndex: Record<string, string[]>;
};
