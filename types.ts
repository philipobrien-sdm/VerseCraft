export type ReadinessLevel = 'Red' | 'Orange' | 'Green';

export interface PoeticForm {
  id: string;
  name: string;
  description: string;
  structure: string;
  example: string;
}

export interface SamplePoem {
  id: string;
  title: string;
  author: string;
  description: string;
  text: string;
  formId: string;
}

export interface AnalysisResponse {
  overallImpression: string;
  publicationReadiness: {
    level: ReadinessLevel;
    label: string;
    description: string;
  };
  qualityMetrics: {
    meter: ReadinessLevel;
    imagery: ReadinessLevel;
    structure: ReadinessLevel;
    emotionalImpact: ReadinessLevel;
  };
  technicalAnalysis: {
    meter: string;
    rhymeScheme: string;
    structure: string;
  };
  critique: {
    strengths: string[];
    weaknesses: string[];
  };
  guidance: {
    specificSuggestions: string[];
    conceptualRefinement: string;
  };
  revisedExample?: string;
}

export interface PoetrySession {
  version: number;
  timestamp: number;
  formId: string;
  poemText: string;
  analysis: AnalysisResponse | null;
}

export enum AppState {
  IDLE = 'IDLE',
  WRITING = 'WRITING',
  ANALYZING = 'ANALYZING',
  REVIEWING = 'REVIEWING'
}