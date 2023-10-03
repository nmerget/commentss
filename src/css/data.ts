export type CSSResultCommentType = {
  text: string;
  endLine: number;
};

export type CSSResultKeyType = {
  type: string;
  key: string;
  value?: unknown;
  startLine: number;
};

export type CSSCommentResult = {
  descendant?: CSSResultKeyType;
  comment: CSSResultCommentType;
};

export type CSSOutputType = {
  file?: string;
  comments?: CSSCommentResult[];
  rules?: CSSResultKeyType[];
  atrules?: CSSResultKeyType[];
  decls?: CSSResultKeyType[];
};
