const request = require('request-promise');
const cheerio=require('cheerio');
const fs=require("fs");
const json2csv=require('json2csv').Parser;

const players = ["https://en.wikipedia.org/wiki/Jason_Roy",
"https://en.wikipedia.org/wiki/Alex_Hales",
"https://en.wikipedia.org/wiki/Sam_Curran"
];

(async()=> {
    let playerData= []

    for(let player of players){
        const response= await request({
            uri: player,
            headers: {
                Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Encoding":
                "gzip, deflate, br",
                "Accept-Language":
                "en-GB,en-US;q=0.9,en;q=0.8",
            },
            gzip: true
        });
        
        let $ = cheerio.load(response)
        let name = $('div.fn:first').text();
        let batting = $('td.infobox-data.category:first').text();
        let role = $('td.infobox-data.role:first').text();
        let sourceDate = $('a + span.nowrap:first').text();
    
        playerData.push({
            name, batting, role, sourceDate
        });
    }

    const j2cv = new json2csv()
    const csv = j2cv.parse(playerData)

    fs.writeFileSync("./Data.csv", csv , "utf-8");
})();