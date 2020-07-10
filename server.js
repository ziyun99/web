const express = require('express');
const nodeMailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
// const poster = require('./poster.json');
const app = express();

const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const { promisify } = require('util');

const port = process.env.PORT || 8080


app.set('view engine','pug');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//global variables
var upload = multer({storage: multer.memoryStorage()});
var rows_announcement;
var rows_eventposter; 
var rows_menu;
var rows_keips;

//functions 

//print google spreadsheet
function printSheet(announcement){
    console.log(`Date: ${announcement.date}`);
    console.log(`Time: ${announcement.time}`);
    console.log(`Name: ${announcement.name}`);
    console.log(`Announcement: ${announcement.announcement}`);
    console.log('--------------------------');
}

function getDailyMenu(row_menu){
    //var menu_items;
    //console.log(rows_menu.length);
    for(const row_menu in rows_menu){
        console.log(`Day: ${row_menu.day}`);
        console.log(`Month: ${row_menu.month}`);
        console.log('--------------------------');
    }

    //return menu_items;
}

//read google spreadsheet
async function accessSpreadsheet(){
    //var creds = require('google-generated-creds.json');
    var creds = {
        client_email: "kiwi-298@kiwi-244814.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCYYzCMXNBdt1Ex\nPepwN8RmWWt5kMkcY4KneeZdkxJp2rQUmUXdmdSadp/2QJzCT5JpNnBbZ/6nJMpa\nAwWL66DxCBlu7zMoGAS32LQ2IypW0B15fwJftDqRjzkCbGT2Zc04cFyp/YgYuXeI\ncTieGycFBU37sb/T7W0nG7virGIrPXBgb1CPeZzLEcinvJQi25JQ21ainQI+SBrt\n/xFiPmY+SFWfIlBUQfcYFJahCngkAGY1vvQ3OuZG35Rzs9Unoe2o2sZnIdyeUmQ3\nbSW61EvuhwgQAWLvk5fV0z6WpBvpbwSn5Nxt6oTgjXVyBx3dWCH61IGaeWr3wcBS\nFhPHTbxnAgMBAAECggEAPcfpBN8UMwqBRl99zqUtYPlb01tZzcKiU9feB4365yOd\n4sQJSUB2q3DwhVvIshakmzdQ8h4FZipKR5f2BbYv98h61zjvGpAySX74AQLcxXl2\nma1efwKIxD62tD7R5/t56inTx69cH/oBdjXA6IjFlwmBhkuYJAmcOUDLOaj9291a\nmqZo3uhsTX98y+dRL7CA9oKI68+ib7MD8DDkDMBTEw69BqsejQgXZ8Eusg0bMk+Z\npiUSvLB413hGfygajpFC/syKxT+l6Dd5xKIi1UPc28xxLIrblOKk6WIkz6oJhd21\naa8gA2Y97tvW8K2bOkvV8AStfDT/XbCDgiqHD2c6oQKBgQDLfBpYl4RzGojxDw1o\nxSFk+LCyWPav5wdZYzKAMoCtN7rxXCZvKmaiYfePMbphnFbj2ru1HmT5jBY/dmKV\ntQKsocdelvqtB2oWR8ph+WjPCrWA6kep0dDWvH8kjU3vLxAxqqTELJR2k7e6cu/v\ne/UElYCmsPR2x44uXnYqwnek+QKBgQC/tyxBjCZO/y1E3MN4JZPwf+zUXNZNGxkG\na5fcnLVhbkii0TuJD259lY+absGEgjN7UxEJAkJNirxm+UjAqjek7AZ/tbEIArCO\nkOzmo8aw3S1W4tvZTKRjD9F9H7hS6/p5RlEEP4DIlykwrCXYsDW7aPawrvQgMarH\n+k+Z1vikXwKBgQC/E+GVkWphv+gaHR1lZb+vFkyunRXBJjvjd2ADu+jTP8L/RJ4e\nw30vPLmAMJ0pbeq1+j9Lm6gMIbz+iQeYNyq0uxIBQ9tPQegf1fg4ukDuMssvrE/x\nKsJl8wmdZEdrtBEL4oboZEhhdOMRZT7j7s2tKUpuvTpCk69y4WcrTgOV2QKBgDdi\nfomNKIAH3hcXw+yQxpVjD5MmIs7xtiARszSLnSbBioBm+9ETwTLMo0jVGFjkmGTX\nUYONwIPQQa9p8ueeBSdC/Hmmjrcmt8Tn/1h+FeeAbhm8vhCfwJnRtw5zvHdQLvMc\nKkmU4uqQKNkj0mcwOMWkhCf00xf94T2WhaqG3Rv3AoGAWTLJwPDWpVHBGqdZcxQ6\n6AsvTZg9hGZ0cQ5tMogYF7Wkhhk8YZXnXa5RbAfJgCwNMgKQXl0lRCftm+DJOysl\nu8R9Lv7oV9S5sGFM0MNyVWWqhKDhGOlrOKhi4++6bD5H2+8AzkiJ6FANvZ7Wv1kB\nROsnRyXby8PsNWyKQsfSNBQ=\n-----END PRIVATE KEY-----\n"
    }
    const doc_announcement = new GoogleSpreadsheet('1DiiJoWOBCDOlu7AdBsuX5mgmOssgoFKkUOn8p95GrfU');
    const doc_eventposter = new GoogleSpreadsheet('15WuaRdyth4nJZTHV0isaG_xJUmQcoc_PvgeHB3e-JL8');
    const doc_menu = new GoogleSpreadsheet('1FLT1rvaHUhDxyDUQYN-sfCaYlxJ2MJq-t7UQob_kXtw');
    const doc_keips = new GoogleSpreadsheet('1e7QyXiIseUD9dwNul5rOQHCmHZm3xQlI9364FQ9-A50');
    const doc_bookings = new GoogleSpreadsheet('1q3kn5GenBH_DeA2dcr7xsrZT1_2CRuvLFvH97deM1rQ');

    await promisify(doc_announcement.useServiceAccountAuth)(creds);
    await promisify(doc_eventposter.useServiceAccountAuth)(creds);
    await promisify(doc_menu.useServiceAccountAuth)(creds);
    await promisify(doc_keips.useServiceAccountAuth)(creds);
    await promisify(doc_bookings.useServiceAccountAuth)(creds);

    const info_announcement = await promisify(doc_announcement.getInfo)();
    const info_eventposter = await promisify(doc_eventposter.getInfo)();
    const info_menu = await promisify(doc_menu.getInfo)();
    const info_keips = await promisify(doc_keips.getInfo)();
    const info_bookings = await promisify(doc_bookings.getInfo)();

    const sheet_announcement = info_announcement.worksheets[0];
    const sheet_eventposter = info_eventposter.worksheets[0];
    const sheet_menu = info_menu.worksheets[0];
    const sheet_keips = info_keips.worksheets[0];
    const sheet_bookings = info_bookings.worksheets[0];

    // console.log('Loaded doc: '+info_announcement.title+' by '+info_announcement.author.email);
    // console.log(`Title: ${sheet_announcement.title} , Rows: ${sheet_announcement.rowCount} , Columns: ${sheet_announcement.colCount}`);
  
    // console.log('Loaded doc: '+info_eventposter.title+' by '+info_eventposter.author.email);
    // console.log(`Title: ${sheet_eventposter.title} , Rows: ${sheet_eventposter.rowCount} , Columns: ${sheet_eventposter.colCount}`);
  
    // console.log('Loaded doc: '+info_menu.title+' by '+info_menu.author.email);
    // console.log(`Title: ${sheet_menu.title} , Rows: ${sheet_menu.rowCount} , Columns: ${sheet_menu.colCount}`);

    // console.log('Loaded doc: '+info_keips.title+' by '+info_keips.author.email);
    // console.log(`Title: ${sheet_keips.title} , Rows: ${sheet_keips.rowCount} , Columns: ${sheet_keips.colCount}`);

    // console.log('Loaded doc: '+info_bookings.title+' by '+info_bookings.author.email);
    // console.log(`Title: ${sheet_bookings.title} , Rows: ${sheet_bookings.rowCount} , Columns: ${sheet_bookings.colCount}`);

    console.log("..........................");
  
    rows_announcement = await promisify(sheet_announcement.getRows)();
    rows_eventposter = await promisify(sheet_eventposter.getRows)();
    rows_menu = await promisify(sheet_menu.getRows)();
    rows_keips = await promisify(sheet_keips.getRows)();
    rows_bookings = await promisify(sheet_bookings.getRows)();

    // rowss.forEach(row => {
    //   printSheet(row);
    // })
}



