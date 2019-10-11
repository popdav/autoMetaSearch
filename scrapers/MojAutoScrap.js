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

                    let links = $('div.addTitleWrap a').map((i, x) => $(x).attr('href')).toArray();
                    console.log(links);
                    links.forEach(link => this.scrapeCar(link))
                }
            })
            .then(() => {
                // setTimeout(this.scrapeLoop, 30000)
            })
            .catch( (error) => {
                console.log(error);
            })
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
                carObj['logo'] = 'https://www.mojauto.rs/resources/images/logo-redesign.png'
                carObj['link'] = url
                
                const picture = $('a#advertThumb_0').find('img').attr('src')
              
                carObj['slika'] = 'https://www.mojauto.rs' + picture
                let mainInfo = $('.singleBreadcrumb').text().trim();
                mainInfo = mainInfo.replace(/\s/g, "");
                carObj['Marka'] = mainInfo.replace(/\w+[>]\w+[>](\w+)[>].*/, '$1');
                carObj['Model'] = mainInfo.replace(/\w+[>]\w+[>]\w+[>](\w+)[>].*/, '$1');

                carObj['cena'] = $('.priceHigh span').text().replace(/(\d+[.]\d+).*/, '$1');

                $('.sidePanel li').find('span').each(function(i, elem) {

                    switch (i) {

                        case 0 :
                            carObj['Godište'] = $(elem).text();
                            break;
                        case 1:
                            carObj['Kubikaža'] = $(elem).text();
                            break;
                        case 2:
                            carObj['Kilometraža'] = $(elem).text();
                            break;
                        case 3:
                            carObj['Snaga motora'] = $(elem).text();
                            break;
                        case 4:
                            carObj['Karoserija'] = $(elem).text();
                            break;
                        case 5:
                            carObj['Gorivo'] = $(elem).text();
                            break;
                        case 15:
                            // carObj['Broj oglasa: '] = $(elem).text();


                    }
                });

                let gearAttributes = [];
                let carGear = $('h1').filter(function () {
                    return $(this).text().trim() === 'Oprema';
                }).next();
                let gearHtml = cheerio.load(carGear.html());
                gearHtml('li').each(function (i, elem) {
                    gearAttributes.push($(elem).text().trim());
                });

                carObj['oprema'] = gearAttributes;
                
                let newCar = new mojModel(carObj)
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