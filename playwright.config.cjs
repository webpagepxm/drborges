const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 45_000,
  retries: 1,
  reporter: [['list'],['html',{outputFolder:'playwright-report',open:'never'}]],
  use:{ baseURL:'http://127.0.0.1:4173', trace:'retain-on-failure' },
  projects:[
    {name:'Chromium (Chrome y Edge)',use:{...devices['Desktop Chrome']}},
    {name:'Firefox',use:{...devices['Desktop Firefox']}},
    {name:'WebKit (Safari)',use:{...devices['Desktop Safari']}},
    {name:'Android (Chrome)',use:{...devices['Pixel 5']}},
    {name:'iPhone (Safari)',use:{...devices['iPhone 13']}}
  ],
  webServer:{
    command:'python3 -m http.server 4173 --bind 127.0.0.1',
    url:'http://127.0.0.1:4173',
    timeout:30_000,
    reuseExistingServer:!process.env.CI
  }
});
