import React from 'react';
import { AnalysisResponse, ReadinessLevel } from '../types';
import { Sparkles, CheckCircle2, AlertCircle, Lightbulb, PenTool, Activity, AlignLeft, Palette, Heart, PartyPopper } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: AnalysisResponse | null;
  isLoading: boolean;
}

const ReadinessBadge: React.FC<{ level: ReadinessLevel; label: string; description: string }> = ({ level, label, description }) => {
  const styles = {
    Red: 'bg-red-50 text-red-700 border-red-200',
    Orange: 'bg-orange-50 text-orange-700 border-orange-200',
    Green: 'bg-green-50 text-green-700 border-green-200'
  };

  const indicatorStyles = {
    Red: 'bg-red-500',
    Orange: 'bg-orange-500',
    Green: 'bg-green-500'
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[level]} flex flex-col gap-2 mb-6 shadow-sm`}>
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${indicatorStyles[level]} animate-pulse`} />
        <span className="text-xs font-bold uppercase tracking-wider opacity-80">Publication Readiness</span>
      </div>
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2">
          {label}
          {level === 'Green' && <PartyPopper size={20} className="text-green-600 animate-bounce" />}
        </h3>
        <p className="text-sm opacity-90 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const QualityIndicator: React.FC<{ label: string; level: ReadinessLevel; icon: React.ReactNode }> = ({ label, level, icon }) => {
   const colors = {
    Red: 'bg-red-500',
    Orange: 'bg-orange-500',
    Green: 'bg-green-500'
  };
  
  const bgColors = {
    Red: 'bg-red-100',
    Orange: 'bg-orange-100',
    Green: 'bg-green-100'
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100">
      <div className={`p-2 rounded-md ${bgColors[level]} text-stone-600`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-stone-500 uppercase">{label}</span>
        </div>
        <div className="flex gap-1 h-1.5">
            <div className={`h-full rounded-full w-full ${colors[level]} opacity-80 transition-all duration-500`}></div>
        </div>
      </div>
    </div>
  );
};


