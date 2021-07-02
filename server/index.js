var fs = require("fs");
const fse = require("fs-extra");
const request = require("request");
var https = require("https");
const path = require("path");
// const axios = require("axios");
// const cheerio = require("cheerio");
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

//Node.js Function to save image from External URL.
function saveImageToDisk(url, name, localPath) {
  request(url).pipe(fs.createWriteStream(`./data/img/${name}.png`));
  // var fullUrl = url;
  // var file = fs.createWriteStream(localPath);
  // var request = https.get(url, function (response) {
  //   response.pipe(file);
  // });
}

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
    for (let i = 1; i <= 3; i++) {
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

    const flatCollection = collection.flat();

    const payload = [];
    //  for(let urls of collection){
    for (let k = 0; k < flatCollection.length; k++) {
      const curRef = flatCollection[k];
      const page = await browser.newPage();

      await page.goto(curRef.url);
      let linkInfo = await page.evaluate(() => ({
        img: document
          .querySelector("div.all-img:first-child > a > img")
          .getAttribute("src"),
        title: document.querySelector("h1.page-title > span").innerHTML,
        price: document.querySelector(
          "div.product-info-price > span > span > span.price"
        ).innerHTML,
        // description: document.querySelector(
        //   "div#product.info.overview > div.product > div.value > b"
        // ).innerHTML,
      }));
      console.log("linkinfo: ", linkInfo);
      try {
        // const fPath = `./data/${linkInfo.title}`;
        // await fs.promises.mkdir(fPath, {
        //   recursive: true,
        // });
        saveImageToDisk(linkInfo.img, linkInfo.title);
      } catch (err) {
        console.log("err: ", err);
      }
      payload.push(linkInfo);
      await page.close();
    }

    await browser.close();

    // Save extracted items to a file.
    // await fs.writeFileSync("./items.txt", payload.join("\n") + "\n");

    await csvWriter
      .writeRecords(flatCollection)
      .then(() => console.log("The CSV file was written successfully"));
  } catch (e) {
    console.log("e: ", e);
  }
})();
