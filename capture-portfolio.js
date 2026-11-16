
const { chromium } = require("playwright");
const fs = require("fs");

const BASE_URL = "https://resumecraft-phi-drab.vercel.app";

const pages = [
  { name: "homepage", path: "/" },
  { name: "templates", path: "/templates" },
  { name: "tracker", path: "/tracker" },
  { name: "student-builder", path: "/builder/student" },
];

(async () => {
  fs.mkdirSync("portfolio-shots", { recursive: true });

  const browser = await chromium.launch({ headless: true });

  const devices = [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 390, height: 844 },
  ];

  for (const device of devices) {
    const page = await browser.newPage({
      viewport: {
        width: device.width,
        height: device.height,
      },
    });

    for (const item of pages) {
      try {
        const response = await page.goto(
          BASE_URL + item.path,
          { waitUntil: "networkidle", timeout: 30000 }
        );

        await page.screenshot({
          path: `portfolio-shots/${item.name}-${device.name}.png`,
          fullPage: true,
        });

        console.log(
          `${item.name}: ${response?.status()} - ${device.name}`
        );
      } catch (error) {
        console.log(`Failed: ${item.name} - ${error.message}`);
      }
    }

    await page.close();
  }

  await browser.close();
  console.log("Portfolio screenshots completed!");
})();