const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const createCSVWriter = require("csv-writer").createObjectCsvWriter;

const site = "https://www.generation.com.pk/kurtas.html?p=";

//csv file setup
const csvWriter = createCSVWriter({
  path: "data/generation.csv",
  header: [
    { id: "url", title: "URL" },
    // { id: "Title", title: "Title" },
  ],
});

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // page.on("response", async response => {
    //   const url = response.url();
    //   if (response.request().resourceType() === "image") {
    //     response.buffer().then(file => {
    //       const fileName = url.split("/").pop();
    //       const filePath = path.resolve(__dirname, fileName);
    //       const writeStream = fs.createWriteStream(filePath);
    //       writeStream.write(file);
    //     });
    //   }
    // });

    await page.goto(`${site}1`);

    // get total page count
    const ttlPages = await page.evaluate(() => {
      const ele = document.querySelector(
        "ul.pages-items > li.current > strong.page > span"
      ).innerHTML;
      return ele.split("Of")[1].trim();
    });

    // console.log("c : ", ttlPages);

    const collection = [];

    // loop starting from page 1 to last page
    for (let i = 1; i <= 2; i++) {
      // already on page 1, so no need to goto the page
      i > 1 ? await page.goto(`${site}${i}`) : false;

      const urls = await page.evaluate(() => {
        let products = [];
        let items = document.querySelectorAll("a.product-item-photo");
        items.forEach(item => {
          products.push({
            url: item.getAttribute("href"),
          });
        });
        return products;
      });

      collection.push(urls);
    }

    const payload = [];
    //  for(let urls of collection){
    for (let j = 0; j < collection.length; j++) {
      const pageCollection = collection[j];
      // for (const o of urls) {
      for (let k = 0; k < pageCollection.length; k++) {
        const curRef = pageCollection[k];
        const page = await browser.newPage();

        await page.goto(curRef.url);
        let linkInfo = await page.evaluate(() => ({
          img: document
            .querySelector("div.all-img > a > img")
            .getAttribute("src"),
          title: document.querySelector("h1.page-title > span").innerHTML,
          price: document.querySelector(
            "div.product-info-price > span > span > span.price"
          ).innerHTML,
          // description: document.querySelector(
          //   "div#product.info.overview > div.product > div.value > b"
          // ).innerHTML,
        }));
        payload.push(linkInfo);
        await page.close();
      }
    }

    console.log("payload:", payload);

    await browser.close();

    // Save extracted items to a file.
    // await fs.writeFileSync("./items.txt", payload.join("\n") + "\n");

    await csvWriter
      .writeRecords(collection[0])
      .then(() => console.log("The CSV file was written successfully"));
  } catch (e) {
    console.log("e: ", e);
  }
})();
