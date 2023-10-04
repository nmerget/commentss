import { DEFAULT_CONFIG } from "./config";
import { ProgramConfigType } from "./data";
import { GlobOptions, globSync } from "glob";
import { CSSOutputType } from "./css/data";
import FS from "node:fs";
import { getCssResult } from "./css";
import * as prettier from "prettier";
import { generateMDFiles } from "./md";

export const commentss = async (
  passedConfig: ProgramConfigType,
): Promise<CSSOutputType[] | undefined> => {
  const {
    input,
    ignore,
    gap,
    outputPath,
    outputFile,
    test,
  }: ProgramConfigType = {
    // TODO: Add https://github.com/cosmiconfig/cosmiconfig here
    ...DEFAULT_CONFIG,
    ...passedConfig,
  };

  const gapAsNumber = gap ? Number(gap) : 1;

  const options: GlobOptions = {};
  if (ignore) {
    options.ignore = ignore;
  }
  const cssFiles = globSync(input, options);

  const cssOutputs: CSSOutputType[] = [];

  for (const file of cssFiles) {
    const filePathAsString = file.toString();
    const readFile = FS.readFileSync(filePathAsString).toString();

    try {
      const cssResult: CSSOutputType = getCssResult(readFile, gapAsNumber);
      cssOutputs.push({
        file: filePathAsString.replace(/\\/g, "/"),
        ...cssResult,
      });
    } catch (e) {
      console.error("Error for file", filePathAsString, "\n", e);
    }
  }

  const jsonOutput = await prettier.format(JSON.stringify(cssOutputs), {
    parser: "json",
  });

  if (outputPath) {
    if (!FS.existsSync(outputPath)) {
      FS.mkdirSync(outputPath);
    }
    FS.writeFileSync(`${outputPath}/${outputFile}.json`, jsonOutput);
    await generateMDFiles(cssOutputs, outputPath, outputFile!);
    // eslint-disable-next-line no-console
    console.log(`Generated files in '${outputPath}' 🥳`);
    return undefined;
  } else if (test) {
    return cssOutputs;
  } else {
    // eslint-disable-next-line no-console
    console.log(jsonOutput);
    return undefined;
  }
};

export default { commentss };
