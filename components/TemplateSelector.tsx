import React from 'react';
import { POETIC_FORMS, SAMPLE_POEMS } from '../constants';
import { PoeticForm, SamplePoem } from '../types';
import { BookOpen, ChevronRight, Library } from 'lucide-react';

interface TemplateSelectorProps {
  onSelect: (template: PoeticForm) => void;
  onSelectSample: (sample: SamplePoem) => void;
  selectedId: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, onSelectSample, selectedId }) => {
  return (
    <div className="space-y-8">
      {/* Forms Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookOpen size={14} />
          Select Form
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {POETIC_FORMS.map((form) => (
            <button
              key={form.id}
              onClick={() => onSelect(form)}
              className={`group text-left p-4 rounded-xl transition-all duration-200 border ${
                selectedId === form.id
                  ? 'bg-white border-accent shadow-md ring-1 ring-accent/20'
                  : 'bg-white/50 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`font-medium ${selectedId === form.id ? 'text-gray-900' : 'text-gray-700'}`}>
                  {form.name}
                </span>
                {selectedId === form.id && <ChevronRight size={16} className="text-accent" />}
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {form.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Samples Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Library size={14} />
          Load Sample
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {SAMPLE_POEMS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="group text-left p-3 rounded-lg border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200 flex flex-col items-start"
            >
              <div className="w-full flex justify-between items-center">
                <span className="text-sm font-medium text-ink">{sample.title}</span>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{sample.author}</span>
              </div>
              <span className="text-xs text-gray-500 mt-1">{sample.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;