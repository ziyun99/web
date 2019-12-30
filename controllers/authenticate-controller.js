var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');

var sqlConnection = require('./../config');
module.exports.authenticate=function(req,res, next){
  var email=req.body.email;
  var password=req.body.password;
  sqlConnection.query('SELECT * FROM login_users WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    res.json({
      status:false,
      message:'there are some error with query'
    })
    } else {
      if(results.length > 0){
        decryptedString = cryptr.decrypt(results[0].password);
        if(password==decryptedString){
          // res.json({
          //   status:true,
          //   message:'successfully authenticated'
          // })
          res.redirect('/');
          // next();
        } else {
          res.json({
            status:false,
            message:"Email and password does not match"
          });
        } 
      } else {
        res.json({
          status:false,    
          message:"Email does not exits"
        });
      }
    }
  });
}





