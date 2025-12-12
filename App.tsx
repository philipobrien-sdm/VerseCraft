import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Sparkles, Menu, X, Feather, Columns, PanelLeft, Maximize, FileText, Download, Upload, Save, Plus, AlertTriangle, Info } from 'lucide-react';
import Editor from './components/Editor';
import AnalysisPanel from './components/AnalysisPanel';
import TemplateSelector from './components/TemplateSelector';
import { POETIC_FORMS } from './constants';
import { PoeticForm, AnalysisResponse, SamplePoem, PoetrySession } from './types';
import { analyzePoem } from './services/geminiService';

type ViewMode = 'editor' | 'split' | 'analysis';

const App: React.FC = () => {
  // State
  const [selectedForm, setSelectedForm] = useState<PoeticForm>(POETIC_FORMS[0]);
  const [poemText, setPoemText] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Layout State
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle mobile initial state
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setViewMode('editor');
      setIsLeftSidebarOpen(false);
    }
  }, []);

  // Handlers
  const handleFormSelect = (form: PoeticForm) => {
    setSelectedForm(form);
    if (window.innerWidth < 1024) {
      setIsLeftSidebarOpen(false);
    }
  };

  const handleSampleSelect = (sample: SamplePoem) => {
    setPoemText(sample.text);
    const associatedForm = POETIC_FORMS.find(f => f.id === sample.formId);
    if (associatedForm) {
      setSelectedForm(associatedForm);
    }
    setAnalysis(null);
    if (window.innerWidth < 1024) {
      setIsLeftSidebarOpen(false);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!poemText.trim()) return;

    setIsAnalyzing(true);
    
    // Automatically switch to split or analysis view to show results
    if (window.innerWidth < 1024) {
      setViewMode('analysis');
    } else if (viewMode === 'editor') {
      setViewMode('split');
    }
    
    try {
      // Pass the current analysis (if exists) as context for the new revision
      const result = await analyzePoem(poemText, selectedForm.name, analysis);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [poemText, selectedForm, viewMode, analysis]); 

  // --- Session Management ---

  const handleNewSessionClick = () => {
    // If nothing to clear, just ignore or maybe shake UI (optional), but here we just return
    if (poemText.trim() === '' && !analysis) return;
    setShowConfirmation(true);
  };

  const confirmNewSession = () => {
    setPoemText('');
    setAnalysis(null);
    setShowConfirmation(false);
  };

  const handleExportSession = () => {
    const session: PoetrySession = {
      version: 1,
      timestamp: Date.now(),
      formId: selectedForm.id,
      poemText: poemText,
      analysis: analysis
    };

    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `versecraft-session-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const session = JSON.parse(content) as PoetrySession;

        // Basic validation
        if (!session.formId || typeof session.poemText !== 'string') {
          throw new Error("Invalid session file format");
        }

        // Restore State
        setPoemText(session.poemText);
        setAnalysis(session.analysis || null);
        
        const restoredForm = POETIC_FORMS.find(f => f.id === session.formId);
        if (restoredForm) {
          setSelectedForm(restoredForm);
        }

        // Reset view for mobile
        if (window.innerWidth < 1024) {
          setViewMode('editor');
          setIsLeftSidebarOpen(false);
        }

        // Reset file input so same file can be loaded again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';

      } catch (error) {
        console.error("Failed to load session", error);
        alert("Could not load session. Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-screen w-screen bg-[#f3f4f6] flex flex-col overflow-hidden font-sans">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
      />

      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-20 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            className={`p-2 rounded-lg transition-colors ${isLeftSidebarOpen ? 'bg-gray-100 text-ink' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            title="Toggle Template Sidebar"
          >
            <PanelLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2 text-ink">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white shadow-sm">
              <Feather size={18} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden md:block text-ink">VerseCraft</h1>
            <button 
              onClick={() => setShowAbout(true)}
              className="p-1 text-gray-400 hover:text-accent transition-colors ml-1"
              title="About VerseCraft"
            >
              <Info size={18} />
            </button>
          </div>
          
          <div className="hidden md:block h-6 w-px bg-gray-200 mx-2"></div>
          <span className="hidden md:inline-block text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
            {selectedForm.name}
          </span>
        </div>

        {/* View Switcher (Center) - Visible on all screens to prevent navigation lock */}
        <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 mx-2">
          <button
            onClick={() => setViewMode('editor')}
            className={`p-1.5 px-3 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
              viewMode === 'editor' 
                ? 'bg-white text-ink shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Editor Focus"
          >
            <Maximize size={16} />
            <span className="hidden sm:inline">Editor</span>
          </button>
          
          <button
            onClick={() => setViewMode('split')}
            className={`hidden lg:flex p-1.5 px-3 rounded-md text-sm font-medium items-center gap-2 transition-all ${
              viewMode === 'split' 
                ? 'bg-white text-ink shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Split View"
          >
            <Columns size={16} />
            <span className="hidden sm:inline">Split</span>
          </button>

          <button
            onClick={() => setViewMode('analysis')}
            className={`p-1.5 px-3 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
              viewMode === 'analysis' 
                ? 'bg-white text-ink shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Analysis Focus"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">Critique</span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
           {/* Session Controls */}
           <button 
             onClick={handleNewSessionClick}
             className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex"
             title="New Poem"
           >
             <Plus size={18} />
           </button>
           <button 
             onClick={handleImportClick}
             className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex"
             title="Load Session"
           >
             <Upload size={18} />
           </button>
           <button 
             onClick={handleExportSession}
             className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex"
             title="Save Session"
           >
             <Save size={18} />
           </button>

           <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

           <button
             onClick={handleAnalyze}
             disabled={isAnalyzing || !poemText.trim()}
             className={`flex items-center gap-2 px-4 md:px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 shadow-sm
               ${isAnalyzing || !poemText.trim() 
                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                 : 'bg-ink text-white hover:bg-accent hover:shadow-md active:scale-95'
               }`}
           >
             <Sparkles size={16} className={isAnalyzing ? 'animate-spin' : ''} />
             <span className="hidden md:inline">
               {isAnalyzing ? 'Critiquing...' : analysis ? 'Reassess' : 'Assess'}
             </span>
             <span className="md:hidden">
               {isAnalyzing ? '...' : analysis ? 'Reassess' : 'Assess'}
             </span>
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar (Templates) */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-30 w-72 bg-[#fdfbf7] border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:static lg:z-0
            ${isLeftSidebarOpen ? 'translate-x-0 pt-16 lg:pt-0' : '-translate-x-full lg:hidden'}
          `}
        >
          <div className="h-full overflow-y-auto p-5 scrollbar-hide">
             {/* Mobile Session Controls */}
             <div className="flex gap-2 mb-6 sm:hidden">
                <button onClick={handleNewSessionClick} className="flex-1 flex items-center justify-center gap-2 p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600">
                  <Plus size={16} /> New
                </button>
                <button onClick={handleImportClick} className="flex-1 flex items-center justify-center gap-2 p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600">
                  <Upload size={16} /> Load
                </button>
                <button onClick={handleExportSession} className="flex-1 flex items-center justify-center gap-2 p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600">
                  <Save size={16} /> Save
                </button>
             </div>

             <TemplateSelector 
               selectedId={selectedForm.id} 
               onSelect={handleFormSelect}
               onSelectSample={handleSampleSelect}
             />
             
             <div className="mt-8 border-t border-gray-200 pt-6">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Structure Guide</h4>
                <div className="text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-200 shadow-sm leading-relaxed">
                   <p className="font-medium text-ink mb-1">Constraints:</p>
                   {selectedForm.structure}
                </div>
             </div>
          </div>
        </aside>

        {/* Content Wrapper */}
        <div className="flex-1 flex min-w-0 bg-[#f3f4f6] relative z-0 transition-all duration-300">
          
          {/* Editor Panel */}
          <section 
            className={`
              transition-all duration-300 flex flex-col h-full
              ${viewMode === 'analysis' ? 'hidden w-0' : 'flex-1'}
              ${viewMode === 'editor' ? 'w-full' : ''}
            `}
          >
            <div className="flex-1 p-4 md:p-6 lg:p-8 w-full h-full flex flex-col mx-auto max-w-5xl">
              <Editor 
                value={poemText} 
                onChange={setPoemText} 
                placeholder={`Write your ${selectedForm.name.toLowerCase()} here...\n\n${selectedForm.example ? `Example line: ${selectedForm.example.split('\n')[0]}...` : ''}`}
                selectedForm={selectedForm}
              />
            </div>
          </section>

          {/* Analysis Panel */}
          <section 
             className={`
              bg-white border-l border-gray-200 shadow-sm transition-all duration-300 flex flex-col h-full overflow-hidden
              ${viewMode === 'editor' ? 'hidden w-0' : ''}
              ${viewMode === 'split' ? 'w-96 flex-shrink-0' : ''}
              ${viewMode === 'analysis' ? 'flex-1 w-full' : ''}
             `}
          >
            <div className={`h-full w-full ${viewMode === 'analysis' ? 'max-w-3xl mx-auto border-x border-gray-100' : ''}`}>
              <AnalysisPanel analysis={analysis} isLoading={isAnalyzing} />
            </div>
          </section>

        </div>

        {/* Mobile Sidebar Overlay */}
        {isLeftSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setIsLeftSidebarOpen(false)}
          />
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setShowConfirmation(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all border border-stone-100 scale-100">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                 <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-ink">Start a new poem?</h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  This will clear your current poem and analysis. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmNewSession}
                  className="flex-1 px-4 py-2 bg-ink hover:bg-stone-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Start New
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setShowAbout(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 transform transition-all border border-stone-100 scale-100 overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center text-white shadow-md mb-4">
                <Feather size={32} strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-ink">VerseCraft</h2>
              <p className="text-sm text-stone-500 uppercase tracking-widest mt-1">AI Poetry Tutor</p>
            </div>

            <div className="space-y-6 text-stone-700">
              <div>
                <h3 className="font-bold text-ink mb-2">About the Tutor</h3>
                <p className="text-sm leading-relaxed">
                  VerseCraft isn't a poem generator; it's a pedagogical tool. It uses the Google Gemini API to analyze your work like a professional literary editor, helping you refine your voice rather than replacing it.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                <h3 className="font-bold text-ink mb-2 text-xs uppercase tracking-wide">Pedagogical Framework</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="font-bold text-accent">RBFR</span>
                    <span>(Role, Behaviour, Function, Reporting) ensures the AI stays in character as a supportive but critical editor.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-accent">SSPSS</span>
                    <span>(State, Support, Problem, Solve, Summarize) structures every critique to be actionable and balanced.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-ink mb-2">Features</h3>
                <ul className="list-disc list-inside text-sm space-y-1 text-stone-600">
                  <li>Real-time syllable counting & structural validation</li>
                  <li>Deep analysis of meter, imagery, and emotion</li>
                  <li>Support for Haiku, Sonnet, Limerick, Villanelle, and Free Verse</li>
                  <li>Session export/import functionality</li>
                </ul>
              </div>

              <div className="text-center pt-4 border-t border-stone-100">
                <p className="text-xs text-stone-400">Powered by Google Gemini 2.5 Flash</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;