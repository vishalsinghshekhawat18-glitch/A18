/**
 * Pure Deterministic Temporal Status Intelligence Engine (Component-Aware)
 * Distinguishes historical factual validity from current operational status at both
 * item-level and granular component-level as of a reference date.
 */

export type TemporalStatus =
  | 'CURRENT'
  | 'HISTORICAL'
  | 'EXPIRED'
  | 'SUPERSEDED'
  | 'EXTENDED'
  | 'MIXED'
  | 'UNCLEAR';

export type ComponentType =
  | 'scheme'
  | 'component'
  | 'mission'
  | 'campaign'
  | 'financial-cycle';

export interface TemporalComponent {
  name: string;
  type: ComponentType;
  startDate?: string;
  endDate?: string;
  status: 'CURRENT' | 'EXPIRED' | 'EXTENDED' | 'HISTORICAL' | 'UNCLEAR';
  evidence: string[];
  lastVerified: string;
  historicalExamRelevance?: string;
}

export interface TemporalEvaluationInput {
  launchDate?: string;
  schemePeriodStart?: string;
  schemePeriodEnd?: string;
  hasVerifiedExtension?: boolean;
  extendedUntil?: string;
  latestOfficialSourceDate?: string;
  isOpenEndedStatutory?: boolean;
  statusEvidence?: string[];
  referenceDate?: string; // Default: '2026-08-18'
  components?: TemporalComponent[];
}

export interface TemporalEvaluationResult {
  statusAsOf: string;
  status: TemporalStatus;
  launchDate?: string;
  schemePeriodStart?: string;
  schemePeriodEnd?: string;
  extendedUntil?: string;
  statusEvidence: string[];
  lastVerified: string;
  components: TemporalComponent[];
  temporalWarning?: string;
  reason: string;
}

/**
 * Deterministically derives overall temporal status from a set of granular components
 */
export function deriveOverallTemporalStatus(components: TemporalComponent[]): TemporalStatus {
  if (!components || components.length === 0) {
    return 'UNCLEAR';
  }

  const statuses = new Set(components.map(c => c.status));

  if (statuses.has('UNCLEAR') && statuses.size === 1) {
    return 'UNCLEAR';
  }

  const hasCurrent = statuses.has('CURRENT') || statuses.has('EXTENDED');
  const hasExpired = statuses.has('EXPIRED') || statuses.has('HISTORICAL');

  if (hasCurrent && hasExpired) {
    return 'MIXED';
  }

  if (hasCurrent && !hasExpired) {
    return statuses.has('EXTENDED') && !statuses.has('CURRENT') ? 'EXTENDED' : 'CURRENT';
  }

  if (hasExpired && !hasCurrent) {
    return 'EXPIRED';
  }

  return 'UNCLEAR';
}

/**
 * Evaluates the temporal state of a scheme or claim deterministically
 */
export function evaluateTemporalStatus(input: TemporalEvaluationInput): TemporalEvaluationResult {
  const referenceDateStr = input.referenceDate || '2026-08-18';
  const refDate = new Date(referenceDateStr);
  const statusEvidence = input.statusEvidence || [];
  const lastVerified = input.latestOfficialSourceDate || referenceDateStr;
  const components = input.components || [];

  // If granular components are provided, derive from component architecture
  if (components.length > 0) {
    const derivedStatus = deriveOverallTemporalStatus(components);
    let temporalWarning: string | undefined;

    if (derivedStatus === 'MIXED') {
      const expiredParts = components.filter(c => c.status === 'EXPIRED').map(c => c.name);
      const activeParts = components.filter(c => c.status === 'CURRENT' || c.status === 'EXTENDED').map(c => c.name);
      temporalWarning = `Component Temporal Delineation: Financial allocation/cycle concluded for [${expiredParts.join(', ')}], while operations/campaign continues under [${activeParts.join(', ')}].`;
    } else if (derivedStatus === 'EXPIRED') {
      temporalWarning = `All documented components concluded on or before ${referenceDateStr}. Factual data represents the historical verified operational cycle.`;
    }

    return {
      statusAsOf: referenceDateStr,
      status: derivedStatus,
      launchDate: input.launchDate,
      schemePeriodStart: input.schemePeriodStart,
      schemePeriodEnd: input.schemePeriodEnd,
      extendedUntil: input.extendedUntil,
      statusEvidence,
      lastVerified,
      components,
      temporalWarning,
      reason: `Derived from ${components.length} granular temporal components.`
    };
  }

  // Fallback to item-level evaluation if no components provided
  if (input.hasVerifiedExtension && input.extendedUntil) {
    const extDate = new Date(input.extendedUntil);
    if (extDate >= refDate) {
      return {
        statusAsOf: referenceDateStr,
        status: 'EXTENDED',
        launchDate: input.launchDate,
        schemePeriodStart: input.schemePeriodStart,
        schemePeriodEnd: input.schemePeriodEnd,
        extendedUntil: input.extendedUntil,
        statusEvidence,
        lastVerified,
        components: [],
        temporalWarning: `Scheme was extended beyond original period until ${input.extendedUntil}.`,
        reason: `Explicitly extended until ${input.extendedUntil} which is on or after reference date ${referenceDateStr}.`
      };
    }
  }

  if (input.schemePeriodEnd) {
    const endDate = new Date(input.schemePeriodEnd);

    if (endDate < refDate) {
      return {
        statusAsOf: referenceDateStr,
        status: 'EXPIRED',
        launchDate: input.launchDate,
        schemePeriodStart: input.schemePeriodStart,
        schemePeriodEnd: input.schemePeriodEnd,
        statusEvidence,
        lastVerified,
        components: [],
        temporalWarning: `Documented operational period (${input.schemePeriodStart || 'Start'} to ${input.schemePeriodEnd}) ended on ${input.schemePeriodEnd}. Renewal under 16th Finance Commission cycle pending official gazette verification.`,
        reason: `Documented end date ${input.schemePeriodEnd} is strictly before reference date ${referenceDateStr}.`
      };
    }

    if (endDate >= refDate) {
      return {
        statusAsOf: referenceDateStr,
        status: 'CURRENT',
        launchDate: input.launchDate,
        schemePeriodStart: input.schemePeriodStart,
        schemePeriodEnd: input.schemePeriodEnd,
        statusEvidence,
        lastVerified,
        components: [],
        reason: `Documented operational end date ${input.schemePeriodEnd} is on or after reference date ${referenceDateStr}.`
      };
    }
  }

  if (input.isOpenEndedStatutory) {
    return {
      statusAsOf: referenceDateStr,
      status: 'CURRENT',
      launchDate: input.launchDate,
      schemePeriodStart: input.schemePeriodStart,
      statusEvidence,
      lastVerified,
      components: [],
      reason: 'Statutory open-ended mandate with active institutional operations.'
    };
  }

  return {
    statusAsOf: referenceDateStr,
    status: 'UNCLEAR',
    launchDate: input.launchDate,
    schemePeriodStart: input.schemePeriodStart,
    statusEvidence,
    lastVerified,
    components: [],
    temporalWarning: 'Operational end date or continuation guidelines past 31 March 2026 not officially documented.',
    reason: `Lacks explicit valid period end date or post-2026 continuation evidence as of ${referenceDateStr}.`
  };
}
