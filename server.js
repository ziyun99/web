const express = require('express');
const nodeMailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const poster = require('./poster.json');
// const gallery = require('./gallery.json');


const PORT = process.env.PORT || 8000



const app = express();

app.set('view engine','pug');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var upload = multer({storage: multer.memoryStorage()});



app.get('/',(req,res) =>{
//    res.render('index');
    res.render('index',{
        poster: poster.profiles
    //     gallery: gallery.profiles
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



//target page
app.post('/feedback-res-sent',upload.single('attachment'), function (req, res) {
    var msghtml='';
    msghtml +="<body>";
    msghtml += "<h3>" + req.body.title  + "</h3>";
    msghtml += "<p>" + req.body.message + "</p>";
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
            subject: "Residential Life", // Subject line
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



// app.get('/profile',(req,res) => {
//     const person = people.profiles.find(p => p.id === req.query.id);
//     res.render('profile', {
//         title: `About ${person.firstname} ${person.lastname}`,
//         person
//     });
// });
  
const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
