import { parse, Root } from "postcss";
import { CSSCommentResult, CSSOutputType, CSSResultKeyType } from "./data";

const getCommentResults = (
  root: Root,
  gapAsNumber: number,
): CSSCommentResult[] => {
  const result: CSSCommentResult[] = [];
  root.walkComments((child) => {
    if (child.parent) {
      const commentIndexInParent = child.parent.index(child);
      const nextIndex = commentIndexInParent + 1;
      if (child.parent.nodes.length > nextIndex) {
        const descendant = child.parent.nodes[nextIndex];
        if (descendant) {
          const resultItem: CSSCommentResult = {
            comment: {
              text: child.text,
              endLine: child.source?.end?.line || -1,
            },
          };
          if (descendant.type === "rule") {
            resultItem.descendant = {
              type: descendant.type,
              key: descendant.selector,
              startLine: descendant?.source?.start?.line || -1,
            };
          } else if (descendant.type === "decl") {
            resultItem.descendant = {
              type: descendant.type,
              key: descendant.prop,
              value: descendant.value,
              startLine: descendant?.source?.start?.line || -1,
            };
          } else if (descendant.type === "atrule") {
            resultItem.descendant = {
              type: descendant.type,
              key: descendant.name,
              value: descendant.params,
              startLine: descendant?.source?.start?.line || -1,
            };
          }

          result.push(resultItem);
        }
      }
    }
  });

  return result
    .sort((a, b) => {
      if (a.comment.endLine < b.comment.endLine) {
        return -1;
      }
      if (a.comment.endLine > b.comment.endLine) {
        return 1;
      }

      return 0;
    })
    .filter(
      (res) =>
        res.descendant &&
        (res.descendant.startLine || -1) - (res.comment.endLine || -1) <=
          gapAsNumber,
    );
};

const getCssResultKey = (
  root: Root,
  type: "rules" | "atrule" | "decl",
): CSSResultKeyType[] => {
  const resultKeys: CSSResultKeyType[] = [];

  if (type === "rules") {
    root.walkRules((rule) => {
      resultKeys.push({
        type: rule.type,
        key: rule.selector,
        startLine: rule?.source?.start?.line || -1,
      });
    });
  } else if (type === "atrule") {
    root.walkAtRules((atrule) => {
      resultKeys.push({
        type: atrule.type,
        key: atrule.name,
        value: atrule.params,
        startLine: atrule?.source?.start?.line || -1,
      });
    });
  } else if (type === "decl") {
    root.walkDecls((decl) => {
      resultKeys.push({
        type: decl.type,
        key: decl.prop,
        value: decl.value,
        startLine: decl?.source?.start?.line || -1,
      });
    });
  }

  return resultKeys;
};

export const getCssResult = (
  fileContent: string,
  gapAsNumber: number,
): CSSOutputType => {
  const root: Root = parse(fileContent);
  return {
    comments: getCommentResults(root, gapAsNumber),
    rules: getCssResultKey(root, "rules"),
    atrules: getCssResultKey(root, "atrule"),
    decls: getCssResultKey(root, "decl"),
  };
};

export default { getCssResult };
