import { z } from 'zod';

export const DomainSchema = z.enum([
  'polity',
  'economics',
  'history',
  'geography',
  'science',
  'revision',
  'current-affairs',
  'static-ga',
  'quant',
  'pyqs'
]);

export const ItemTypeSchema = z.enum([
  'chapter',
  'ca_note',
  'static_note',
  'quant_topic',
  'pyq_item'
]);

export const RelationshipTypeSchema = z.enum([
  'prerequisite',
  'related',
  'explains',
  'updated_by',
  'current_affairs_of',
  'has_pyq',
  'revision_of',
  'contrasts_with'
]);

export const RelationshipSchema = z.object({
  type: RelationshipTypeSchema,
  targetId: z.string().min(1),
  label: z.string().optional()
});

export const HeadingBlockSchema = z.object({
  type: z.literal('heading'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  text: z.string().min(1)
});

export const ParagraphBlockSchema = z.object({
  type: z.literal('paragraph'),
  content: z.string().min(1)
});

export const BulletListBlockSchema = z.object({
  type: z.literal('bullet_list'),
  items: z.array(z.string().min(1)).min(1)
});

export const NumberedListBlockSchema = z.object({
  type: z.literal('numbered_list'),
  items: z.array(z.string().min(1)).min(1)
});

export const TableBlockSchema = z.object({
  type: z.literal('table'),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  caption: z.string().optional()
});

export const ComparisonBlockSchema = z.object({
  type: z.literal('comparison'),
  title: z.string().optional(),
  headers: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())).min(1)
});

export const FormulaBlockSchema = z.object({
  type: z.literal('formula'),
  latex: z.string().min(1),
  caption: z.string().optional(),
  explanation: z.string().optional()
});

export const WorkedExampleStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  title: z.string().optional(),
  explanation: z.string().min(1),
  latex: z.string().optional()
});

export const WorkedExampleBlockSchema = z.object({
  type: z.literal('worked_example'),
  title: z.string().min(1),
  question: z.string().min(1),
  given: z.array(z.string()).optional(),
  method: z.string().min(1),
  steps: z.array(WorkedExampleStepSchema).min(1),
  answer: z.string().min(1)
});

export const ExamTrapBlockSchema = z.object({
  type: z.literal('exam_trap'),
  title: z.string().optional(),
  content: z.string().min(1),
  trapDetails: z.string().optional()
});

export const KeyConceptBlockSchema = z.object({
  type: z.literal('key_concept'),
  title: z.string().min(1),
  summary: z.string().min(1),
  details: z.array(z.string()).optional()
});

export const DefinitionBlockSchema = z.object({
  type: z.literal('definition'),
  term: z.string().min(1),
  definition: z.string().min(1),
  context: z.string().optional()
});

export const TimelineEventSchema = z.object({
  date: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1)
});

export const TimelineBlockSchema = z.object({
  type: z.literal('timeline'),
  title: z.string().optional(),
  events: z.array(TimelineEventSchema).min(1)
});

export const StatisticBlockSchema = z.object({
  type: z.literal('statistic'),
  metric: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
  context: z.string().optional(),
  date: z.string().optional()
});

export const SourceNoteBlockSchema = z.object({
  type: z.literal('source_note'),
  source: z.string().min(1),
  date: z.string().optional(),
  url: z.string().optional()
});

export const RelatedKnowledgeBlockSchema = z.object({
  type: z.literal('related_knowledge'),
  items: z.array(z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    domain: DomainSchema.optional()
  })).min(1)
});

export const QuoteBlockSchema = z.object({
  type: z.literal('quote'),
  quote: z.string().min(1),
  author: z.string().optional()
});

export const ImageBlockSchema = z.object({
  type: z.literal('image'),
  url: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional()
});

export const SemanticBlockSchema = z.discriminatedUnion('type', [
  HeadingBlockSchema,
  ParagraphBlockSchema,
  BulletListBlockSchema,
  NumberedListBlockSchema,
  TableBlockSchema,
  ComparisonBlockSchema,
  FormulaBlockSchema,
  WorkedExampleBlockSchema,
  ExamTrapBlockSchema,
  KeyConceptBlockSchema,
  DefinitionBlockSchema,
  TimelineBlockSchema,
  StatisticBlockSchema,
  SourceNoteBlockSchema,
  RelatedKnowledgeBlockSchema,
  QuoteBlockSchema,
  ImageBlockSchema
]);

export const MigrationProvenanceSchema = z.object({
  sourceSystem: z.enum(['Core', 'CA', 'StaticGA', 'Quant', 'Schemes']),
  sourceFile: z.string().min(1),
  sourceId: z.string().min(1),
  sourceTitle: z.string().min(1),
  sourceChecksum: z.string().min(1),
  migrationTimestamp: z.string().min(1),
  normalizationRuleVersion: z.string().min(1)
});

export const MetadataSchema = z.object({
  exam: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  date: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  lastUpdated: z.string().optional(),
  provenance: MigrationProvenanceSchema.optional()
});

export const KnowledgeItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'ID must be lower-case alphanumeric with hyphens'),
  type: ItemTypeSchema,
  domain: DomainSchema,
  title: z.string().min(1),
  summary: z.string().optional(),
  blocks: z.array(SemanticBlockSchema).min(1),
  metadata: MetadataSchema.optional(),
  relationships: z.array(RelationshipSchema).optional()
});
