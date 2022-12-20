// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");   
// Venue date opponent result runs balls fours sixes strikerate
// home page

function processScoreCard(url){
    request(url, function(err, response, html){
        if(err){
            console.log(err);
        }else{
            extractMatchDetails(html);
        }
    });
}

function extractMatchDetails(html){
    let $ = cheerio.load(html);
    // ipl
        // team
            // player
                // runs balls fours sixes strikerate opponent venue date
    // common for both the teams -> venue date result
    let matchDesc = $(".ds-grow>div.ds-text-tight-m");
    matchDesc = matchDesc.text().split(",");
    let venue = matchDesc[1].trim();
    let date = matchDesc[2].trim();
    // console.log("venue is", venue, "date is", date);
    let result = $("p.ds-text-tight-m").text();
    // console.log(result);
    
    let innings = $(".ds-rounded-lg.ds-mt-2");
     
    for(let i=0; i<innings.length; i++){
        let currInnings = innings[i];
        let team = $(currInnings).find("span.ds-text-title-xs.ds-capitalize").text();
        let opponentidx = (i == 0) ? 1:0;
        let opponentTeam = $(innings[opponentidx]).find("span.ds-text-title-xs.ds-capitalize").text();
        // console.log(`${venue} ${date} ${team} ${opponentTeam} ${result}`)

        let batsmanTable = $(currInnings).find(".ds-table")[0];
        // console.log($(batsmanTable).html());
        let allRows = $(batsmanTable).find("tbody tr");
        let player = {};
        for(let j=0; j<allRows.length; j++){
            let allCols = $(allRows[j]).find("td");
            if(allCols.length == 8){
                player.name = $(allCols[0]).text().trim();
                player.runs = $(allCols[2]).text().trim();
                player.balls = $(allCols[3]).text().trim();
                player.fours = $(allCols[5]).text().trim();
                player.sixes = $(allCols[6]).text().trim();
                player.sr = $(allCols[7]).text().trim();
                player.venue = venue;
                player.opponentTeam = opponentTeam;
                player.date = date;
                player.team = team;
                player.result = result;
                // console.log(`${player.name} ${player.runs} ${player.balls} ${player.fours} ${player.sixes} ${player.sr}`)
                processPlayer(player);
            }
        }
    }
}

function processPlayer(player){
    let teamPath = path.join(__dirname, "ipl", player.team);
    dirCreator(teamPath);
    let filePath = path.join(teamPath, player.name + ".xlsx");
    let content = excelReader(filePath, player.name);
    content.push(player);
    excelWriter(filePath, content, player.name);
}
 
function excelWriter(filePath, json, sheetName){
    // new workbook
    let newWB = xlsx.utils.book_new();
    // write file
    let newWS = xlsx.utils.json_to_sheet(json);
    // new worksheet json data -> excel format convert
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    // new wb, ws, shhet name
    xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName){
    if(fs.existsSync(filePath) == false){
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

function dirCreator(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}
module.exports= {
    ps : processScoreCard
}