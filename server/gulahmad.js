var fs = require("fs");
const request = require("request");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const createCSVWriter = require("csv-writer").createObjectCsvWriter;

const site = "https://www.gulahmedshop.com/eid-shopping-2021/women?p=";

//csv file setup
const csvWriter = createCSVWriter({
  path: "data/generation.csv",
  header: [
    { id: "img", title: "IMG" },
    { id: "title", title: "TITLE" },
    { id: "price", title: "PRICE" },
  ],
});

// fetch the page
const fetchHtml = async url => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    console.error(
      `ERROR: An error occurred while trying to fetch the URL: ${url}`
    );
  }
};

//Node.js Function to save image from External URL.
function saveImageToDisk(url, name, localPath) {
  request(url).pipe(fs.createWriteStream(`./data/img/gulahmad/${name}.png`));
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

    await page.goto(`${site}1`, {
      waitUntil: "domcontentloaded",
    });

    // get total page count
    const ttlPages = await page.evaluate(() => {
      return document.querySelector(
        "div.pages ul.items.pages-items li.item:nth-last-child(2) span:last-child"
      ).innerHTML;
    });

    console.log("ttlPages: ", ttlPages);

    const collection = [];
    // get product links from all the paginated pages
    for (let i = 1; i <= ttlPages; i++) {
      // already on page 1, so no need to goto the page
      i > 1 ? await page.goto(`${site}${i}`) : false;

      const urls = await page.evaluate(() => {
        let products = [];
        let items = document.querySelectorAll("a.product.product-item-photo");
        items.forEach(item => {
          products.push(item.getAttribute("href"));
        });
        return products;
      });

      collection.push(urls);
    }

    const flatCollection = collection.flat();

    const payload = [];

    for (let k = 0; k < flatCollection.length; k++) {
      const url = flatCollection[k];
      const html = await fetchHtml(url);
      if (!html) {
        continue;
      } else {
        const $ = cheerio.load(html);
        let linkInfo;
        linkInfo = {
          img: $("a.MagicZoom").attr("href"),
          title: $("div.product-info-main > div > h1.page-title > span").text(),
          price: $(
            "div.product-info-price div.price-box span.special-price span.price-container span:last-child"
          ).text(),
        };

        try {
          await saveImageToDisk(linkInfo.img, linkInfo.title);
        } catch (err) {
          console.log("err: ", err);
        }
        payload.push(linkInfo);
        // await page.close();
      }
    }

    console.log("payload", payload);
    await browser.close();

    await csvWriter
      .writeRecords(payload)
      .then(() => console.log("The CSV file was written successfully"));
  } catch (e) {
    console.log("e: ", e);
  }
})();
