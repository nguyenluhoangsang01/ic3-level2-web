export type QuestionType =
  | 'single'
  | 'multi'
  | 'hotspot'
  | 'matching'
  | 'ordering'
  | 'matrix'
  | 'fill_blank'
  | string;

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatrixRow {
  text: string;
  answer: string;
}

export interface HotspotBox {
  x: number | string;
  y: number | string;
  w: number | string;
  h: number | string;
  isCorrect?: boolean | string | number;
}

export interface Question {
  id?: string | number;
  global_id?: string;
  type?: QuestionType;
  q?: string;
  text?: string;
  image?: string;
  video?: string;
  options?: string[];
  answer?: string | string[];
  limit?: number;
  steps?: string[];
  blanks?: string[];
  pairs?: MatchingPair[];
  headers?: string[];
  rows?: MatrixRow[];
  hotspots?: HotspotBox[];
  [key: string]: unknown;
}
