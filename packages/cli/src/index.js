#! /usr/bin/env node

const commander = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");

commander
  .command("init <app-name>")
  .description("init project")
  .option("-f, --force", "overwrite target directory if it exist")
  .action((name, options) => {
    require("./init.js")(name, options);
  });

commander.on("--help", () => {
  console.log(
    "\r\n" +
      figlet.textSync("finalx", {
        width: 180,
        font: "ANSI Shadow",
        whitespaceBreak: true,
        verticalLayout: "default",
        horizontalLayout: "default"
      })
  );
  // 新增说明信息
  console.log(`\r\nrun ${chalk.cyan(`finalx <command> --help`)} show details\r\n`);
});

// version
commander.version(`v${require("../package.json").version}`).usage("<command> [option]");

commander.parse(process.argv);
