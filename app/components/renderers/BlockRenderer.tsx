import React from 'react';
import { SemanticBlock } from '../../../schema/knowledge-item';
import { FormulaBlockRenderer } from './FormulaBlockRenderer';
import { WorkedExampleBlockRenderer } from './WorkedExampleBlockRenderer';

interface Props {
  block: SemanticBlock;
}

export const BlockRenderer: React.FC<Props> = ({ block }) => {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
      return <Tag className="block-heading">{block.text}</Tag>;
    }
    case 'paragraph': {
      return <p className="block-paragraph">{block.content}</p>;
    }
    case 'bullet_list': {
      return (
        <ul className="block-list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }
    case 'numbered_list': {
      return (
        <ol className="block-list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
    }
    case 'table':
    case 'comparison': {
      return (
        <div className="block-table-container">
          {'title' in block && block.title && (
            <div style={{ fontWeight: 'bold', marginBottom: '0.4rem', fontFamily: 'var(--font-ui)' }}>
              {block.title}
            </div>
          )}
          <table className="table-custom">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{cell}</td>
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
      return <FormulaBlockRenderer block={block} />;
    }
    case 'worked_example': {
      return <WorkedExampleBlockRenderer block={block} />;
    }
    case 'exam_trap': {
      return (
        <div className="block-exam-trap">
          <div className="exam-trap-header">
            ⚠️ {block.title || 'Exam Trap / Common Misconception'}
          </div>
          <div>{block.content}</div>
          {block.trapDetails && (
            <div className="exam-trap-details">{block.trapDetails}</div>
          )}
        </div>
      );
    }
    case 'key_concept': {
      return (
        <div className="block-key-concept">
          <div className="key-concept-title">💡 {block.title}</div>
          <div style={{ fontWeight: 500 }}>{block.summary}</div>
          {block.details && block.details.length > 0 && (
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', fontSize: '0.95rem' }}>
              {block.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    case 'statistic': {
      return (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {block.metric}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-accent)' }}>
              {block.value} {block.unit && <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>({block.unit})</span>}
            </div>
            {block.context && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{block.context}</div>}
          </div>
          {block.date && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{block.date}</div>}
        </div>
      );
    }
    case 'timeline': {
      return (
        <div className="block-timeline">
          {block.title && <div style={{ fontWeight: 'bold', marginBottom: '0.8rem' }}>{block.title}</div>}
          {block.events.map((ev, idx) => (
            <div key={idx} className="timeline-event">
              <div className="timeline-date">{ev.date}</div>
              <div className="timeline-title">{ev.title}</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{ev.description}</div>
            </div>
          ))}
        </div>
      );
    }
    case 'quote': {
      return (
        <blockquote style={{
          borderLeft: '4px solid var(--border-strong)',
          paddingLeft: '1rem',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          margin: '1.5rem 0'
        }}>
          "{block.quote}"
          {block.author && <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginTop: '0.4rem', fontStyle: 'normal' }}>— {block.author}</div>}
        </blockquote>
      );
    }
    default:
      return null;
  }
};
