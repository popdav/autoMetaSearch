const axios = require('axios');
const cheerio=require('cheerio');
let fs = require('fs');

let polovniModel = require('../models/PolovniAutomobili')

const url = 'https://www.polovniautomobili.com/auto-oglasi/pretraga?page=1&sort=basic&brand=audi&city_distance=0&showOldNew=all&without_price=1';

class PolovniScrap {

    constructor(url) {
        this.url = url;
        // this.idMap = new Set()
    }

    scrapeLoop() {
        axios.get(this.url, {

        }).then((response) => {

            if(response.status === 200) {

                const html = response.data;
                let $ = cheerio.load(html);

                const pages = this.numberOfPages($);
                this.iteratePages(pages);
            }



        })
        .then(() => {
            // setTimeout(this.scrapeLoop.bind(this), 30000)
        })
        .catch( (error) => {
            console.log(error);
        })
    }

    scrapeCar(url) {
        axios.get(url)
        .then((response) => {

            if(response.status == 200) {

                const html = response.data;
                let $ = cheerio.load(html);

                let carObj = {};
                carObj['link'] = url
                carObj['logo'] = 'https://www.polovniautomobili.com/bundles/site/images/polovniautomobili-logo.svg'
                let pricesElems = $(".price-item");
                let cena = pricesElems.text().trim().slice(0, -2)
                if(cena !== 'Po dogovo' && cena !== '') 
                    cena = parseInt(cena.replace(/([0-9]+).([0-9]+)/g, '$1$2'))
                else
                    cena = -1
                carObj['cena'] = cena

                let picture = $('ul#image-gallery').children('li').first().attr('data-thumb');
                carObj['slika'] = picture;
                let generalInfo = $('section.classified-content').children('div.uk-grid').children();
                let keys = [];
                let vals = [];
                generalInfo.each((i, elem) => {
                    if(i % 2 === 0) {
                        keys.push($(elem).text())
                    } else {
                        vals.push($(elem).text())
                    }
                });
                
                for(let i=0; i<keys.length; i++){
                    if(keys[i] === 'Broj oglasa: ') {
                        vals[i] = parseInt(vals[i].replace(/\s*.*[:]\s*(\d+)\s*/g, '$1'));
                        // console.log(this.idMap.has(vals[i]))
                        // this.idMap.add(vals[i])
                    }
                    carObj[keys[i]] = vals[i]

                    if(keys[i] == 'Godište')
                        carObj[keys[i]] = parseInt(carObj[keys[i]].replace(/([0-9]+). godište/g, '$1'))
                    else if(keys[i] == 'Kilometraža')
                        carObj[keys[i]] = parseInt(carObj[keys[i]].replace(/([0-9]+).([0-9]+) km/g, '$1$2'))
                    else if(keys[i] == 'Kubikaža')
                        carObj[keys[i]] = parseInt(carObj[keys[i]].replace(/([0-9]+) cm3/g, '$1'))
                    else if(keys[i] == 'Snaga motora')
                        carObj[keys[i]] = parseInt(carObj[keys[i]].replace(/[0-9]+\/([0-9]+) \(kW\/KS\)/g, '$1'))
                    //198.000 km Snaga motora: 120/163 (kW/KS)
                }

                

                let carMetadata = $('h2').filter(function() {
                    return $(this).text().trim() === 'Karakteristike vozila';
                }).next();

                let characteristicsHTML = cheerio.load(carMetadata.html());
                keys = [];
                vals = [];
                characteristicsHTML('div').each(function (i) {
                    if(i % 2 === 0) {
                        keys.push(characteristicsHTML(this).text());
                    }
                    else {
                        vals.push(characteristicsHTML(this).text());
                    }
                });

                for(let i=0; i<keys.length; i++) {
                    carObj[keys[i]] = vals[i];
                    
                }

                let carSafety = $('h2').filter(function() {
                    return $(this).text().trim() === 'Sigurnost';
                }).next();
                
                let safetyAttributes = [];
                if(carSafety.html() !== null) {
                    let safetyHTML = cheerio.load(carSafety.html());

                    safetyHTML('div.uk-width-medium-1-3').each(function () {
                        safetyAttributes.push(safetyHTML(this).text());
                        // console.log(sigurnostHTML(this).text());//<div class="uk-width-medium-1-3 uk-width-1-2">ABS</div>
                    });
                }
                
                carObj['safetyAttributes'] = safetyAttributes;

                let carGear = $('h2').filter(function() {
                    return $(this).text().trim() === 'Oprema';
                }).next();

                let gearAttributes = [];
                if(carGear.html() !== null){
                    let gearHTML = cheerio.load(carGear.html());

                    gearHTML('div.uk-width-medium-1-3').each(function (i, e) {
                        gearAttributes.push(gearHTML(this).text());
                        // console.log(sigurnostHTML(this).text());//<div class="uk-width-medium-1-3 uk-width-1-2">ABS</div>
                    });
                }

                carObj['gearAttributes'] = gearAttributes;

                // console.log(carObj);

                let newCar = new polovniModel(carObj)
                newCar.save()
                .then(doc => {
                    console.log('Uspesno dodao ' + carObj['Marka'] + ' ' + carObj['Model'] + ', broj oglasa: ' + carObj['Broj oglasa: '] + '!')
                    })
                .catch(err => {
                    console.error(err)
                    throw err
                })
            }


        }).catch((error) => {
            console.log(error);
        }).then(function () {

        })

    }

