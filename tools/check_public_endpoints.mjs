const endpoints = [
  'https://games.playlab.eu.cc/',
  'https://games.playlab.eu.cc/games/first-tetris/',
  'https://games.playlab.eu.cc/games/next-spacewar/',
  'https://games.playlab.eu.cc/games/intespace/',
  'https://games.playlab.eu.cc/games/raiden/',
  'https://games.playlab.eu.cc/games/space-war/',
  'https://games.playlab.eu.cc/games/spacewar-ii/',
  'https://games.playlab.eu.cc/articles/',
  'https://games.playlab.eu.cc/logs/',
  'https://games.playlab.eu.cc/about/',
  'https://games.playlab.eu.cc/rss.xml',
  'https://games.playlab.eu.cc/sitemap.xml',
  'https://games.playlab.eu.cc/robots.txt',
  'https://play.playlab.eu.cc/first-tetris/index.html',
  'https://play.playlab.eu.cc/next-spacewar/index.html',
  'https://play.playlab.eu.cc/intespace/index.html',
  'https://play.playlab.eu.cc/raiden/index.html',
  'https://play.playlab.eu.cc/space-war/index.html',
  'https://play.playlab.eu.cc/spacewar-ii/index.html',
  'https://biau.playlab.eu.cc/',
  'https://biau.playlab.eu.cc/projects',
];

async function check(url) {
  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, { method: 'GET', redirect: 'follow' });
    }
    return {
      url,
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 'ERR',
      finalUrl: error.message,
    };
  }
}

const results = await Promise.all(endpoints.map(check));
const failed = results.filter((result) => !result.ok);

for (const result of results) {
  const marker = result.ok ? 'PASS' : 'FAIL';
  console.log(`${marker} ${result.status} ${result.url}`);
  if (!result.ok) {
    console.log(`  ${result.finalUrl}`);
  }
}

if (failed.length > 0) {
  console.error(`Public endpoint check failed: ${failed.length}/${results.length}`);
  process.exit(1);
}

console.log(`Public endpoint check passed: ${results.length}/${results.length}`);
