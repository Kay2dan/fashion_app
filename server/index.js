const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const createCSVWriter = require("csv-writer").createObjectCsvWriter;

const url = "https://www.generation.com.pk/kurtas.html";

const scrappedData = [];

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const urls = await page.evaluate(() => {
      let results = [];
      let items = document.querySelectorAll("a.product-item-photo");
      items.forEach(item => {
        results.push({
          url: item.getAttribute("href"),
        });
      });
      return results;
    });

    const payload = [];
    for (const o of urls) {
      // urls.forEach(async o => {
      console.log("o", o);
      const page = await browser.newPage();
      await page.goto(o.url);
      let linkInfo = await page.evaluate(() => {
        return document.querySelector("h1.page-title > span").innerHTML;
      });
      console.log("linkInfo:", linkInfo);
    }

    await browser.close();
  } catch (e) {
    console.log("e: ", e);
  }
})();
