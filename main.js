const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const request = require("request");
const cheerio = require("cheerio");
const alMatchObj = require("./allmatch");
const fs = require("fs");
const path = require("path");

let iplPath = path.join(__dirname, "ipl");
dirCreator(iplPath);

request(url, cb);

function cb(err, response, html){
    if(err){
        console.log(err);
    }else{
        extractLink(html);
    }
}

function extractLink(html){
    let $ = cheerio.load(html);
    let link = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2>a").attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    alMatchObj.gAlMatch(fullLink);
}

function dirCreator(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}

