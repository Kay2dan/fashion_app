var fs = require("fs");
const request = require("request");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const createCSVWriter = require("csv-writer").createObjectCsvWriter;

const stitchedSite = "https://pk.khaadi.com/ready-to-wear.html";
const stitchedImgDLPath = "./data/img/khaadi/stitched";
const stitchedCsvDLPath = "./data/khaadi_women_stitched.csv";

// const unStitchedSite = "https://pk.khaadi.com/unstitched.html";
// const unStitchedImgDLPath = "./data/img/khaadi/unstitched";
// const unStitchedCsvDLPath = "./data/khaadi_women_unstitched.csv";

//csv file setup
const csvWriter = createCSVWriter({
  path: stitchedCsvDLPath,
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
  request(url).pipe(fs.createWriteStream(`${imgDLPath}${name}.png`));
  // var fullUrl = url;
  // var file = fs.createWriteStream(localPath);
  // var request = https.get(url, function (response) {
  //   response.pipe(file);
  // });
}

// async function scrapeInfiniteScrollItems(
//   page,
//   counter = 50,
//   scrollDelay = 1000
// ) {
//   try {
//     let previousHeight;
//     // while (currentCounter < counter) {
//     for (let i = 0; i < counter; i++) {
//       // items = await page.evaluate(extractItems);
//       // previousHeight = await page.evaluate("document.body.scrollHeight");
//       // console.log("prev: ", previousHeight);
//       const btn = await page.evaluate(() => {
//         const ele = document.querySelector("div.infinite-loader");
//         ele.click();
//       });
//       // console.log("btn: ", btn);
//       // btn.click();
//       const newHeight =
//         (await page.evaluate("document.body.scrollHeight")) - 500;
//       console.log("new: ", newHeight);
//       await page.evaluate(`window.scrollTo(0, ${newHeight})`);
//       await page.waitFor(scrollDelay);
//       // await page.waitForFunction(`${newHeight} > ${previousHeight}`);
//       i++;
//     }
//   } catch (e) {}
// }

async function scrapeInfiniteScrollItems(
  page,
  counter = 50,
  scrollDelay = 3000
) {
  try {
    for (let i = 0; i < counter; i++) {
      const btn = await page.evaluate(() => {
        const ele = document.querySelector(
          "div.infinite-loader a.btn-load-more"
        );
        ele.click();
      });
      await page.waitFor(scrollDelay);
      i++;
    }
  } catch (e) {}
}

/***
 * MAIN FUNC
 */
(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(`${stitchedSite}`, {
      waitUntil: "domcontentloaded",
    });

    // load all the infinite-scroll pages
    await scrapeInfiniteScrollItems(page);

    const urls = await page.evaluate(() => {
      const eles = document.querySelectorAll("div.product-item-photo a");
      const collection = [];
      eles.forEach(ele => {
        collection.push(ele.getAttribute("href"));
      });
      return collection;
    });

    const payload = [];

    for (let k = 0; k < urls.length; k++) {
      const url = urls[k];
      const html = await fetchHtml(url);
      console.log("html: ", html);
      if (!html) {
        continue;
      } else {
        const $ = cheerio.load(html);
        console.log("$");
        let linkInfo = {
          img: $(
            "div.fotorama__stage div.fotorama__stage__shaft div.fotorama__stage__frame img.fotorama__img"
          ).attr("src"),
          title: $("div.product-info-main div.product div.value").text(),
          price: $(
            "div.product-info-main div.price-box span.normal-price span.price-container span.price-wrapper span.price"
          ).text(),
          // price: $(
          //   "div.product-info-price div.price-box span.price-container span.price-wrapper span.price"
          // ).text(), // for women unstitched
        };

        // try {
        //   await saveImageToDisk(linkInfo.img, linkInfo.title);
        // } catch (err) {
        //   console.log("err: ", err);
        // }
        // console.log("linkinfo: ", linkInfo);
        payload.push(linkInfo);
        // await page.close();
      }
    }

    // console.log("payload", payload);
    await browser.close();

    await csvWriter
      .writeRecords(payload)
      .then(() => console.log("The CSV file was written successfully"));
  } catch (e) {
    console.log("e: ", e);
  }
})();
