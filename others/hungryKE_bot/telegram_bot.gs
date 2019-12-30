//useful tutorial: https://www.youtube.com/watch?v=24EyItKfm50

var token = "705007313:AAHDYj0GYE9NpSElA9JLLhjZ3Fc2UsqOtJ8";
//var oldtoken = "966287311:AAFSxru_h-L8Oot8NdSukiiOeT6XlNOeRHg";
var url = "https://api.telegram.org/bot" + token;
var webAppUrl ="https://script.google.com/macros/s/AKfycbyyoLI2bOzqgfRRK_TFPuGIJZTg10Ab2oT4y5EN3SQUklHX96c/exec";
var ssId = "1FLT1rvaHUhDxyDUQYN-sfCaYlxJ2MJq-t7UQob_kXtw";
var myid = "687271214";

function getMe() {
  var response = UrlFetchApp.fetch(url + "/getMe");
  Logger.log(response.getContentText());
}

function getUpdates() {
  var response = UrlFetchApp.fetch(url + "/getUpdates");
  Logger.log(response.getContentText());
}

function setWebhook(){ 
  var response = UrlFetchApp.fetch(url + "/setWebhook?url=" + webAppUrl); 
  Logger.log(response.getContentText()); 
}

function sendText(id, text){ 
  var response = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + id + "&text=" + text); 
  Logger.log(response.getContentText()); 
}

function doGet(e){
  return HtmlService.createHtmlOutput("Hello " + JSON.stringify(e));
  Logger.log(e);
}

