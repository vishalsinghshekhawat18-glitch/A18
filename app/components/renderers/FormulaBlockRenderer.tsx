import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { FormulaBlock } from '../../../schema/knowledge-item';

interface Props {
  block: FormulaBlock;
}

export const FormulaBlockRenderer: React.FC<Props> = ({ block }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(block.latex, containerRef.current, {
          displayMode: true,
          throwOnError: false
        });
      } catch (e) {
        if (containerRef.current) {
          containerRef.current.textContent = block.latex;
        }
      }
    }
  }, [block.latex]);

  return (
    <div className="block-formula block-margin">
      <div ref={containerRef} className="formula-katex" />
      {block.caption && <div className="formula-caption">{block.caption}</div>}
      {block.explanation && <div className="formula-explanation">{block.explanation}</div>}
    </div>
  );
};
