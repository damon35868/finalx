#! /usr/bin/env node

const ora = require("ora");
const inquirer = require("inquirer");
const util = require("util");
const path = require("path");
const downloadGitRepo = require("download-git-repo"); // 不支持 Promise
const chalk = require("chalk");

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();

  try {
    const result = await fn(...args);
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail("Request failed, refetch ...");
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;

    // 改造 download-git-repo 支持 promise
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 下载模板
  async download() {
    await wrapLoading(
      this.downloadGitRepo,
      "模版下载中，请稍后...",
      "github:damon35868/finalx#template",
      path.resolve(process.cwd(), this.targetDir)
    ); // 参数2: 创建位置
  }

  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  async create() {
    await this.download();

    console.log(chalk.green("项目初始化完成!\r\n"));

    console.log(`\r\n  cd ${chalk.cyan(this.targetDir)}\r\n`);

    console.log(`  ${chalk.green("yarn")}\r\n`);

    console.log(`  ${chalk.green("yarn dev")}\r\n`);
  }
}

module.exports = Generator;
