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

                    let urls = $('div.addTitleWrap a').map((i, x) => {
                        let linkScrap = /**/ $(x).attr('href').trim()
                        return linkScrap
                    })
                    .toArray();
                    // console.log(urls)
                    let promiseUrls = []
                    for(let i=0; i<urls.length; i++){
                        let linkFind = 'https://www.mojauto.rs' + urls[i]
                        promiseUrls.push( 
                            new Promise((resolve, reject) => {
                                mojModel.countDocuments({link:  linkFind}, (err, count) => {
                                    if(err) throw err
                                    
                                    console.log('Broj: ' + count + ' link: ' + linkFind)
                                    if(count != 0)
                                        urls.splice(i)
                                    resolve()
                                })
                            })
                        )
                    }
                    Promise.all(promiseUrls)
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
        for(let i=1;i<=10;i++) {
            let tmp_url = this.url + 'stranica/' + i;
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

                carObj['Marka'] = carObj['Marka'] == 'AlfaRomeo' ? 'Alfa Romeo' : carObj['Marka']
                carObj['Marka'] = carObj['Marka'] == 'Mercedes' ? 'Mercedes Benz' : carObj['Marka']
                carObj['Marka'] = carObj['Marka'] == 'VW' ? 'Volkswagen' : carObj['Marka']
                
                
                let cena =  $('.priceHigh span').text().replace(/(\d+[.]\d+).*/, '$1')
                if(cena !== 'DogovorDogovor' && cena !== '') 
                    cena = parseInt(cena.replace(/([0-9]+).([0-9]+)/g, '$1$2'))
                else
                    cena = -1

                carObj['cena'] = cena;
                
                carObj['Godište'] = $('.basicSingleData').children().eq(1).children().first().text()
                carObj['Godište'] = parseInt(carObj['Godište'].replace(/([0-9]+). godište/g, '$1'))
                carObj['Gorivo'] = $('.basicSingleData').children().eq(3).children().last().text()

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
                    switch(fields[i]){
                        case 'Kategorija':
                            carObj['Karoserija'] = values[i];
                            break;
                        case 'Snaga':
                                carObj['Snaga motora'] = parseInt(values[i].replace(/([0-9]+) KS \([0-9]+ KW\)/g, '$1'));;
                                break;
                        case 'Prešao kilometara':
                                carObj['Kilometraža'] =  parseInt(values[i].replace(/([0-9]+).([0-9]+) km/g, '$1$2'));
                                //carObj[keys[i]] = carObj[keys[i]].replace(/([0-9]+.[0-9]+) km/g, '$1')
                                break;
                        default:
                            carObj[fields[i]] = values[i];
                    }

                    if(fields[i] == 'Kubikaža')
                        carObj[fields[i]] = parseInt(carObj[fields[i]].replace(/([0-9]+) cm3/g, '$1'))
                    
                }
                // console.log(carObj)
                // console.log(generalInfo.html());

                let gearAttributes = [];
                let carGear = $('h1').filter(function () {
                    return $(this).text().trim() === 'Oprema';
                }).next();
                if(carGear.html() !== null){
                    let gearHtml = cheerio.load(carGear.html());
                    gearHtml('li').each(function (i, elem) {
                        gearAttributes.push($(elem).text().trim());
                    });
                }
                carObj['oprema'] = gearAttributes;

                // console.log(carObj);
                
                let newCar = new mojModel(carObj);
                newCar.save()
                .then(doc => {
                    console.log('Uspesno dodao ' + carObj['Marka'] + ' ' + carObj['Model'] + '!')
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