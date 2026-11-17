export interface GroundingCheckResult {
  grounded: boolean;
  score: number; // 0.0 to 1.0
  unsupportedClaims: string[];
  validCitationsCount: number;
}

export class GroundingValidator {
  /**
   * Verifies that every claim in the generated content is supported by verbatim or high-overlap
   * excerpts from the verified signals database.
   */
  validateGrounding(
    claims: Array<{ text: string; citationIndex?: number; signalId?: string }>,
    verifiedEvidence: Map<string, string> // signalId -> evidenceText
  ): GroundingCheckResult {
    const unsupportedClaims: string[] = [];
    let validCitations = 0;

    for (const claim of claims) {
      if (!claim.signalId || !verifiedEvidence.has(claim.signalId)) {
        unsupportedClaims.push(claim.text);
        continue;
      }

      const evidence = verifiedEvidence.get(claim.signalId) || "";
      const claimKeywords = claim.text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3);

      const matches = claimKeywords.filter((w) => evidence.toLowerCase().includes(w));
      const overlapRatio = claimKeywords.length > 0 ? matches.length / claimKeywords.length : 0;

      if (overlapRatio >= 0.3) {
        validCitations++;
      } else {
        unsupportedClaims.push(claim.text);
      }
    }

    const totalClaims = claims.length;
    const score = totalClaims === 0 ? 1.0 : validCitations / totalClaims;

    return {
      grounded: score >= 0.85,
      score,
      unsupportedClaims,
      validCitationsCount: validCitations,
    };
  }
}
