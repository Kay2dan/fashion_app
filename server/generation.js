var fs = require("fs");
const request = require("request");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const createCSVWriter = require("csv-writer").createObjectCsvWriter;

const site = "https://www.generation.com.pk/kurtas.html?p=";

//csv file setup
const csvWriter = createCSVWriter({
  path: "data/generation.csv",
  header: [
    { id: "img", title: "IMG" },
    { id: "title", title: "TITLE" },
    { id: "price", title: "PRICE" },
  ],
});

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
  request(url).pipe(fs.createWriteStream(`./data/img/generation/${name}.png`));
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

    const collection = [];
    // get product links from all the paginated pages
    for (let i = 1; i <= ttlPages; i++) {
      // already on page 1, so no need to goto the page
      i > 1 ? await page.goto(`${site}${i}`) : false;

      const urls = await page.evaluate(() => {
        let products = [];
        let items = document.querySelectorAll("a.product-item-photo");
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
      // const page = await browser.newPage();
      // await page.goto(curRef.url);
      // let linkInfo = await page.evaluate(() => ({
      //   img: document
      //     .querySelector("div.all-img:first-child > a > img")
      //     .getAttribute("src"),
      //   title: document.querySelector("h1.page-title > span").innerHTML,
      //   price: document.querySelector(
      //     "div.product-info-price > span > span > span.price"
      //   ).innerHTML,
      //   // description: document.querySelector(
      //   //   "div#product.info.overview > div.product > div.value > b"
      //   // ).innerHTML,
      // }));
      // payload.push(linkInfo);
      // await page.close();

      const html = await fetchHtml(url);
      if (!html) {
        continue;
      } else {
        const $ = cheerio.load(html);
        let linkInfo;
        linkInfo = {
          img: $("div.all-img:first-child > a > img").attr("src"),
          title: $("h1.page-title > span").text(),
          price: $("div.product-info-price > span > span > span.price").text(),
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

    // Save extracted items to a file.
    // await fs.writeFileSync("./items.txt", payload.join("\n") + "\n");

    await csvWriter
      .writeRecords(payload)
      .then(() => console.log("The CSV file was written successfully"));
  } catch (e) {
    console.log("e: ", e);
  }
})();
