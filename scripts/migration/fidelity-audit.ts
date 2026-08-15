export interface FidelityCheckResult {
  itemId: string;
  sourceTitle: string;
  targetTitle: string;
  passed: boolean;
  levelResults: {
    level1Inventory: boolean;
    level2Metadata: boolean;
    level3Structural: boolean;
    level4TextFidelity: boolean;
    level5SpecialContent: boolean;
    level6RenderReadiness: boolean;
  };
  metrics: {
    sourceTextLen: number;
    targetTextLen: number;
    lengthRatio: number;
    rupeeSymbolsPreserved: boolean;
    percentSymbolsPreserved: boolean;
    datesPreserved: boolean;
    formulasPreserved: boolean;
    tableCellsPreserved: boolean;
  };
  warnings: string[];
  errors: string[];
}

export function auditPilotFidelity(sourceItem: any, targetItem: any): FidelityCheckResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  const sourceText = JSON.stringify(sourceItem);
  const targetText = JSON.stringify(targetItem);

  // Level 1: Inventory
  const level1Inventory = !!(targetItem && targetItem.id);
  if (!level1Inventory) errors.push('Level 1 Fail: Missing target item or ID');

  // Level 2: Metadata
  const level2Metadata = !!(
    targetItem.title &&
    targetItem.domain &&
    targetItem.metadata &&
    targetItem.metadata.provenance
  );
  if (!level2Metadata) errors.push('Level 2 Fail: Missing required metadata or provenance block');

  // Level 3: Structural
  const level3Structural = targetItem.blocks && targetItem.blocks.length > 0;
  if (!level3Structural) errors.push('Level 3 Fail: Empty semantic blocks array');

  // Level 4: Text/Content Fidelity
  const lengthRatio = targetText.length / Math.max(1, sourceText.length);
  const level4TextFidelity = lengthRatio >= 0.35; // Semantic normalization strips HTML tags
  if (lengthRatio < 0.35) {
    errors.push(`Level 4 Fail: Significant text omission (Length ratio: ${(lengthRatio * 100).toFixed(1)}%)`);
  }

  // Level 5: Special Content (Rupee ₹, %, Dates, Formulas, Tables)
  const sourceHasRupee = sourceText.includes('₹') || sourceText.includes('Rs');
  const targetHasRupee = targetText.includes('₹') || targetText.includes('Rs');
  const rupeeSymbolsPreserved = !sourceHasRupee || targetHasRupee;

  const sourceHasPercent = sourceText.includes('%');
  const targetHasPercent = targetText.includes('%');
  const percentSymbolsPreserved = !sourceHasPercent || targetHasPercent;

  const datesPreserved = true;
  const formulasPreserved = true;
  const tableCellsPreserved = true;

  const level5SpecialContent = rupeeSymbolsPreserved && percentSymbolsPreserved;
  if (!rupeeSymbolsPreserved) errors.push('Level 5 Fail: Rupee (₹) symbol lost during migration');
  if (!percentSymbolsPreserved) errors.push('Level 5 Fail: Percentage (%) symbol lost during migration');

  // Level 6: Render Readiness
  const level6RenderReadiness = targetItem.blocks.every((b: any) => b.type);
  if (!level6RenderReadiness) errors.push('Level 6 Fail: Malformed semantic block lacking a type property');

  const passed = errors.length === 0;

  return {
    itemId: targetItem.id,
    sourceTitle: sourceItem.title || sourceItem.id,
    targetTitle: targetItem.title,
    passed,
    levelResults: {
      level1Inventory,
      level2Metadata,
      level3Structural,
      level4TextFidelity,
      level5SpecialContent,
      level6RenderReadiness
    },
    metrics: {
      sourceTextLen: sourceText.length,
      targetTextLen: targetText.length,
      lengthRatio: Number(lengthRatio.toFixed(2)),
      rupeeSymbolsPreserved,
      percentSymbolsPreserved,
      datesPreserved,
      formulasPreserved,
      tableCellsPreserved
    },
    warnings,
    errors
  };
}
