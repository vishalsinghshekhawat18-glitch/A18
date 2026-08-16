import React from 'react';
import { KnowledgeItem, WorkedExampleBlock } from '../../../schema/knowledge-item';
import { BlockRenderer } from '../../components/renderers/BlockRenderer';
import { RelationshipLinks } from '../RelationshipLinks';
import { InPageTOCMobile, InPageTOCDesktop } from '../InPageTOC';
import { formatInlineText } from '../../components/renderers/formatInline';

interface Props {
  item: KnowledgeItem;
  allItems: KnowledgeItem[];
  fontSize: number;
  onNavigateItem: (id: string) => void;
}

export const PYQPracticeView: React.FC<Props> = ({
  item,
  allItems,
  fontSize,
  onNavigateItem
}) => {
  const workedExamples = item.blocks.filter(b => b.type === 'worked_example') as WorkedExampleBlock[];
  const genericBlocks = item.blocks.filter(b => b.type !== 'worked_example');

  const examBadges = item.metadata?.exam || ['RBI Grade B', 'SBI PO', 'IBPS PO'];

  return (
    <div className="layout-pyq-practice">
      <div className="pyq-grid-container" style={{ fontSize: `${fontSize}px` }}>
        <main className="pyq-main-content">
          {/* Top PYQ Header Banner with Prominent Exam Badges */}
          <header className="pyq-header">
            <div className="pyq-badge-row">
              <span className="pyq-domain-badge">🎓 PREVIOUS YEAR QUESTION PRACTICE</span>
              {examBadges.map((e: string) => (
                <span key={e} className="tag-pill bold-pill">🎓 {e}</span>
              ))}
            </div>

            <h1 className="pyq-title">{item.title}</h1>

            {item.summary && (
              <div className="pyq-summary-card">
                <span className="pyq-summary-label">QUESTION SET OBJECTIVE:</span> {formatInlineText(item.summary)}
              </div>
            )}
          </header>

          {/* Mobile In-Page TOC */}
          <InPageTOCMobile blocks={item.blocks} />

          {/* Question-First Practice Cards */}
          {workedExamples.length > 0 && (
            <div className="pyq-worked-examples-list">
              <div className="pyq-section-header">❓ MEMORY PRACTICE QUESTIONS & SOLUTIONS</div>
              {workedExamples.map((we, idx) => (
                <div key={idx} className="pyq-worked-card">
                  {/* Prominent Question Prompt Box */}
                  <div className="pyq-question-card">
                    <div className="pyq-question-badge">❓ QUESTION PROMPT #{idx + 1}</div>
                    <div className="pyq-question-text">
                      {formatInlineText(we.question)}
                    </div>
                  </div>

                  {/* Solution Strategy & Parameters */}
                  {we.method && (
                    <div className="pyq-method-box">
                      <div className="pyq-section-label">💡 STRATEGY & EXAM APPROACH</div>
                      <div className="pyq-method-text">{formatInlineText(we.method)}</div>
                    </div>
                  )}

                  {/* Step-by-Step Working */}
                  {we.steps && we.steps.length > 0 && (
                    <div className="pyq-steps-container">
                      <div className="pyq-section-label">📝 STEP-BY-STEP WORKING</div>
                      {we.steps.map((step) => (
                        <div key={step.stepNumber} className="pyq-step-card">
                          <div className="pyq-step-header">
                            STEP {step.stepNumber}{step.title ? `: ${step.title}` : ''}
                          </div>
                          <div className="pyq-step-explanation">{formatInlineText(step.explanation)}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kindle Warm-Paper Final Answer Box */}
                  {we.answer && (
                    <div className="worked-example-answer-kindle">
                      <span className="answer-label">FINAL EXAM ANSWER:</span> {formatInlineText(we.answer)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Generic Blocks */}
          {genericBlocks.length > 0 && (
            <div className="pyq-generic-blocks">
              <div className="pyq-section-header">📜 PRACTICE BACKGROUND & NOTES</div>
              {genericBlocks.map((block, idx) => (
                <BlockRenderer key={idx} block={block} blockIndex={idx} />
              ))}
            </div>
          )}

          <RelationshipLinks
            relationships={item.relationships}
            allItems={allItems}
            onNavigate={onNavigateItem}
          />
        </main>

        {/* Desktop Sticky In-Page TOC Pane */}
        <aside className="pyq-toc-aside">
          <InPageTOCDesktop blocks={item.blocks} />
        </aside>
      </div>
    </div>
  );
};