function doPost(e){
  //try {
  //var response = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + 687271214 + "&text=" + e); 
  
  /**
  //if(typeof e !== 'undefined')
    
    MailApp.sendEmail({
      to: "yangziyun1113@gmail.com",
      subject: "Call Sucessful",
      htmlBody: "Call Sucessful hi!"
    });
  **/
  var contents = JSON.parse(e.postData.contents);
  //GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), "Telegram Bot Update", JSON.stringify(contents, null, 4));
  
  var text = contents.message.text;
  var id = contents.message.from.id;
  var name = contents.message.from.first_name;
  sendText(id, "hihii " + name); 
  
  var ss = SpreadsheetApp.openById(ssId);
  var ss1 = ss.getSheetByName("Sheet1");
   
  var date = new Date();
  var curr_month = date.getMonth() + 1;
  var curr_day = date.getDate();
  var curr_year = date.getYear();
  sendText(id, "today's date is " + curr_day + "/" + curr_month + "/" + curr_year);
  
  //To find out which row matches the date
  var row = 0;
  var data = ss1.getDataRange().getValues();
  for(var i = 0; i < data.length; i++){
    if(data[i][0] == curr_day && data[i][1] == curr_month){ 
      Logger.log((i+1));
      row = i+1;
    } else if (row == 0) {
      row = -1;
    }
  }
  
  //sendText(id, "huhu " + name + " " + row);
  if(row == -1)
  {
    sendText(id, "hehe... sorry there's no meal today :p");
  } else {
    
    var b1 = ss1.getRange(row, 3).getValue();
    var b2 = ss1.getRange(row, 4).getValue();
    var b3 = ss1.getRange(row, 5).getValue();
    var b4 = ss1.getRange(row, 6).getValue();
    var b5 = ss1.getRange(row, 7).getValue();
    var breakfast =   
        '<b>' + "Breakfast" + '</b>' + '\n'
        + '\n' + " - " + b1 
        + '\n' + " - " + b2 
        + '\n' + " - " + b3 
        + '\n' + " - " + b4 
        + '\n' + " - " + b5;
   
    var payload = {
      'method': 'sendMessage',
      'chat_id': id,
      'text': breakfast,
      'parse_mode': 'HTML'
    }
    var data = {
      "method": "post",
      "payload": payload
    }
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
    
    
    var m1 = ss1.getRange(row, 8).getValue();
    var m2 = ss1.getRange(row, 9).getValue();
    var m3 = ss1.getRange(row, 10).getValue();
    var v1 = ss1.getRange(row, 11).getValue();
    var v2 = ss1.getRange(row, 12).getValue();
    var v3 = ss1.getRange(row, 13).getValue();
    var sd1 = ss1.getRange(row, 14).getValue();
    var sd2 = ss1.getRange(row, 15).getValue();
    var sd3 = ss1.getRange(row, 16).getValue();
    var sd4 = ss1.getRange(row, 17).getValue();
    var sp1 = ss1.getRange(row, 18).getValue();
    var sp2 = ss1.getRange(row, 19).getValue();
    var sp3 = ss1.getRange(row, 20).getValue();
    var fruit = ss1.getRange(row, 21).getValue();
    var soup = ss1.getRange(row, 22).getValue();
    
    var sp = "";
    var dinner =   
        '<b>' + "Dinner" + '</b>' + '\n'
        + '\n' + sp + '<b>' + "[Meat]" + '</b>' 
        + '\n' + " - " + m1 
        + '\n' + " - " + m2 
        + '\n' + " - " + m3 
        + '\n' + sp + '<b>' + "[Vege]" + '</b>' 
        + '\n' + " - " + v1
        + '\n' + " - " + v2
        + '\n' + " - " + v3
        + '\n' + sp + '<b>' + "[Side Dishes]" + '</b>' 
        + '\n' + " - " + sd1
        + '\n' + " - " + sd2
        + '\n' + " - " + sd3
        + '\n' + " - " + sd4
        + '\n' + sp + '<b>' + "[Special Dishes]" + '</b>' 
        + '\n' + " - " + sp1
        + '\n' + " - " + sp2
        + '\n' + " - " + sp3
        + '\n' + sp + '<b>' + "[Fruit n Dessert]" + '</b>' 
        + '\n' + " - " + fruit
        + '\n' + " " + '<b>' + "[Soup]" + '</b>' 
        + '\n' + " - " + soup;
    
    var payload = {
      'method': 'sendMessage',
      'chat_id': id,
      'text': dinner,
      'parse_mode': 'HTML'
    }
    var data = {
      "method": "post",
      "payload": payload
    }
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
    
    
    // tmr breakfast
    var tmr_row = row+1;
    var tb1 = ss1.getRange(tmr_row, 3).getValue();
    var tb2 = ss1.getRange(tmr_row, 4).getValue();
    var tb3 = ss1.getRange(tmr_row, 5).getValue();
    var tb4 = ss1.getRange(tmr_row, 6).getValue();
    var tb5 = ss1.getRange(tmr_row, 7).getValue();
    var tmr_breakfast =   
        '<b>' + "and tmr's breakfast" + '</b>' + '\n'
        + '\n' + " - " + tb1 
        + '\n' + " - " + tb2 
        + '\n' + " - " + tb3 
        + '\n' + " - " + tb4 
        + '\n' + " - " + tb5;
   
    var payload = {
      'method': 'sendMessage',
      'chat_id': id,
      'text': tmr_breakfast,
      'parse_mode': 'HTML'
    }
    var data = {
      "method": "post",
      "payload": payload
    }
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
    
    
    
    sendText(id, "thank-you " + name +  ", enjoy your meal :D");
    
    
    var ad = "Do check up" + '<a href= "https://kiwi7.herokuapp.com">' + " kiwi7.herokuapp.com" + '</a>' +  " for more details!" 
    var payload = {
      'method': 'sendMessage',
      'chat_id': id,
      'text': ad,
      'parse_mode': 'HTML'
    }
    var data = {
      "method": "post",
      "payload": payload
    }
    //UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
  }
    
  //} catch(e) {
  //  sendText(myid, JSON.stringify(e, null, 4));
  //}
}




/**
        '<b>' + "Breakfast" + '</b>' 
        + '<ul>'
        + '<li>' + b1 + '</li>'
        + '<li>' + b2 + '</li>'
        + '<li>' + b3 + '</li>'
        + '<li>' + b4 + '</li>'
        + '<li>' + b5 + '</li>'
        + '</ul>';
        
var quote = '"' + cleanContent + '"\n — <strong>' + post.title + '</strong>';

var payload = {
'method': 'sendMessage',
'chat_id': String(chatId),
'text': quote,
'parse_mode': 'HTML'
}

var data = {
"method": "post",
"payload": payload
}

// Replace with your token
var API_TOKEN = '297019760:AAFbL7yMus67Qv5Xu6fQ7VB93Jq4dkVaGP4';
UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);

function test(){
var ss = SpreadsheetApp.openById(ssId);
var sheet = ss.getSheetByName("Sheet1");
sheet.getRange(1, 1).setValue(JSON.stringify(e))
return ContentService.createTextOutput(JSON.stringify(e))
}

{
"update_id": 559581117,
"message": {
        "message_id": 34,
        "from": {
            "id": 687271214,
            "is_bot": false,
            "first_name": "Zi Yun",
            "language_code": "en"
        },
        "chat": {
            "id": 687271214,
            "first_name": "Zi Yun",
            "type": "private"
        },
        "date": 1564077920,
        "text": "Gdeyg"
    }
}

**/




