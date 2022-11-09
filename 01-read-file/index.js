const fs = require('fs');
const path = require('path');
const address = path.join(__dirname,'text.txt');
const reader = fs.ReadStream(address, 'utf-8');

 reader.on('data', (chunk) =>{
    console.log(chunk);
 })