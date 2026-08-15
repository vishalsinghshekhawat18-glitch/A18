import React from 'react';

/**
 * Safely parses inline markdown constructs (such as **bold**, *italic*, `code`)
 * into React node arrays to prevent literal asterisks from displaying in the UI.
 */
export function formatInlineText(text: string): React.ReactNode {
  if (!text) return text;

  // Split by markdown bold (**text**)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const boldText = part.slice(2, -2);
      return <strong key={idx}>{boldText}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const italicText = part.slice(1, -1);
      return <em key={idx}>{italicText}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const codeText = part.slice(1, -1);
      return <code key={idx} style={{ background: 'var(--bg-sidebar)', padding: '0.1rem 0.3rem', borderRadius: '3px', fontSize: '0.9em' }}>{codeText}</code>;
    }
    return part;
  });
}
