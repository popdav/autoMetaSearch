const axios = require('axios');
const cheerio=require('cheerio');

const url  = 'https://www.mojauto.rs/rezultat/status/automobili/vozilo_je/polovan/poredjaj-po/oglas_najnoviji/po_stranici/20/prikazi_kao/lista/';
let mojModel = require('../models/MojAuto')
class MojAutoScrap {
    constructor(url) {
        this.url = url;
    }

    scrapeLoop() {
            axios.get(this.url, {

            }).then((response) => {

                if(response.status === 200) {
                    const html = response.data;
                    let $ = cheerio.load(html);

                    let numOfPages = this.numberOfPages($);
                    this.iteratePages(numOfPages);
                }
            })
            .then(() => {
                // setTimeout(this.scrapeLoop, 30000)
            })
            .catch( (error) => {
                console.log(error);
            })
    }

    scrapeCars(urls) {
        urls.forEach(url => this.scrapeCar(url));
    }

    scrapeUrls(url) {

        axios.get(url)
            .then((response) => {

                if(response.status === 200) {
                    const html = response.data;
                    let $ = cheerio.load(html);

                    let urls = $('div.addTitleWrap a').map((i, x) => $(x).attr('href')).toArray();
                    this.scrapeCars(urls);
                }

            }).catch((error) => {
            console.log(error);
        }).then(function () {

        });
    }

    iteratePages(numOfPages) {
        // const url = 'https://www.polovniautomobili.com/auto-oglasi/pretraga?page=1&sort=basic&brand=audi&city_distance=0&showOldNew=all&without_price=1';
        // console.log(numOfPages)
        for(let i=1;i<=5;i++) {
            let tmp_url = this.url + 'stranica/' + i;
            console.log(tmp_url)
            this.scrapeUrls(tmp_url)
        }
    }

    numberOfPages($) {
        const adds = $('.resultSortTop').find('span').text();
        const numOfAdds = parseFloat(adds.replace(/Prikazano 20 od (\d+[.]\d+) oglasa.*/g, '$1'))*1000;
        return Math.ceil(numOfAdds/20);
    }

    scrapeCar(url) {
        url = 'https://www.mojauto.rs' + url;
        // console.log(url);
        axios.get(url, {

        }).then((response) => {

            if(response.status === 200) {

                const html = response.data;
                let $ = cheerio.load(html);

                let carObj = {};
                carObj['logo'] = 'https://www.mojauto.rs/resources/images/logo-redesign.png';
                carObj['link'] = url;
                
                const picture = $('a#advertThumb_0').find('img').attr('src')
              
                carObj['slika'] = 'https://www.mojauto.rs' + picture
                let mainInfo = $('.singleBreadcrumb').text().trim();
                mainInfo = mainInfo.replace(/\s/g, "");
                carObj['Marka'] = mainInfo.replace(/\w+[>]\w+[>](\w+)[>].*/, '$1');
                carObj['Model'] = mainInfo.replace(/\w+[>]\w+[>]\w+[>](\w+)[>].*/, '$1');

                carObj['cena'] = $('.priceHigh span').text().replace(/(\d+[.]\d+).*/, '$1');

                let values = [];
                let fields = [];
                let generalInfo = $('h1').filter(function () {
                    return $(this).text().trim() === 'Tehnički podaci';
                }).next();
                let generalHtml = cheerio.load(generalInfo.html());
                let half = generalHtml('li').length;
                generalHtml('li').each(function (i, elem) {
                    let strong = $(elem).find('strong').text();
                    let span = $(elem).find('span').text();
                    if (i <= half) {
                        // console.log(span + " : " + strong);
                        fields.push(span);
                        values.push(strong);
                    }
                    else {
                        // console.log(strong + " : " + span);
                        fields.push(strong);
                        values.push(span);
                    }

                });

                for (let i=0; i<fields.length; i++) {
                    carObj[fields[i]] = values[i];
                }

                // console.log(generalInfo.html());

                let gearAttributes = [];
                let carGear = $('h1').filter(function () {
                    return $(this).text().trim() === 'Oprema';
                }).next();
                let gearHtml = cheerio.load(carGear.html());
                gearHtml('li').each(function (i, elem) {
                    gearAttributes.push($(elem).text().trim());
                });

                carObj['oprema'] = gearAttributes;

                // console.log(carObj);
                
                let newCar = new mojModel(carObj);
                newCar.save()
                .then(doc => {
                    console.log('Uspesno dodao ' + carObj['Marka'] + ' ' + carObj['Model'] + ', broj oglasa: ' + carObj['Broj oglasa: '] + '!')
                    })
                .catch(err => {
                    console.error(err)
                    throw err
                })
            }
        })
            .then(() => {
                // setTimeout(this.scrapeLoop, 30000)
            })
            .catch( (error) => {
                console.log(error);
            })
    }



}

module.exports = MojAutoScrap;

// let test = new MojAutoScrap('https://www.mojauto.rs/rezultat/status/automobili/vozilo_je/polovan/poredjaj-po/oglas_najnoviji/po_stranici/20/prikazi_kao/lista/');
// test.scrapeLoop();