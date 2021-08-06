var fs = require("fs");
const request = require("request");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const createCSVWriter = require("csv-writer").createObjectCsvWriter;

// const stitchedSite = "https://pk.khaadi.com/ready-to-wear.html";
// const stitchedImgDLPath = "./data/img/khaadi/stitched/";
// const stitchedCsvDLPath = "./data/khaadi_women_stitched.csv";

const unStitchedSite = "https://pk.khaadi.com/unstitched.html";
const unStitchedImgDLPath = "./data/img/khaadi/unstitched/";
const unStitchedCsvDLPath = "./data/khaadi_women_unstitched.csv";

const currentSite = unStitchedSite;
const currentDLPath = unStitchedImgDLPath;
const currentCSVPath = unStitchedCsvDLPath;
const imgFormat = "webp";

//csv file setup
const csvWriter = createCSVWriter({
  path: currentCSVPath,
  header: [
    { id: "color", title: "COLOR" },
    { id: "design", title: "DESIGN" },
    { id: "fabric", title: "FABRIC" },
    { id: "img", title: "IMG" },
    { id: "price", title: "PRICE" },
    { id: "product_type", title: "PRODUCT_TYPE" },
    { id: "sku", title: "SKU" },
    { id: "technique", title: "TECHNIQUE" },
    { id: "title", title: "TITLE" },
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
  request(url).pipe(
    fs.createWriteStream(`${currentDLPath}${name}.${imgFormat}`)
  );
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

// const getImages = async page => {
//   const imgs = [];
//   imgs.push(
//     await page.evaluate(() => {
//       return document.querySelector("img.fotorama__img").getAttribute("src");
//     })
//   );
//   await page.waitforTimeout(7000);
//   let ref;
//   const a = await page.evaluate(async () => {
//     return document.querySelectorAll(".fotorama__nav__shaft ");
//     // img2.click();
//   });
//   // await page.waitFor(5000);
//   // const img1 = await page.evaluate(() => {
//   //   return document.querySelector("img.fotorama__img").getAttribute("src");
//   // });
//   // imgs.push(img1);
//   console.log("imgs", imgs);
// };

/*********************************************
 * MAIN FUNC
 ********************************************/
(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(`${currentSite}`, {
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

    // for (let k = 0; k < 1; k++) {
    //   const url = urls[k];
    //   const html = await fetchHtml(url);
    //   console.log("html: ", html);
    //   if (!html) {
    //     continue;
    //   } else {
    //     const $ = cheerio.load(html);
    //     console.log("$$$$$$$$$$$$$$$$$$$$$", $("div.fotorama__stage"));
    //     let linkInfo = {
    //       img: $(
    //         "div.fotorama__stage div.fotorama__stage__shaft div.fotorama__stage__frame img.fotorama__img"
    //       ).attr("src"),
    //       title: $("div.product-info-main div.product div.value").text(),
    //       price: $(
    //         "div.product-info-main div.price-box span.normal-price span.price-container span.price-wrapper span.price"
    //       ).text(),
    //     };

    //     try {
    //       await saveImageToDisk(linkInfo.img, linkInfo.title);
    //     } catch (err) {
    //       console.log("err: ", err);
    //     }
    //     console.log("linkinfo: ", linkInfo);
    //     payload.push(linkInfo);
    //     // await page.close();
    //   }
    // }
    const payload = [];
    for (let k = 0; k < urls.length; k++) {
      try {
        const url = urls[k];
        const page = await browser.newPage();
        await page.setViewport({
          width: 1980,
          height: 1800,
        });
        await page.goto(url);
        // await page.waitForSelector(".fotorama__nav__frame--thumb");
        await page.waitForSelector("img.fotorama__img");
        const title = await page.evaluate(() => {
          return document.querySelector(
            "div.product-info-main div.product div.value"
          ).innerHTML;
        });
        // const imgs = [];
        // const i = await page.evaluate(() => {
        //   return document
        //     .querySelector("img.fotorama__img")
        //     .getAttribute("src");
        // });
        // console.log("i: ", i);
        // imgs.push(i);
        // const jsHandle = await page.evaluateHandle(async () => {
        //   const ele = document.querySelector(
        //     ".fotorama-item .fotorama__nav-wrap .fotorama__nav__shaft .fotorama__nav__frame--thumb"
        //   );
        //   return ele;
        // });
        // jsHandle[1].click();
        // await page.waitForTimeout(3000);
        // const res = await page.evaluateHandle(el => {
        //   return document
        //     .querySelector("img.fotorama__img")
        //     .getAttribute("src");
        // }, jsHandle);
        // console.log("j: ", res);

        const linkInfo = {
          color: await page.evaluate(() => {
            return document
              .querySelector("div.swatch-option")
              .getAttribute("option-label");
          }),
          design: await page.evaluate(() => {
            return document.querySelector("div#Details div:nth-child(4)")
              .textContent;
          }),
          fabric: await page.evaluate(() => {
            return document.querySelector("div#Details div:nth-child(3)")
              .textContent;
          }),
          img: await page.evaluate(() => {
            return document
              .querySelector("img.fotorama__img")
              .getAttribute("src");
          }),
          price: await page.evaluate(() => {
            return document.querySelector(
              "div.product-info-main div.price-box span.normal-price span.price-container span.price-wrapper span.price"
            ).innerHTML;
          }),
          product_type: await page.evaluate(() => {
            return document.querySelector("div#Details div:nth-child(1)")
              .textContent;
          }),
          sku: await page.evaluate(() => {
            return document.querySelector("div.product.sku div.value")
              .innerHTML;
          }),
          technique: await page.evaluate(() => {
            return document.querySelector("div#Details div:nth-child(2)")
              .textContent;
          }),
          title: `${title}${k}`,
        };
        console.log("linkInfo", linkInfo);
        // const img = await page.evaluate(() => {
        //   return document.querySelector("img.fotorama__img").getAttribute("src");
        // });
        // console.log("ele", img);
        // const title = await page.evaluate(() => {
        //   return document.querySelector(
        //     "div.product-info-main div.product div.value"
        //   ).innerHTML;
        // });
        // console.log("title: ", title);
        // const price = await page.evaluate(() => {
        //   return document.querySelector(
        //     "div.product-info-main div.price-box span.normal-price span.price-container span.price-wrapper span.price"
        //   ).innerHTML;
        // });
        // console.log("price: ", price);

        try {
          await saveImageToDisk(linkInfo.img, linkInfo.title);
        } catch (err) {
          console.log("err: ", err);
        }
        // console.log("linkinfo: ", linkInfo);
        payload.push(linkInfo);
        await page.close();
      } catch (err) {
        console.log("error within loop", err);
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
