const fs = require("fs");
const path = require("path");
const parseMD = require("parse-md").default;

function readPages(path) {
  const children = fs.readdirSync(path);
  const page = children.find((name) => name.match(/.\.md/));

  if (!page) {
    return null;
  }

  const subDirs = children.filter((name) =>
    fs.statSync(`${path}/${name}`).isDirectory()
  );

  const content = {
    template: page.replace(".md", ""),
    ...parseMD(fs.readFileSync(`${path}/${page}`, "utf8")),
    children: subDirs.map((subDir) => readPages(`${path}/${subDir}`)),
  };

  return content;
}

const BASE_CONTENT_PATH = path.join(__dirname, "../grav/user/pages/");
const pagePath = `${BASE_CONTENT_PATH}/${process.argv[2]}`;

process.stdout.write(JSON.stringify(readPages(pagePath)));
