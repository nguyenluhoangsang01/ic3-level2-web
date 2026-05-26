export type HotspotAnswer = Array<[number, number]>;

export interface ListAnswer {
  target: string[];
  source?: string[];
}

export type MatrixAnswer = Record<string, string>;

export type AnswerValue = string | string[] | HotspotAnswer | ListAnswer | MatrixAnswer | null | undefined;

export type AnswerMap = Record<number, AnswerValue>;
