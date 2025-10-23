#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Define replacements
const replacements = [
  // Change catch (error) to catch (_error) for unused errors
  {
    from: /} catch \(error\) \{(\s+)toast\./g,
    to: "} catch (_error) {$1toast.",
  },
  // Change catch (e) to catch (_e) for unused e parameters
  {
    from: /} catch \(e\) \{(\s+)console\./g,
    to: "} catch (_e) {$1console.",
  },
  {
    from: /} catch \(e\) \{(\s+)toast\./g,
    to: "} catch (_e) {$1toast.",
  },
  {
    from: /} catch \(e\) \{(\s+)return/g,
    to: "} catch (_e) {$1return",
  },
  {
    from: /} catch \(e\) \{(\s+)\}/g,
    to: "} catch (_e) {$1}",
  },
  // Remove unused index in map callbacks
  {
    from: /\.map\(\((\w+), index\) =>/g,
    to: ".map(($1, _index) =>",
  },
];

// Get all TypeScript/TSX files recursively
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

const srcDir = path.join(__dirname, "src");
const files = getAllFiles(srcDir);

let totalChanges = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;

  replacements.forEach(({ from, to }) => {
    const newContent = content.replace(from, to);
    if (newContent !== content) {
      changed = true;
      content = newContent;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content, "utf8");
    totalChanges++;
    console.log(`Fixed: ${file}`);
  }
});

console.log(`\nTotal files fixed: ${totalChanges}`);
