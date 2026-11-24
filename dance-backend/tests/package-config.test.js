const fs = require('fs');
const path = require('path');

describe('production startup configuration', () => {
  it('builds before starting and provides a pm2 config for autorestart', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
    );

    expect(packageJson.scripts.prestart).toBe('npm run build');
    expect(packageJson.scripts.prod).toMatch(/pm2/i);
  });
});