    scrapeCars(urls) {
        // console.log(urls);
        urls.forEach(url => this.scrapeCar(url));
    }

    scrapeUrls(url) {
        let promiseUrl = []
        axios.get(url)
        .then((response) => {

            if(response.status === 200) {
                let urls = [];
                const html = response.data;
                let $ = cheerio.load(html);
                let carPreviews = $("script[type='application/ld+json']");
                for(let i in carPreviews){
                    for(let j in carPreviews[i].children){
                        let data = carPreviews[i].children[j].data;
                        if(data){
                            data = data.replace('[', '');
                            data = data.replace(']', '');
                            if(data.includes("brand")) {
                                let jsonObj =  JSON.parse(data);
                                promiseUrl.push(
                                    new Promise((resolve, reject) => {
                                        polovniModel.countDocuments({link: jsonObj['url'].trim()}, (err, count) => {
                                            if(err) throw err

                                            console.log('Broj: ' + count + ' link ' + jsonObj['url'].trim())
                                            if(count == 0)
                                                urls.push(jsonObj['url'].trim());
                                            resolve()
                                        });
                                    })
                                )
                                
                                
                            }
                        }
                    }
                }
                Promise.all(promiseUrl)
                .then(() => {
                    this.scrapeCars(urls);
                })
                
            }

        }).catch((error) => {
            console.log(error);
        }).then(function () {

        });
    }

    iteratePages(numOfPages) {
        // const url = 'https://www.polovniautomobili.com/auto-oglasi/pretraga?page=1&sort=basic&brand=audi&city_distance=0&showOldNew=all&without_price=1';
        // console.log(numOfPages)
        for(let i=1;i<=8;i++) {
            let tmp_url = this.url.replace(/page=\d+/i, 'page=' + i.toString());
            this.scrapeUrls(tmp_url)
        }
    }

    numberOfPages($) {
        let numberOfAds = 0;
        let table = $('.table');
        let tableElems = cheerio.load(table.html());
        tableElems('small').each(function () {
            let str = tableElems(this).text();
            let regex = new RegExp('Prikazano od 1 do 25 oglasa od ukupno ([0-9]*)', 'g');
            if(str.match(regex) !== null) {
                let ads = (str.match(regex))[0];
                numberOfAds = parseInt(ads.match(/[1-9][0-9][0-9]+/g)[0]);
            }
        });
        let pages = Math.ceil(numberOfAds/25);
        return pages;
    }

}

module.exports = PolovniScrap;