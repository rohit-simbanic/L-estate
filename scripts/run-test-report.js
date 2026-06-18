import { spawn, exec } from 'child_process';
import path from 'path';

// Run Jest and inherit stdout/stderr so the user sees live output
const jestProcess = spawn('npx', ['jest'], { stdio: 'inherit', shell: true });

jestProcess.on('close', (code) => {
  const reportPath = path.join(process.cwd(), 'tests', 'unit-report.html');
  
  // Skip auto-opening if running in CI/CD environment
  if (process.env.CI) {
    console.log('\nCI/CD environment detected. Skipping auto-opening of the HTML report.');
    process.exit(code);
  }
  
  // Choose the appropriate command based on platform
  const openCmd = {
    win32: 'start ""',
    darwin: 'open',
    linux: 'xdg-open'
  }[process.platform] || 'open';

  console.log(`\nOpening test report: ${reportPath}`);
  exec(`${openCmd} "${reportPath}"`);
  
  // Forward the original Jest exit code
  process.exit(code);
});
