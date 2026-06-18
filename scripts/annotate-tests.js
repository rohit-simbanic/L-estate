import fs from 'fs';
import path from 'path';

const testsDir = path.join(process.cwd(), 'tests', 'unit', 'src');

function getAllTestFiles(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      files = files.concat(getAllTestFiles(filePath));
    } else if (file.endsWith('.test.tsx')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getAllTestFiles(testsDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Skip if already annotated
  if (content.includes('▶ TEST START')) {
    console.log(`Skipping already annotated file: ${path.basename(file)}`);
    continue;
  }

  // Regex to match "it('...', () => {"
  const itRegex = /it\(\s*['"`](.*?)['"`]\s*,\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*\);/g;

  content = content.replace(itRegex, (match, testName, body) => {
    // Find the component name used in "if (Button) {" or "if (Component) {"
    const ifMatch = body.match(/if\s*\(\s*([A-Za-z0-9_]+)\s*\)\s*\{([\s\S]*?)\}\s*else\s*\{([\s\S]*?)\}/);
    if (ifMatch) {
      const compName = ifMatch[1];
      let ifBody = ifMatch[2];
      const elseBody = ifMatch[3];

      // Insert start log
      let newIfBody = `\n      console.log('▶ TEST START: ${testName}');`;

      // Split ifBody into lines to find render and expect calls
      const lines = ifBody.split('\n');
      for (let line of lines) {
        if (line.includes('render(')) {
          newIfBody += `\n      console.log('▶ ACTION: Rendering ${compName} component');`;
        }
        if (line.includes('expect(')) {
          // Clean up and extract assertion detail
          const assertClean = line.trim().replace(/'/g, "\\'");
          newIfBody += `\n      console.log('▶ ASSERTION: ${assertClean}');`;
        }
        newIfBody += '\n' + line;
      }

      // Insert success log before the closing bracket of the if block
      newIfBody = newIfBody.trimRight() + `\n      console.log('✔ RESULT: Passed successfully');\n    `;

      const newBody = body.replace(ifMatch[0], `if (${compName}) {${newIfBody}} else {${elseBody}}`);
      return `it('${testName}', () => {${newBody}});`;
    }
    return match;
  });

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Annotated: ${path.basename(file)}`);
}
