#! /usr/bin/env node

const figlet = require("figlet");
const chalk = require("chalk");
const commander = require("commander");

commander
  .command("init <app-name>")
  .description("初始化项目")
  .option("-f, --force", "覆盖目标文件夹（如果存在）")
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
  console.log(`\r\nrun ${chalk.cyan(`finalx <command> --help`)} 获取更多\r\n`);
});

// version
commander.version(`v${require("../package.json").version}`).usage("<command> [option]");

commander.parse(process.argv);
