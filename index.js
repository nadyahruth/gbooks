// imports
import fetch, { fileFrom } from "node-fetch";
import bodyParser from "body-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import responseTime from "response-time";

const app = express();
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "/public")));
app.use(responseTime());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.listen(3000, function () {
  console.log("running on port 3000");
});

var apiUrl;
let q;
var authors = [];
var pubDates = [];
var firstPub;
var lastestPub;
var count = 0;
var modalCount = [];
var items = [];
var totalItems;
var maxEl;
var maxCount;
//sending client to landing page
app.get("/", (req, res) => {
  res.render(__dirname + "/views/app.ejs");
});

//info I need from landing page
app.post("/", (req, res) => {
  q = req.body.search;
  let apiKey = "AIzaSyD5SSDVg9TSEEmGL4qqMw1J7eNecl3ZZw8";
  let maxResults = 9;
  var page = 1;
  var startIndex = page * maxResults;
  page++;
  apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=${maxResults}&startIndex=${startIndex}&key=${apiKey}`;
  console.log(apiUrl);
  fetchBookData(apiUrl);

  //console.log(fetchBookData(apiUrl));

  res.render(__dirname + "/views/results", {
    totalResults: totalItems,
    items: items,
    resTime: resTime,
    firstPub: firstPub,
    lastestPub: lastestPub,
    commonAuthor: maxEl,
    modalId: modalCount,
  });
  var resTime = res.get("X-Response-Time");
  //console.log(resTime);
});

async function fetchBookData(url) {
  await fetch(url).then((data) => {
    return data.json().then((apiData) => {
      items = apiData.items;
      console.log(items.length); //9
      totalItems = apiData.totalItems;
      authors = [];
      pubDates = [];
      firstPub;
      lastestPub;
      count = 0;
      modalCount = [];

      for (var i = 0; i < items.length; i++) {
        var date = items[i].volumeInfo.publishedDate;
        var author = items[i].volumeInfo.authors;
        authors.push(author);
        pubDates.push(date);
        count++;
        modalCount.push(count);
      }

      firstPub = pubDates.sort().splice(0, 1);
      lastestPub = pubDates.sort().splice(pubDates.length - 1);
      // console.log(firstPub)
      // console.log(lastestPub)
      // console.log(count)
      // console.log(modalCount)
      if (authors.length == 0) return null;
      var modeMap = {};
      (maxEl = authors[0]), (maxCount = 1);
      for (var i = 0; i < authors.length; i++) {
        var el = authors[i];
        if (modeMap[el] == null) modeMap[el] = 1;
        else modeMap[el]++;
        if (modeMap[el] > maxCount) {
          maxEl = el;
          maxCount = modeMap[el];
        }
      }
      // console.log( maxEl)
      //var resTime = res.get("X-Response-Time");
      //console.log(resTime);
    });
  });
}
