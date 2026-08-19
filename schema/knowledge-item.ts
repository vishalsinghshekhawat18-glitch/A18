export type Domain = 
  | 'polity' 
  | 'economics' 
  | 'english'
  | 'history' 
  | 'geography' 
  | 'science' 
  | 'revision' 
  | 'current-affairs' 
  | 'static-ga' 
  | 'quant' 
  | 'pyqs'
  | 'schemes'
  | 'iibf-regulations';

export type ItemType = 'chapter' | 'ca_note' | 'static_note' | 'quant_topic' | 'pyq_item';

export type BlockType = 
  | 'heading'
  | 'paragraph'
  | 'bullet_list'
  | 'numbered_list'
  | 'table'
  | 'comparison'
  | 'formula'
  | 'worked_example'
  | 'exam_trap'
  | 'key_concept'
  | 'definition'
  | 'timeline'
  | 'statistic'
  | 'source_note'
  | 'related_knowledge'
  | 'quote'
  | 'image';

export type RelationshipType =
  | 'prerequisite'
  | 'related'
  | 'explains'
  | 'updated_by'
  | 'current_affairs_of'
  | 'has_pyq'
  | 'revision_of'
  | 'contrasts_with';

export interface Relationship {
  type: RelationshipType;
  targetId: string;
  label?: string;
}

export interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4;
  text: string;
}

export interface ParagraphBlock {
  type: 'paragraph';
  content: string;
}

export interface BulletListBlock {
  type: 'bullet_list';
  items: string[];
}

export interface NumberedListBlock {
  type: 'numbered_list';
  items: string[];
}

export interface TableBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface ComparisonBlock {
  type: 'comparison';
  title?: string;
  headers: string[];
  rows: string[][];
}

export interface FormulaBlock {
  type: 'formula';
  latex: string;
  caption?: string;
  explanation?: string;
}

export interface WorkedExampleStep {
  stepNumber: number;
  title?: string;
  explanation: string;
  latex?: string;
}

export interface WorkedExampleBlock {
  type: 'worked_example';
  title: string;
  question: string;
  given?: string[];
  method: string;
  steps: WorkedExampleStep[];
  answer: string;
}

export interface ExamTrapBlock {
  type: 'exam_trap';
  title?: string;
  content: string;
  trapDetails?: string;
}

export interface KeyConceptBlock {
  type: 'key_concept';
  title: string;
  summary: string;
  details?: string[];
}

export interface DefinitionBlock {
  type: 'definition';
  term: string;
  definition: string;
  context?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface TimelineBlock {
  type: 'timeline';
  title?: string;
  events: TimelineEvent[];
}

export interface StatisticBlock {
  type: 'statistic';
  metric: string;
  value: string;
  unit?: string;
  context?: string;
  date?: string;
}

export interface SourceNoteBlock {
  type: 'source_note';
  source: string;
  date?: string;
  url?: string;
}

export interface RelatedKnowledgeBlock {
  type: 'related_knowledge';
  items: { id: string; title: string; domain?: Domain }[];
}

export interface QuoteBlock {
  type: 'quote';
  quote: string;
  author?: string;
}

export interface ImageBlock {
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
}

export type SemanticBlock =
  | HeadingBlock
  | ParagraphBlock
  | BulletListBlock
  | NumberedListBlock
  | TableBlock
  | ComparisonBlock
  | FormulaBlock
  | WorkedExampleBlock
  | ExamTrapBlock
  | KeyConceptBlock
  | DefinitionBlock
  | TimelineBlock
  | StatisticBlock
  | SourceNoteBlock
  | RelatedKnowledgeBlock
  | QuoteBlock
  | ImageBlock;

export interface MigrationProvenance {
  sourceSystem: 'Core' | 'CA' | 'StaticGA' | 'Quant' | 'Schemes' | 'PYQs';
  sourceFile: string;
  sourceId: string;
  sourceTitle: string;
  sourceChecksum: string;
  migrationTimestamp: string;
  normalizationRuleVersion: string;
}

export interface Metadata {
  exam?: string[];
  tags?: string[];
  date?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  lastUpdated?: string;
  part?: string;
  section?: string;
  provenance?: MigrationProvenance;
}

export interface KnowledgeItem {
  id: string;
  type: ItemType;
  domain: Domain;
  title: string;
  summary?: string;
  blocks: SemanticBlock[];
  metadata?: Metadata;
  relationships?: Relationship[];
}
