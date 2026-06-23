export function buildExactSuccessFeedback(answer: string): string {
  return "Tebrikler! Doğru cevap.";
}

export function buildSimilaritySuccessFeedback(playerAnswer: string, expectedAnswer: string, score: number): string {
  return `Küçük yazım farkı var ama cevap doğru kabul edildi. Doğru yazılışı: "${expectedAnswer}"`;
}

export function buildNearMissFeedback(playerAnswer: string, expectedAnswer: string, score: number): string {
  return `Cevap yakın ama tam doğru değil. Şunu mu demek istedin: "${expectedAnswer}"?`;
}

export function buildFallbackFeedback(expectedAnswer: string): string {
  return `Cevap beklenen biçimle eşleşmedi. Tekrar deneyebilirsin. Beklenen cevaplardan biri: "${expectedAnswer}"`;
}
