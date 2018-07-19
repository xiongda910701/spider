const https=require('https');
const fs=require('fs');
const path=require('path');
const request=require('request');
const cheerio = require('cheerio');



const url='https://blog.csdn.net/Buddha_ITXiong';
fetchData(url);

function fetchData(url) {
    https.get(url, (res) => {
        debugger;
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
        let error;
        if (statusCode !== 200) {
            error = new Error('请求失败。\n' + `状态码: ${statusCode}`);
        }
        if (error) {
            console.error(error.message);
            res.resume();// 消耗响应数据以释放内存
            return;
        }
        res.setEncoding('utf8');
        let html = '';
        res.on('data', (chunk) => { html += chunk; });
        res.on('end', () => {
            try {
                const $ = cheerio.load(html); //采用cheerio模块解析html
                let list=[];
                const item=$('.article-item-box');//获取文章列表每项
                console.log(item);
                for (let i=0;i<item.length;i++){
                    const type=$(item[i]).find('.text-truncate .article-type').text().trim();//类型
                    const title=$(item[i]).find('.text-truncate a').text().trim();//标题
                    const content=$(item[i]).find('.content').text().trim();//内容
                    const date=$(item[i]).find('.date').text();//日期
                    const readNum=$(item[i]).find('.read-num').text();//阅读数量
                    const commentNum=$(item[i]).find('.read-num').text();//评论数量
                    let obj={type:type,title:title, content:content, date:date, readNum:readNum, commentNum:commentNum};
                    list.push(obj);
                }
                console.log(list);
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`错误: ${e.message}`);
    });
}