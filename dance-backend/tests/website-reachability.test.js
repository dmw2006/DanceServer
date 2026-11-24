const fs = require('fs');
const path = require('path');

describe('frontend deployment config', () => {
  it('allows external preview hosts and removes the bad deployment hostname typo', () => {
    const viteConfigPath = path.join(__dirname, '..', '..', 'dance-react', 'vite.config.js');
    const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

    expect(viteConfig).toContain('allowedHosts: true');
    expect(viteConfig).toContain("host: '0.0.0.0'");
    expect(viteConfig).not.toContain('danceacadamy.onrender.com');
  });
});
