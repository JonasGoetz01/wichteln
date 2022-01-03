const mysql = require('mysql');
const async = require('async');
const puppeteer = require("puppeteer");
const uuid = require('uuid');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const moment = require('moment');
const { compileFunction } = require('vm');
const asyncHandler = require('express-async-handler')
const QRCode = require('qrcode')
const open = require('open');

// Connection Pool
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});


function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}



/**
 * 
 * Renders the homepage
 * 
 * It querrys the user table to get all active users and sens them inside the rows object to the homepage where they're diplayed
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.home = (req, res) => {
  connection.query('SELECT * FROM assignments', async(err, users) => {
    if (!err) {
      for(let i = 0; i < users.length; i++){
        if((i + 1) < users.length){
          users[i][0] = users[i];
          users[i][1] = users[i + 1]
        }else{
          users[i][0] = users[i];
          users[i][1] = users[0]
        }
      }
      res.render('home', { users })
    }else{
      console.log(err);
    }
  });
}

/* ----------------------------------------------------User-section---------------------------------------------------------------------- */

/**
 * 
 * Gets all active users and send them through the rows object to the usermanagement page
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.viewuser = (req, res) => {
  connection.query('SELECT * FROM users', (err, rows) => {
    if (!err) {
      let removedUser = req.query.removed;
      res.render('usermanagement', { rows, removedUser });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * Handles the searchbar
 * it searches inside the user table for matches for the first and the last name and displays everything on the usermanagement page
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.finduser = (req, res) => {
  let searchTerm = req.body.search;
  connection.query('SELECT * FROM users WHERE name LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      res.render('usermanagement', { rows });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * renders all the fields required for inputting the data for new users
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.formuser = (req, res) => {
  res.render('add-user');
}

/**
 * 
 * put the given data from the user form and puts it into the user table
 * 
 * add the alert notifikation and send it to the add-user page to display the message that the user has been added
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.createuser = (req, res) => {
  const { name, age, sclass, sex } = req.body;
  let searchTerm = req.body.search;
  var user_uuid = uuid.v4();
  connection.query('INSERT INTO users SET name = ?, age = ?, sclass = ?, sex = ?, uuid = ?', 
  [name, age, sclass, sex, user_uuid], (err, rows) => {
    if (!err) {
      res.render('add-user', { alert: 'User added successfully.' });
    } else {
      console.log(err);
    }
  });
}

/* const compile = async function(templateName, data) {
  const filePath = path.join(process.cwg(), 'templates', `${templateName}.hbs`);
  const html = await fs.readFile(filePath, 'utf-8')
  return hbs.compile(html)(data);
}

exports.createpdf = async (req, res) => {
  try {
    const browser = puppeteer.launch()
    const page = browser.newPage()
    connection.query('SELECT * FROM users', async(err, rows) => {
      if(!err){
        console.log('jo')
        const content = await compileFunction('zuordnung', rows)
        await page.setContent(content)
        await page.emulateMedia('screen')
        await page.pdf({
          path: 'mydpf.pdf',
          format: 'A4',
          printBackground: true
        })
      }else{
        console.log(err)
      }
    });
  }catch(err){
    console.log(err);
  }
} */

exports.createuuid = (req, res) => {
  connection.query('SELECT * FROM users', (err, rows) => {
    if (!err) {
      for(var i = 0; i < rows.length; i++){
        if(rows[i].uuid == ""){
          connection.query('UPDATE users SET uuid = ? WHERE id = ?', [uuid.v4(), rows[i].id], (err, rows) => {
            if(err){
              console.log(err);
            }
            console.log("uuid added");
          });
        }
      }
    } else {
      console.log(err);
    }
  });
}

exports.userview = (req,res) => {
  connection.query('SELECT * FROM assignments', (err, rows) => {
    if(!err){
      const user_uuid = req.params.uuid
      for(var i = 0; i < rows.length; i++){
        if(rows[i].uuid == user_uuid){
          if(i + 1 < rows.length){
            var user = rows[i + 1]
          }else{
            var user = rows[0]
          }
          res.render('userview', { user });
        }
      }
    }else{
      console.log(err)
    }
  })
}

/**
 * 
 * gets data from database to display it on the edit page
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.edituser = (req, res) => {
  connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-user', { rows });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * take teh data from the update user form to update the user 
 * 
 * then add the alert that the user has been updateted and send it to the edit user page
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.updateuser = (req, res) => {
  const { name, age, sclass, sex } = req.body;
  connection.query('UPDATE users SET name = ?, age = ?, sclass = ?, sex = ? WHERE id = ?', [name, age, sclass, sex, req.params.id], (err, rows) => {
    if (!err) {
      connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err) {
          res.render('edit-user', { rows, alert: `${name} has been updated.` });
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * delete the given user and set the status to removed
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteuser = (req, res) => {
  connection.query('DELETE from users WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('User successeflly removed.');
      res.redirect('/wichteln/usermanagement');
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * Get all active users and send them inside the rows object to the view-user page
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.viewalluser = (req, res) => {
  connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-user', { rows });
    } else {
      console.log(err);
    }
  });
}

exports.deleteAssignment = (req, res) => {
  connection.query('DELETE FROM assignments', (err, rows) => {
    if (!err) {
      res.render('home');
    } else {
      console.log(err);
    }
  });
}

/**
 * Shuffles the array using the Fisher Yates Shuffle Algorithm
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

exports.makeAssignments = (req, res) => {
  connection.query('DELETE FROM assignments', (err, rows) =>{
    if(err){
      console.log(err);
    }
  });
  connection.query('SELECT * FROM users', (err, users) => {
    if (!err) {
      users = shuffle(users)
      async.each(users, function (user, callback) {
        connection.query('INSERT INTO assignments SET id = ?, name = ?, age = ?, sclass = ?, sex = ?, uuid = ?', [user.id, user.name, user.age, user.sclass, user.sex, user.uuid], callback);
        }, function () {
          connection.query('SELECT * FROM assignments', (err, users) => {
            if (!err) {
              for(let i = 0; i < users.length; i++){
                if((i + 1) < users.length){
                  users[i][0] = users[i];
                  users[i][1] = users[i + 1]
                }else{
                  users[i][0] = users[i];
                  users[i][1] = users[0]
                }
              }
              res.render('home', { users })
            }else{
              console.log(err);
            }
          });
      })
    } else {
      console.log(err);
    }
  });
}

exports.printZuordnung = (req, res) => {
  open("http://api.pdflayer.com/api/convert?access_key=5006d0a2a9c5d4dfa5a94ea974cad5cf&document_url=http://server.goetz01.de/wichteln&test=1&margin_top=0&margin_left=0&margin_right=0&margin_bottom=0&document_name=zuteilung.pdf&text_encoding=utf-8")
  res.redirect('/wichteln');
}

exports.printSchenker = (req, res) => {
  open("http://api.pdflayer.com/api/convert?access_key=5006d0a2a9c5d4dfa5a94ea974cad5cf&document_url=http://server.goetz01.de/wichteln&test=1&margin_top=0&margin_left=0&margin_right=0&margin_bottom=0&document_name=zuteilung.pdf&text_encoding=utf-8")
  res.redirect('/wichteln');
}

exports.presentScanner = (req, res) => {

}