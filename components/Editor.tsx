import React, { useRef, useEffect } from 'react';
import { PoeticForm } from '../types';
import { validateLine, getRuleSummary } from '../utils/validation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  selectedForm: PoeticForm;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, placeholder, selectedForm }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and gutter
  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Prepare lines for validation
  const lines = value.split('\n');
  const lineCount = lines.length;
  // Ensure we render enough gutter lines even if text is short
  const minLines = Math.max(lineCount, 15);
  const renderLines = Array.from({ length: minLines }, (_, i) => lines[i] || "");

  return (
    <div className="relative w-full h-full flex flex-col bg-paper rounded-lg shadow-sm border border-stone-200 overflow-hidden">
      
      {/* Rule Margin (Top Right) */}
      <div className="absolute top-2 right-2 md:top-4 md:right-8 z-10 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
        <div className="bg-stone-100/80 backdrop-blur-sm p-2 px-3 rounded text-[10px] md:text-xs font-medium text-stone-500 border border-stone-200 shadow-sm uppercase tracking-wider">
           {getRuleSummary(selectedForm.id)}
        </div>
      </div>

      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Validation Gutter */}
        <div 
          ref={gutterRef}
          className="w-16 md:w-20 bg-stone-50 border-r border-stone-200 pt-8 md:pt-12 pb-8 flex-shrink-0 overflow-hidden select-none text-right font-mono text-xs"
        >
          {renderLines.map((line, i) => {
            const validation = validateLine(selectedForm.id, line, i);
            const showValidation = line.length > 0 && selectedForm.id !== 'free_verse';
            
            return (
              <div 
                key={i} 
                className="h-10 flex items-center justify-end px-2 gap-1.5"
                style={{ lineHeight: '2.5rem' }}
              >
                {showValidation && (
                  <>
                    <span className={`opacity-60 ${validation.isError ? 'text-red-500 font-bold' : 'text-stone-400'}`}>
                      {validation.message}
                    </span>
                    {validation.isError ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" title="Does not match structure" />
                    ) : (
                       validation.isValid && <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    )}
                  </>
                )}
                <span className="text-stone-300 w-4">{i + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative h-full">
           {/* Lined Background Effect */}
           <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px)',
              backgroundSize: '100% 2.5rem', // 40px - matches leading-10
              marginTop: '3.5rem' // 12 (padding-top 3rem) + extra offset to align with text baseline roughly
            }}
          />

          <textarea
            ref={textareaRef}
            onScroll={handleScroll}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-8 md:p-12 pl-4 md:pl-6 resize-none bg-transparent border-none focus:ring-0 text-lg md:text-xl font-serif text-ink leading-10 placeholder-stone-300 outline-none whitespace-pre"
            placeholder={placeholder || "Start writing your masterpiece..."}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex justify-between">
        <span>{lines.length} lines</span>
        <span>{value.length} chars</span>
      </div>
    </div>
  );
};

export default Editor;