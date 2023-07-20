#! /usr/bin/env node

const Generator = require("./generator");
const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");

async function removeFile(rootDir) {
  console.log(`\r\n覆盖中...`);
  await fs.remove(rootDir);
}

module.exports = async function (name, options) {
  const cwd = process.cwd();
  const rootDir = path.join(cwd, name);

  if (fs.existsSync(rootDir)) {
    if (options.force) {
      await removeFile(rootDir);
    } else {
      let { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "监测到目标文件夹已存在:",
          choices: [
            {
              name: "覆盖",
              value: "overwrite"
            },
            {
              name: "取消",
              value: false
            }
          ]
        }
      ]);

      if (!action) return;

      if (action === "overwrite") {
        await removeFile(rootDir);
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, rootDir);

  // 开始创建项目
  generator.create();
};