//rendering and set up all webpages below:

app.get('/',(_req,res) =>{
    accessSpreadsheet();
    res.render('index',{
        row_announcement_1 : rows_announcement[0],
        row_announcement_2 : rows_announcement[1],
        row_announcement_3 : rows_announcement[2],
        
        rows_eventposter:rows_eventposter,
      });
});

app.get('/feedback-res',(req,res) =>{
    res.render('feedback-res');
});

app.get('/feedback-fac',(req,res) =>{
    res.render('feedback-fac');
});

app.get('/booking',(req,res) =>{
    res.render('booking');
});

app.get('/announcement',(req,res) =>{
    accessSpreadsheet();
    res.render('announcement',{
        rows_announcement:rows_announcement
    });
});


app.get('/menu',(req,res) =>{
    accessSpreadsheet();
    var breakfast1,breakfast2,breakfast3,breakfast4,breakfast5,meat1,meat2,meat3,vege1,vege2,vege3,side1,side2,side3,side4,special1,special2,special3,fruitanddessert,soup;
    var i;    
    var d = new Date();
    for(i=0; i< rows_menu.length; i++ ){
        if(rows_menu[i].date == d.getDate() && rows_menu[i].month == (d.getMonth()+1)  ){
            breakfast1 = rows_menu[i].breakfast1;
            breakfast2 = rows_menu[i].breakfast2;
            breakfast3 = rows_menu[i].breakfast3;
            breakfast4 = rows_menu[i].breakfast4;
            breakfast5 = rows_menu[i].breakfast5;
            meat1 = rows_menu[i].meat1;
            meat2 = rows_menu[i].meat2;
            meat3 = rows_menu[i].meat3;
            vege1 = rows_menu[i].vege1;
            vege2 = rows_menu[i].vege2;
            vege3 = rows_menu[i].vege3;
            side1 = rows_menu[i].side1;
            side2 = rows_menu[i].side2;
            side3 = rows_menu[i].side3;
            side4 = rows_menu[i].side4;
            special1 = rows_menu[i].special1;
            special2 = rows_menu[i].special2;
            special3 = rows_menu[i].special3;
            fruitanddessert = rows_menu[i].fruitanddessert;
            soup = rows_menu[i].soup;

            //console.log(breakfast1+ ","+ breakfast2+ ","+ breakfast3+ ","+ breakfast4+ ","+ breakfast5+ ","+ meat1+ ","+ meat2+ ","+ meat3+ ","+ vege1+ ","+ vege2+ ","+ vege3);
            //console.log(side1+ ","+ side2+ ","+ side3+ ","+ special1+ ","+ special2+ ","+ special3+ ","+ fruitanddessert+ ","+ soup);
            break;
        }

    }

    res.render('menu',{
        breakfast1 :breakfast1,
        breakfast2 :breakfast2,
        breakfast3 :breakfast3,
        breakfast4 :breakfast4,
        breakfast5 :breakfast5,
        meat1 :meat1,
        meat2 :meat2,
        meat3 :meat3,
        vege1 :vege1,
        vege2 :vege2,
        vege3 :vege3,
        side1 :side1,
        side2 :side2,
        side3 :side3,
        side4 :side4,
        special1 :special1,
        special2 :special2,
        special3 :special3,
        fruitanddessert : fruitanddessert,
        soup : soup,
        rows_menu:rows_menu

    });
});

