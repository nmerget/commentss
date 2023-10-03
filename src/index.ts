#!/usr/bin/env node

import { Command } from "commander";
import { OPTIONS } from "./config";
import { ProgramConfigType } from "./data";
import { commentss } from "./commentss";

const program = new Command();
program
  .name("CommentSS")
  .description("Get comments from css/scss files for documentation purposes");

for (const option of OPTIONS) {
  const variable = option.required
    ? `<${option.variable}>`
    : `[${option.variable}]`;
  program.option(
    `-${option.short}, --${option.long} ${variable}`,
    option.description,
  );
}

program.action(async (passedConfig: ProgramConfigType) => {
  await commentss(passedConfig);
});

program.parse();
