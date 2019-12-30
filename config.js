var mysql      = require('mysql');
var sqlConnection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'password',
	  database : 'testLoginDB'
});
sqlConnection.connect(function(err){
  if(!err) {
    console.log("Database is connected");
  } else {
    console.log("Error while connecting with database");
    console.log(err);	  
  }
});
module.exports = sqlConnection; 