const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-400 space-y-4 p-8 bg-white/50">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-stone-200 border-t-accent rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-accent" size={16} />
        </div>
        <p className="text-sm font-medium animate-pulse">Consulting the muse...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-400 p-8 text-center bg-white/50">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
          <PenTool size={24} />
        </div>
        <h3 className="text-stone-600 font-medium mb-2">Ready to Critique</h3>
        <p className="text-sm max-w-xs mx-auto">
          Select a form, write your poem, and request an analysis to receive structured feedback based on the RBFR framework.
        </p>
      </div>
    );
  }

  const isGreen = analysis.publicationReadiness.level === 'Green';

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-hide pb-24 bg-white">
      {/* Header */}
      <div className="border-b border-stone-100 pb-4 mb-2">
         <h2 className="text-xl font-serif font-bold text-ink">Poetic Assessment</h2>
         <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">RBFR & SSPSS Analysis</p>
      </div>

      {/* Publication Readiness Dashboard */}
      <section>
        <ReadinessBadge 
          level={analysis.publicationReadiness.level} 
          label={analysis.publicationReadiness.label}
          description={analysis.publicationReadiness.description}
        />
        
        {/* Quality Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <QualityIndicator 
            label="Meter & Rhythm" 
            level={analysis.qualityMetrics.meter} 
            icon={<Activity size={16} />} 
          />
          <QualityIndicator 
            label="Imagery" 
            level={analysis.qualityMetrics.imagery} 
            icon={<Palette size={16} />} 
          />
          <QualityIndicator 
            label="Structure" 
            level={analysis.qualityMetrics.structure} 
            icon={<AlignLeft size={16} />} 
          />
          <QualityIndicator 
            label="Emotional Impact" 
            level={analysis.qualityMetrics.emotionalImpact} 
            icon={<Heart size={16} />} 
          />
        </div>
      </section>

      {/* Overall Impression */}
      <section>
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-accent" />
          Tutor's Impression
        </h3>
        <p className="text-stone-700 leading-relaxed text-base bg-[#fdfbf7] p-5 rounded-xl border border-stone-100 shadow-sm font-serif italic">
          "{analysis.overallImpression}"
        </p>
      </section>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 gap-6">
        <section>
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-600" />
            Strengths (Support)
          </h3>
          <ul className="space-y-3">
            {analysis.critique.strengths.map((point, i) => (
              <li key={i} className="text-sm text-stone-700 flex items-start gap-3 bg-green-50/50 p-3 rounded-lg border border-green-100">
                <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-green-500 flex-shrink-0" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Hide 'Areas for Growth' if the poem is perfect/Green and list is empty */}
        {(!isGreen || (analysis.critique.weaknesses && analysis.critique.weaknesses.length > 0)) && (
          <section>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlertCircle size={14} className="text-orange-500" />
              Areas for Growth (Problem)
            </h3>
            {analysis.critique.weaknesses && analysis.critique.weaknesses.length > 0 ? (
              <ul className="space-y-3">
                {analysis.critique.weaknesses.map((point, i) => (
                  <li key={i} className="text-sm text-stone-700 flex items-start gap-3 bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                    <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-orange-400 flex-shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 bg-stone-50 text-stone-500 rounded-lg text-sm border border-stone-100 italic">
                No significant technical issues detected.
              </div>
            )}
          </section>
        )}
      </div>

      {/* Specific Guidance - Show celebratory message if Green and no suggestions */}
      <section className={`p-6 rounded-xl border shadow-sm ${isGreen ? 'bg-green-50 border-green-100' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isGreen ? 'text-green-800' : 'text-amber-800'}`}>
          {isGreen ? <PartyPopper size={14} /> : <Lightbulb size={14} />}
          {isGreen ? 'Next Steps' : 'Refinement Plan (Solve)'}
        </h3>
        <p className="text-sm text-stone-800 mb-6 font-serif text-lg leading-relaxed text-center px-4">
          {analysis.guidance.conceptualRefinement}
        </p>
        <ul className="space-y-4">
            {analysis.guidance.specificSuggestions.map((suggestion, i) => (
              <li key={i} className={`text-sm text-stone-700 bg-white p-4 rounded-lg shadow-sm flex gap-3 ${isGreen ? 'border border-green-100' : 'border border-amber-100/50'}`}>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isGreen ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{i + 1}</span>
                <span className="leading-relaxed">{suggestion}</span>
              </li>
            ))}
        </ul>
      </section>

      {/* Detailed Technical Analysis (Textual) - Collapsed or minor if Green? Keeping for reference. */}
      <section className="bg-stone-50 p-6 rounded-xl border border-stone-100">
         <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Technical Notes</h3>
         <div className="space-y-4">
            <div>
               <h4 className="text-xs font-semibold text-stone-600 mb-1">Meter & Rhythm</h4>
               <p className="text-sm text-stone-700">{analysis.technicalAnalysis.meter}</p>
            </div>
            <div>
               <h4 className="text-xs font-semibold text-stone-600 mb-1">Structure & Form</h4>
               <p className="text-sm text-stone-700">{analysis.technicalAnalysis.structure}</p>
            </div>
         </div>
      </section>

      {/* Revised Example - Only show if provided and meaningful */}
      {analysis.revisedExample && !isGreen && (
        <section>
           <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
             Revision Example
           </h3>
           <div className="bg-[#fdfbf7] p-8 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
             <div className="absolute top-[-10px] right-[-10px] text-stone-100 group-hover:text-stone-200 transition-colors">
                <PenTool size={100} opacity={0.5} />
             </div>
             <pre className="relative font-serif text-stone-800 whitespace-pre-wrap text-lg leading-relaxed z-10">
               {analysis.revisedExample}
             </pre>
             <p className="relative text-xs text-accent mt-4 text-right font-medium z-10 uppercase tracking-widest">AI Suggested Revision</p>
           </div>
        </section>
      )}
    </div>
  );
};

export default AnalysisPanel;