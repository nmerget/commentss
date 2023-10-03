export type ProgramOptionType = {
  short: string;
  long: string;
  variable: string;
  description: string;
  required?: boolean;
};

export type ProgramConfigType = {
  input: string;
  ignore?: string | string[];
  gap?: string | number;
  outputPath?: string;
  outputFile?: string;
  test?: boolean;
};
