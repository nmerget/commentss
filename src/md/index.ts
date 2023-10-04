import { CSSCommentResult, CSSOutputType } from "../css/data";
import FS from "node:fs";
import * as prettier from "prettier";

const getCleanValue = (value: string, replacer: string): string =>
  value.replace(/\r\n/g, replacer).replace(/\n/g, replacer);
const getTableRow = (comment: CSSCommentResult): string =>
  `|${comment.descendant?.type}|\`${getCleanValue(
    comment.descendant?.key || "",
    " ",
  )}\`|${getCleanValue(comment.comment.text, "<br>")}|${
    comment.comment.endLine
  }-${comment.descendant?.startLine}|\n`;

export const generateMDFiles = async (
  cssOutputs: CSSOutputType[],
  outputPath: string,
  outputFile: string,
) => {
  let sortByFile = "# CommentSS - Output\n\n";

  for (const output of cssOutputs.filter(
    (output) => output.comments && output.comments?.length > 0,
  )) {
    sortByFile += `## ${output.file}\n\n`;
    sortByFile += "|Type|Key|Comment|Line|\n";
    sortByFile += "|----|---|-------|----|\n";

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
