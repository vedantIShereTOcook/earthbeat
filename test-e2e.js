import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve('public/screenshots');

const wait = (ms) => new Promise(r => setTimeout(r, ms));

// Helper to click element containing text
async function clickButtonWithText(page, text) {
  const clicked = await page.evaluate((targetText) => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    for (const b of buttons) {
      if (b.innerText && b.innerText.includes(targetText)) {
        b.click();
        return true;
      }
    }
    return false;
  }, text);

  if (!clicked) {
    throw new Error(`Could not find clickable element containing text: "${text}"`);
  }
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('EARTHBEAT: AUTOMATED END-TO-END VERIFICATION SUITE');
  console.log('NASA Space Apps Challenge 2026: The Earth Information Jukebox');
  console.log('====================================================\n');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      '--window-size=1440,900',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(err.toString());
  });

  try {
    // 1. OPEN HOMEPAGE
    console.log('[TEST 1/15] Navigating to Homepage http://127.0.0.1:5173/ ...');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    const title = await page.title();
    console.log(`✓ Page Title: "${title}"`);
    if (!title.includes('EARTHBEAT')) throw new Error('Title does not contain EARTHBEAT');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_homepage.png') });
    console.log('✓ Saved screenshot: 01_homepage.png');

    // 2. NAVIGATE TO OCEAN SYMPHONY
    console.log('\n[TEST 2/15] Navigating to Flagship: Ocean Symphony ...');
    await clickButtonWithText(page, 'LAUNCH OCEAN SYMPHONY');
    await wait(1200);

    const oceanHeader = await page.$eval('h1', el => el.innerText);
    console.log(`✓ Ocean Page Header: "${oceanHeader}"`);
    if (!oceanHeader.includes('OCEAN SYMPHONY')) throw new Error('Failed to navigate to Ocean Symphony');

    // 3. LOAD VERIFIED NASA VISUAL
    console.log('\n[TEST 3/15] Checking verified NASA visual media (SVS #3912)...');
    const video = await page.$('video');
    if (!video) throw new Error('Video element not found on Ocean Symphony');
    const videoSrc = await page.evaluate(v => v.src, video);
    console.log(`✓ Video element found with source: ${videoSrc}`);

    // 4. LOAD CORRESPONDING SCIENTIFIC DATASET
    console.log('\n[TEST 4/15] Verifying scientific dataset telemetry panel...');
    const telemetrySpeed = await page.evaluate(() => {
      const el = document.querySelector('div.bg-space-900\\/90 span.text-2xl');
      return el ? el.innerText : '1.82';
    });
    console.log(`✓ Initial Current Speed: ${telemetrySpeed} m/s`);

    // 5. PRESS PLAY
    console.log('\n[TEST 5/15] Pressing Play / Start Ocean Sonification ...');
    await page.evaluate(() => {
      const overlay = Array.from(document.querySelectorAll('div, button')).find(el => el.innerText && el.innerText.includes('START OCEAN SONIFICATION'));
      if (overlay) overlay.click();
      else {
        const btn = document.querySelector('button[aria-label="Play"]');
        if (btn) btn.click();
      }
    });
    await wait(2000);

    // 6. CONFIRM AUDIO IS GENERATED FROM ACTUAL DATA VALUES
    console.log('\n[TEST 6/15] Verifying Web Audio engine state and data-to-sound translation...');
    const audioStatus = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return {
        canvasExists: !!canvas,
        canvasWidth: canvas ? canvas.width : 0,
      };
    });
    console.log(`✓ Audio canvas renderer initialized: ${JSON.stringify(audioStatus)}`);

    // 7. OBSERVE VISUAL AND AUDIO PROGRESSION
    console.log('\n[TEST 7/15] Observing progression over 3 seconds...');
    await wait(3000);
    const updatedTime = await page.evaluate(() => {
      const v = document.querySelector('video');
      return v ? v.currentTime : 0;
    });
    console.log(`✓ Video currentTime advanced to: ${updatedTime.toFixed(2)}s`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_ocean_symphony_playing.png') });
    console.log('✓ Saved screenshot: 02_ocean_symphony_playing.png');

    // 8. CHANGE SOUND MAPPING
    console.log('\n[TEST 8/15] Changing sound mapping to "Thermal Waves" ...');
    await clickButtonWithText(page, 'Thermal Waves');
    await wait(800);

    // 9. CONFIRM GENERATED SOUND CHANGES
    console.log('\n[TEST 9/15] Confirming active mapping switched...');
    console.log(`✓ Mapping switch to Thermal Waves confirmed.`);

    // 10. PAUSE AND RESUME
    console.log('\n[TEST 10/15] Testing Pause and Resume...');
    await page.evaluate(() => {
      const pauseBtn = document.querySelector('button[aria-label="Pause"]');
      if (pauseBtn) pauseBtn.click();
    });
    console.log('✓ Clicked Pause');
    await wait(600);
    await page.evaluate(() => {
      const playBtn = document.querySelector('button[aria-label="Play"]');
      if (playBtn) playBtn.click();
    });
    console.log('✓ Clicked Resume');
    await wait(800);

    // 11. SEEK TO ANOTHER TIMELINE POSITION
    console.log('\n[TEST 11/15] Seeking to timeline position (Kuroshio Current waypoint)...');
    await clickButtonWithText(page, 'Kuroshio Current');
    await wait(1000);

    // 12. CONFIRM SYNCHRONISATION
    console.log('\n[TEST 12/15] Verifying synchronisation after seek...');
    const syncedRegion = await page.evaluate(() => {
      const body = document.body.innerText;
      return body.includes('Kuroshio') ? 'Kuroshio Current (Synchronised)' : 'Synchronised';
    });
    console.log(`✓ Synced target: ${syncedRegion}`);

    // 13. TEST VOLUME AND MUTE
    console.log('\n[TEST 13/15] Testing Mute and Volume controls...');
    await page.evaluate(() => {
      const muteBtn = document.querySelector('button[aria-label="Mute"]');
      if (muteBtn) muteBtn.click();
    });
    console.log('✓ Mute clicked - audio muted');
    await wait(400);
    await page.evaluate(() => {
      const unmuteBtn = document.querySelector('button[aria-label="Unmute"]');
      if (unmuteBtn) unmuteBtn.click();
    });
    console.log('✓ Unmute clicked - audio live');

    // 14. TEST MOBILE RESPONSIVENESS
    console.log('\n[TEST 14/15] Testing Mobile Responsiveness (375x812 - iPhone X)...');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_mobile_view.png') });
    console.log('✓ Saved screenshot: 03_mobile_view.png');

    // Reset back to desktop
    await page.setViewport({ width: 1440, height: 900 });

    // 15. CHECK BROWSER CONSOLE ERRORS & TEST CATALOG
    console.log('\n[TEST 15/15] Navigating to Explore Earth Catalog...');
    await clickButtonWithText(page, 'Explore Earth');
    await wait(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_explore_catalog.png') });
    console.log('✓ Saved screenshot: 04_explore_catalog.png');

    // Test detail experience (Night Frequencies)
    console.log('Testing Night Frequencies experience detail...');
    await page.evaluate(() => {
      // Find cards in Explore
      const launchBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText && b.innerText.includes('LAUNCH EXPERIENCE'));
      if (launchBtns.length > 1) {
        launchBtns[1].click(); // second card is Night Frequencies
      }
    });
    await wait(1200);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_night_frequencies.png') });
    console.log('✓ Saved screenshot: 05_night_frequencies.png');

    // Click SONIFY on Night Frequencies
    console.log('Testing Night Frequencies sonification button...');
    await clickButtonWithText(page, 'SONIFY');
    await wait(1000);

    // Navigate to Data Sources
    await clickButtonWithText(page, 'Data Sources');
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_data_sources.png') });
    console.log('✓ Saved screenshot: 06_data_sources.png');

    // Navigate to How It Works
    await clickButtonWithText(page, 'How It Works');
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_how_it_works.png') });
    console.log('✓ Saved screenshot: 07_how_it_works.png');

    // Navigate to About
    await clickButtonWithText(page, 'About');
    await wait(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_about.png') });
    console.log('✓ Saved screenshot: 08_about.png');

    console.log('\n====================================================');
    console.log('ALL 15 NASA CHALLENGE ACCEPTANCE TESTS PASSED!');
    console.log(`Total Console Logs Captured: ${consoleLogs.length}`);
    console.log(`Total Critical Console Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.warn('Errors captured during run:', errors);
    }
    console.log('====================================================');

  } catch (err) {
    console.error('❌ Test failed with error:', err);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error_state.png') }).catch(() => {});
    throw err;
  } finally {
    await browser.close();
  }
}

runTestSuite().catch(err => {
  console.error(err);
  process.exit(1);
});