app.get('/keips',(req,res) =>{
    accessSpreadsheet();
    console.log(rows_keips.length);
    //console.log(rows_keips[0].cca1)
    res.render('keips');
});

//target page
app.post('/keips', function (req, res) {
    accessSpreadsheet();
    var matnet = req.body.matnet.toUpperCase();
    console.log(matnet);
    var i;
    var match = false;
    var row_keips;
    for(i=0; i<rows_keips.length;i++){
        if(matnet.toUpperCase() == rows_keips[i].matnet.toUpperCase()){
            row_keips = rows_keips[i];
            match = true;
        }
    }
    if(match){
        res.render('keips-search',{
            row_keips:row_keips
        });
    }
    else{
        res.render('keips');
    }
});

app.get('/booking-sent',(req,res) =>{
    res.render('booking-sent');
});

//target page
app.post('/feedback-res-sent',upload.single('attachment'), function (req, res) {
    var msghtml='';
    msghtml +="<body>";
    msghtml += "<h3> Title: " + req.body.title  + "</h3>";
    msghtml += "<p> Message: " + req.body.message + "</p>";
    if (req.body.name != ""){
        msghtml += "<br>";
        msghtml += "<p>Name: " + req.body.name + "</p>";
    }
    if (req.body.contact != ""){
        msghtml += "<p>Contact: " + req.body.contact + "</p>";
    }
    msghtml += "</body>";
    
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'keviiwebinfo@gmail.com',
            pass: 'keviiwebinfo123'
        }
    });
    let mailOptions;
    try {
        mailOptions = {
        from: 'keviiwebinfo@gmail.com', // sender address
        to: 'keviiwebinfo@gmail.com', // list of receivers
        subject: "Residential Life", // Subject line
        html: msghtml,
        attachments: [
        {
            filename: req.file.originalname,
            content: req.file.buffer
        }
        ]  
        };
    }catch(err){
        mailOptions = {
            from: 'keviiwebinfo@gmail.com', // sender address
            to: 'keviiwebinfo@gmail.com', // list of receivers
            subject: "Residential Life Feedback", // Subject line
            html: msghtml
        };
    } 

    transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            //dirrect to target page
                res.render('feedback-sent');
            });
});

app.post('/bookingform-sent',upload.single('attachment'), function (req, res) {
    res.render('booking-sent');
});


app.get('/booking-admin-login',(req,res) =>{
    accessSpreadsheet();
    res.render('booking-admin-login');
});

app.get('/booking-admin',(req,res) =>{
    accessSpreadsheet();
    res.render('booking-admin',{
        rows_eventposter:rows_eventposter,
        rows_bookings:rows_bookings
    });
});

app.post('/booking-admin-login', function (req, res) {
    var password = req.body.password;
    var match = false;var match = false;
    if(password == "secretpassword"){
        match = true;
    }
    if(match){
        accessSpreadsheet();
        res.render('booking-admin',{
            rows_bookings:rows_bookings
        });
    }
    else{
        res.render('booking-admin-login');
    }
});

const server = app.listen(port, () => {
    accessSpreadsheet();
    console.log(`Express running → PORT ${server.address().port}`);
});
