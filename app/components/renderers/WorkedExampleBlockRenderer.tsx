import React from 'react';
import { WorkedExampleBlock } from '../../../schema/knowledge-item';
import { FormulaBlockRenderer } from './FormulaBlockRenderer';

interface Props {
  block: WorkedExampleBlock;
}

export const WorkedExampleBlockRenderer: React.FC<Props> = ({ block }) => {
  return (
    <div className="block-worked-example block-margin">
      <div className="worked-example-header">
        📐 {block.title}
      </div>

      <div className="worked-example-section-title">Question</div>
      <div className="worked-example-question">
        {block.question}
      </div>

      {block.given && block.given.length > 0 && (
        <>
          <div className="worked-example-section-title">Given Parameters</div>
          <ul className="worked-example-given">
            {block.given.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </>
      )}

      <div className="worked-example-section-title">Solution Method</div>
      <p className="block-paragraph" style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
        {block.method}
      </p>

      <div className="worked-example-section-title">Step-by-Step Working</div>
      <div style={{ marginTop: '0.5rem' }}>
        {block.steps.map((step) => (
          <div key={step.stepNumber} className="worked-example-step">
            <div className="step-number">Step {step.stepNumber}{step.title ? `: ${step.title}` : ''}</div>
            <p style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}>{step.explanation}</p>
            {step.latex && (
              <FormulaBlockRenderer block={{ type: 'formula', latex: step.latex }} />
            )}
          </div>
        ))}
      </div>

      {/* Kindle Warm-Paper Answer Treatment (Zero Green, Zero Accordion, 100% Explicit) */}
      <div className="worked-example-answer-kindle">
        <span className="answer-label">FINAL ANSWER:</span> {block.answer}
      </div>
    </div>
  );
};
