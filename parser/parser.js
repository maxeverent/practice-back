const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

class Parser {
    loadProd = async (req, res) => {
        try {
            const salads = [];
            const firstDish = [];
            const sideDish = [];
            const secondDish = [];

            const browser = await puppeteer.launch({
                defaultViewport: {
                    width: 500,
                    height: 500,
                }
            });    
            const page = await browser.newPage();  
            await page.goto('https://avhm.ru/salaty#2');   
            const data = await page.evaluate(() => {         
                return {
                    html: document.documentElement.innerHTML,
                    w: document.documentElement.clientWidth,
                    h: document.documentElement.clientHeight,
                }
            });    
            let $ = cheerio.load(data.html);   
            $('.js-product.t-store__card.t-col.t-col_4.t-align_left.t-item').each((i, item) => {
                let sItem = {
                    name: $(item).find('div.js-store-prod-name.js-product-name.t-store__card__title.t-name.t-name_md').text(),
                    descr: $(item).find('div.js-store-prod-descr.t-store__card__descr.t-descr.t-descr_xxs').text(),
                    price: $(item).find('div.js-product-price.js-store-prod-price-val.t-store__card__price-value.notranslate').text()
                };
                    salads.push(sItem);
            })
            await page.click('#nav245165051 > div > div.t228__centerside > nav > ul > li:nth-child(2) > a');
            await page.click('#nav245165051 > div > div.t228__centerside > nav > ul > li:nth-child(2) > div > div > div > ul > li:nth-child(4) > a');
            await page.waitForTimeout(700);            
            const data2 = await page.evaluate(() => {         
                return {
                    html: document.documentElement.innerHTML,
                    w: document.documentElement.clientWidth,
                    h: document.documentElement.clientHeight,
                }
            }); 
            $ = cheerio.load(data2.html);
            $('.js-product.t-store__card.t-col.t-col_4.t-align_left.t-item').each((i, item) => {
                let fItem = {
                    name: $(item).find('div.js-store-prod-name.js-product-name.t-store__card__title.t-name.t-name_md').text(),
                    descr: $(item).find('div.js-store-prod-descr.t-store__card__descr.t-descr.t-descr_xxs').text(),
                    price: $(item).find('div.js-product-price.js-store-prod-price-val.t-store__card__price-value.notranslate').text()
                };
                firstDish.push(fItem);
            })
            await page.click('#nav245165051 > div > div.t228__centerside > nav > ul > li:nth-child(2) > a');
            await page.click('#nav245165051 > div > div.t228__centerside > nav > ul > li:nth-child(2) > div > div > div > ul > li:nth-child(6) > a');
            await page.waitForTimeout(700);
            const data3 = await page.evaluate(() => {         
                return {
                    html: document.documentElement.innerHTML,
                    w: document.documentElement.clientWidth,
                    h: document.documentElement.clientHeight,
                }
            });   
            $ = cheerio.load(data3.html);  
            $('.js-product.t-store__card.t-col.t-col_4.t-align_left.t-item').each((i, item) => {
                let sItem = {
                    name: $(item).find('div.js-store-prod-name.js-product-name.t-store__card__title.t-name.t-name_md').text(),
                    descr: $(item).find('div.js-store-prod-descr.t-store__card__descr.t-descr.t-descr_xxs').text(),
                    price: $(item).find('div.js-product-price.js-store-prod-price-val.t-store__card__price-value.notranslate').text()
                };
                sideDish.push(sItem);
            })

            await page.click('#nav245165051 > div > div.t228__centerside > nav > ul > li:nth-child(2) > a');
            await page.click('#nav245165051 > div > div.t228__centerside > nav > ul > li:nth-child(2) > div > div > div > ul > li:nth-child(5) > a');
            await page.waitForTimeout(700);
            const data4 = await page.evaluate(() => {         
                return {
                    html: document.documentElement.innerHTML,
                    w: document.documentElement.clientWidth,
                    h: document.documentElement.clientHeight,
                }
            });  
            $ = cheerio.load(data4.html);   
            $('.js-product.t-store__card.t-col.t-col_4.t-align_left.t-item').each((i, item) => {
                let sItem = {
                    name: $(item).find('div.js-store-prod-name.js-product-name.t-store__card__title.t-name.t-name_md').text(),
                    descr: $(item).find('div.js-store-prod-descr.t-store__card__descr.t-descr.t-descr_xxs').text(),
                    price: $(item).find('div.js-product-price.js-store-prod-price-val.t-store__card__price-value.notranslate').text()
                };
                secondDish.push(sItem);
            })
            await browser.close();

            const result = [
                {
                    cat: 'Первые блюда',
                    items: firstDish
                },
                {
                    cat: 'Вторые блюда',
                    items: secondDish
                },
                {
                    cat: 'Гарниры и соусы',
                    items: sideDish
                },
                {
                    cat: 'Салаты',
                    items: salads
                },
            ];
            return res.status(200).json(result)
        } catch(e) {
            console.log(e)
            return res.status(400).json("Error");
        }
    };
};


module.exports = new Parser();