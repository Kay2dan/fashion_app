const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const createCSVWriter = require("csv-writer").createObjectCsvWriter;

const url = "https://www.generation.com.pk/kurtas.html?p=";

//csv file setup
const csvWriter = createCSVWriter({
  path: "out.csv",
  // header: [
  //   { id: "Username", title: "Username" },
  //   { id: "Title", title: "Title" },
  //   { id: "Body", title: "Body" },
  //   { id: "Date", title: "Date" },
  // ],
});

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(`${url}1`);

    // get total page count
    const ttlPages = await page.evaluate(() => {
      const ele = document.querySelector(
        "ul.pages-items > li.current > strong.page > span"
      ).innerHTML;
      return ele.split("Of")[1].trim();
    });

    console.log("c : ", ttlPages);

    const collection = [];

    // loop starting from page 1 to last page
    for (let i = 1; i <= 5; i++) {
      i > 1 ? await page.goto(`${url}${i}`) : false;

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

      collection.push(urls);

      //  const payload = [];
      //   for (const o of urls) {
      //     const page = await browser.newPage();
      //     await page.goto(o.url);
      //     let linkInfo = await page.evaluate(() => ({
      //       img: document
      //         .querySelector("div.all-img > a > img")
      //         .getAttribute("src"),
      //       title: document.querySelector("h1.page-title > span").innerHTML,
      //       price: document.querySelector(
      //         "div.product-info-price > span > span > span.price"
      //       ).innerHTML,
      //     }));
      //     payload.push(linkInfo);
      //     page.close();
      //   }
      //   console.log("payload:", payload);
    }

    console.log("collection : ", collection);

    await browser.close();

    // Save extracted items to a file.
    // await fs.writeFileSync("./items.txt", payload.join("\n") + "\n");

    // await csvWriter
    //   .writeRecords(payload)
    //   .then(() => console.log("The CSV file was written successfully"));
  } catch (e) {
    console.log("e: ", e);
  }
})();
