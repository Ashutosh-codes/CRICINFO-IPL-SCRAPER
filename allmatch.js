const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scorecard");

function getAllMatchesLink(url){
    request(url, function (err, response, html){
        if(err){
            console.log(err);
        }else{
            extractAllLinks(html);
        }
    });
}

function extractAllLinks(html){
    let $ = cheerio.load(html);
    // console.log("hrfdlsjf");    
    let scorecardLinks = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent>a");
    console.log(scorecardLinks.length);
    for(let i=0; i<scorecardLinks.length; i++){
        let link = $(scorecardLinks[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com"+link;
        console.log(fullLink);
        scoreCardObj.ps(fullLink);
    }
}

module.exports = {
    gAlMatch : getAllMatchesLink
}