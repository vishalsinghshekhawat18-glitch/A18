import React from 'react';
import { SemanticBlock } from '../../../schema/knowledge-item';
import { FormulaBlockRenderer } from './FormulaBlockRenderer';
import { WorkedExampleBlockRenderer } from './WorkedExampleBlockRenderer';
import { formatInlineText } from './formatInline';

interface Props {
  block: SemanticBlock;
  blockIndex?: number;
}

export const BlockRenderer: React.FC<Props> = ({ block, blockIndex = 0 }) => {
  const blockId = `block-${blockIndex}`;

  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
      return <Tag id={blockId} className="block-heading">{formatInlineText(block.text)}</Tag>;
    }
    case 'paragraph': {
      return <p className="block-paragraph">{formatInlineText(block.content)}</p>;
    }
    case 'bullet_list': {
      return (
        <ul className="block-list">
          {block.items.map((item, i) => (
            <li key={i}>{formatInlineText(item)}</li>
          ))}
        </ul>
      );
    }
    case 'numbered_list': {
      return (
        <ol className="block-list">
          {block.items.map((item, i) => (
            <li key={i}>{formatInlineText(item)}</li>
          ))}
        </ol>
      );
    }
    case 'table':
    case 'comparison': {
      return (
        <div id={blockId} className="block-table-container">
          {'title' in block && block.title && (
            <div style={{ fontWeight: 'bold', marginBottom: '0.4rem', fontFamily: 'var(--font-ui)' }}>
              {formatInlineText(block.title)}
            </div>
          )}
          <table className="table-custom">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}>{formatInlineText(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{formatInlineText(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {'caption' in block && block.caption && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              {block.caption}
            </div>
          )}
        </div>
      );
    }
    case 'formula': {
      return <div id={blockId}><FormulaBlockRenderer block={block} /></div>;
    }
    case 'worked_example': {
      return <div id={blockId}><WorkedExampleBlockRenderer block={block} /></div>;
    }
    case 'exam_trap': {
      return (
        <div id={blockId} className="block-exam-trap block-annotation-compact">
          <div className="annotation-icon">⚠️</div>
          <div className="annotation-content">
            {block.title && <span className="annotation-title">{formatInlineText(block.title)}: </span>}
            <span>{formatInlineText(block.content)}</span>
            {block.trapDetails && (
              <div className="exam-trap-details">{formatInlineText(block.trapDetails)}</div>
            )}
          </div>
        </div>
      );
    }
    case 'key_concept': {
      return (
        <div id={blockId} className="block-key-concept block-annotation-compact">
          <div className="annotation-icon">💡</div>
          <div className="annotation-content">
            {block.title && <span className="annotation-title">{formatInlineText(block.title)}: </span>}
            <span>{formatInlineText(block.summary)}</span>
            {block.details && block.details.length > 0 && (
              <ul className="annotation-details-list">
                {block.details.map((d, i) => (
                  <li key={i}>{formatInlineText(d)}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    }
    case 'statistic': {
      return (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          padding: '0.8rem 1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {block.metric}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-accent)' }}>
              {block.value} {block.unit && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>({block.unit})</span>}
            </div>
            {block.context && <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{block.context}</div>}
          </div>
          {block.date && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{block.date}</div>}
        </div>
      );
    }
    case 'timeline': {
      return (
        <div className="block-timeline">
          {block.title && <div style={{ fontWeight: 'bold', marginBottom: '0.6rem' }}>{block.title}</div>}
          {block.events.map((ev, idx) => (
            <div key={idx} className="timeline-event">
              <div className="timeline-date">{ev.date}</div>
              <div className="timeline-title">{ev.title}</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{ev.description}</div>
            </div>
          ))}
        </div>
      );
    }
    case 'quote': {
      return (
        <div id={blockId} className="block-quote block-annotation-compact">
          <div className="annotation-icon">❓</div>
          <div className="annotation-content">
            <span className="annotation-quote-text">"{formatInlineText(block.quote)}"</span>
            {block.author && <span className="annotation-author"> — {formatInlineText(block.author)}</span>}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
};
