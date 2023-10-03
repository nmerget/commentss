import { CSSCommentResult, CSSOutputType } from "../css/data";
import FS from "node:fs";
import * as prettier from "prettier";

const getTableRow = (comment: CSSCommentResult): string =>
  `|${comment.descendant?.type}|\`${comment.descendant
    ?.key}\`|${comment.comment.text.replace(/\n/g, "<br>")}|\n`;

export const generateMDFiles = async (
  cssOutputs: CSSOutputType[],
  outputPath: string,
  outputFile: string,
) => {
  let sortByFile = "# CommentSS - Output\n\n";

  for (const output of cssOutputs) {
    sortByFile += `## ${output.file}\n\n`;
    sortByFile += "|Type|Key|Comment|\n";
    sortByFile += "|----|---|-------|\n";

    const decl =
      output.comments?.filter(
        (comment) => comment.descendant?.type === "decl",
      ) ?? [];
    const rules =
      output.comments?.filter(
        (comment) => comment.descendant?.type === "rule",
      ) ?? [];
    [...decl, ...rules].forEach((comment) => {
      sortByFile += getTableRow(comment);
    });
  }

  FS.writeFileSync(
    `${outputPath}/${outputFile}.md`,
    await prettier.format(sortByFile, { parser: "markdown" }),
  );
};

export default { generateMDFiles };
