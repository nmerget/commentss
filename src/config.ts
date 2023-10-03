import { ProgramConfigType, ProgramOptionType } from "./data";

export const OPTIONS: ProgramOptionType[] = [
  {
    short: "i",
    long: "input",
    variable: "input",
    description: "Glob for all css files to generate documentation",
    required: true,
  },
  {
    short: "ig",
    long: "ignore",
    variable: "ignore",
    description: "Glob for all files to ignore for documentation",
  },
  {
    short: "g",
    long: "gap",
    variable: "gap",
    description:
      "How many new lines are allowed to use comment as description (default:1)",
  },
  {
    short: "op",
    long: "output-path",
    variable: "outputPath",
    description: "The path for the directory for creating the output files",
  },
  {
    short: "of",
    long: "output-file",
    variable: "outputFile",
    description: "The name for the output files",
  },
];

export const DEFAULT_CONFIG: ProgramConfigType = {
  input: "**/*.{css,scss}",
  ignore: ["**/node_modules/**"],
  gap: "1",
  outputPath: undefined,
  outputFile: "CommentSS",
  test: false,
};
