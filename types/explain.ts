export type ExplainRequest = {
  code: string;
  language?: "auto" | "javascript" | "typescript" | "python" | "go" | "java";
  autodetect?: boolean;
  depth?: "brief" | "detailed";
  targetLanguage?: "en" | "id" | "su" | "ja" | "de";
};

export type ExplainResponse = {
  language: string;
  summary: string;
  bigO: { time: string; space: string; rationale?: string };
  byLine: Array<{ line: number; code: string; explanation: string }>;
  potentialIssues: string[];
  refactors: string[];
  tests: string[];
};
