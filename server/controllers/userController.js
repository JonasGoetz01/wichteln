const mysql = require('mysql');

// Connection Pool
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

/**
 * 
 * Render the admin page
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.admin = (req, res) => {
  res.render('admin');
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
  connection.query('SELECT * FROM user WHERE status = "active "', (err, rows) => {
    if (!err) {
      let sellNotification = req.query.notification;
      let sellNotificationAll = req.query.notificationAll;
      let buchungsNotification = req.query.buchung;
      res.render('home', { rows, sellNotification, sellNotificationAll, buchungsNotification });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * Querrys the drin table to get all active drinks to show them on the drinkmanagement page
 * It also get the removedDrink  variable from the deleteDrink Controller. So it shows a message when a drink was deleted
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.viewdrink = (req, res) => {
  connection.query('SELECT * FROM drink WHERE active = "active"', (err, rows) => {
    if (!err) {
      let removedDrink = req.query.removed;
      res.render('drinkmanagement', { rows, removedDrink });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * Render the form drink page to display all the fields necessary for the user to input data for new drink
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.formdrink = (req, res) => {
  res.render('add-drink');
}

/**
 * 
 * Gets called by the adddrink page through a POST it gets all the data from the form and puts it into the drink table
 * After that it sends a alert to the add-drink page; so it calls an empty add drink page and shows the message
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.createdrink = (req, res) => {
  const { name, brand, price_buy, price_intern, price_extern, box_size, stock } = req.body;
  let searchTerm = req.body.search;
  connection.query('INSERT INTO drink SET name = ?, brand = ?, price_buy = ?, price_intern = ?, price_extern = ?, box_size = ?, stock = ?', 
  [name, brand, price_buy, price_intern, price_extern, box_size, stock], (err, rows) => {
    if (!err) {
      res.render('add-drink', { alert: 'Drink added successfully.' });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * Querrys the drink table to get all the drinks and send them inside the rows object to the edit-drink page where the information is displayed
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.editdrink = (req, res) => {
  connection.query('SELECT * FROM drink WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-drink', { rows });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * Updates the given data to the drink that ist handed over through the id in the url
 * after that it gets all the drink information to show it in the edit drink page again
 * 
 * send an message to the edit drink page to display that the drink has been updated
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.updatedrink = (req, res) => {
  const { name, brand, price_buy, price_intern, price_extern, box_size, stock } = req.body;
  connection.query('UPDATE drink SET name = ?, brand = ?, price_buy = ?, price_intern = ?, price_extern = ?, box_size = ?, stock = ? WHERE id = ?', 
  [name, brand, price_buy, price_intern, price_extern, box_size, stock, req.params.id], (err, rows) => {
    if (!err) {
      connection.query('SELECT * FROM drink WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err) {
          res.render('edit-drink', { rows, alert: `${name} has been updated.` });
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
 * Querrys the drink table and send all the data to the view-drink page inside the rows object
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.viewalldrink = (req, res) => {
  connection.query('SELECT * FROM drink WHERE id = ? AND active = "active"', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-drink', { rows });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * Sets the active status of the drink to false so that the drink is not longer visible
 * 
 * then create a message to be shown on the drinkmanagement site
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.deletedrink = (req, res) => {
  connection.query('UPDATE drink SET active = "notactive" WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      let removedDrink = encodeURIComponent('Drink successeflly removed.');
      res.redirect('/admin/drinkmanagement/?removed=' + removedDrink);
    } else {
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
  connection.query('SELECT * FROM user WHERE status = "active "', (err, rows) => {
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
  connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
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
  const { first_name, last_name, email, phone, comments } = req.body;
  let searchTerm = req.body.search;
  connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', 
  [first_name, last_name, email, phone, comments], (err, rows) => {
    if (!err) {
      res.render('add-user', { alert: 'User added successfully.' });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * gets data from database to display it on the edit page
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.edituser = (req, res) => {
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
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
  const { first_name, last_name, email, phone, comments } = req.body;
  connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
    if (!err) {
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err) {
          res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
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
  connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('User successeflly removed.');
      res.redirect('/admin/usermanagement/?removed=' + removedUser);
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
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-user', { rows });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * slelect all drinks to display them in the sale page so that a user can buy a drink
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.sale = (req, res) => {
  connection.query('SELECT * FROM drink WHERE active = "active"', (err, rows) => {
    if (!err) {
      var user_id = parseInt(req.params.id);
      for(var i = 0; i < rows.length; i++){
        rows[i].user_id = user_id;
      }
      res.render('sale', { rows });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * When a user buys a drink the stock of the drink is redeced by one and the sale with 
 * 
 * then it loads homepage
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.makesale = (req, res) => {
  var user_id = req.params.id;
  var drink_id = req.params.drink;
  connection.query('INSERT INTO sales SET user_id = ?, drink_id = ?', [user_id, drink_id], (err, rows) => {
    if (!err) {
      connection.query('UPDATE drink SET stock = stock - 1 WHERE id = ?', [drink_id], (err, rows) => {
        if (err) {
          console.log(err);
        }
      })

      //load the homepage with all users
      connection.query('SELECT * FROM user WHERE status = "active "', (err, rows) => {
        if (!err) {
          let buchungsNotification = encodeURIComponent('Vielen Dank für Deine Buchung!');
          res.redirect('/?buchung=' + buchungsNotification);
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
 * When user_id is 0 then get all sales that matches the user and apply the external prices
 * 
 * if its another user the regular internal prices are applyed and displayed in an overfiew  
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.overview = (req, res) => {
  if(req.params.id == 0){
    var obj_drink;
    connection.query('SELECT * FROM sales WHERE user_id = ? AND payed = 0', [req.params.id], (err, sales) => {
      if (!err) {
        sales.forEach(sale => {
          sale.timestamp = "Am " + String(sale.timestamp).split(" ")[2] + ". " + String(sale.timestamp).split(" ")[1] + ". " + String(sale.timestamp).split(" ")[3] + ", um " + String(sale.timestamp).split(" ")[4];
        })
        if(sales.length >= 1){
        connection.query('SELECT * FROM drink', (err, drink) => {
          obj_drink = drink;
          sales[0].total_cost = 0;
          for(var i = 0; i < sales.length; i++){
            var j = 0;
            while(j < drink.length){
              if(sales[i].drink_id == drink[j].id){
                sales[i].drink_name = drink[j].name;
                sales[i].drink_brand = drink[j].brand;
                sales[i].price = drink[j].price_extern;
                sales[0].total_cost += drink[j].price_extern;
                sales[0].user_id = req.params.id;
              }
              j++;
            }
          } 
        });
      }
        res.render('overview', { sales });
      } else {
        console.log(err);
      }
    });
  }
  var obj_drink;
  connection.query('SELECT * FROM sales WHERE user_id = ? AND payed = 0', [req.params.id], (err, sales) => {
    if (!err) {
      sales.forEach(sale => {
        sale.timestamp = "Am " + String(sale.timestamp).split(" ")[2] + ". " + String(sale.timestamp).split(" ")[1] + ". " + String(sale.timestamp).split(" ")[3] + ", um " + String(sale.timestamp).split(" ")[4];
      })
      if(sales.length >= 1){
      connection.query('SELECT * FROM drink', (err, drink) => {
        obj_drink = drink;
        sales[0].total_cost = 0;
        for(var i = 0; i < sales.length; i++){
          var j = 0;
          while(j < drink.length){
            if(sales[i].drink_id == drink[j].id){
              sales[i].drink_name = drink[j].name;
              sales[i].drink_brand = drink[j].brand;
              sales[i].price = drink[j].price_intern;
              sales[0].total_cost += drink[j].price_intern;
              sales[0].user_id = req.params.id;
            }
            j++;
          }
        } 
      });
    }
      res.render('overview', { sales });
    } else {
      console.log(err);
    }
  });
}

/**
 * 
 * set the status of the sale to payed and render the homepage
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.pay = (req, res) => {
  connection.query('UPDATE sales SET payed = 1 WHERE id = ?', req.params.id, (err, rows) => {
    if (!err) {
      connection.query('SELECT * FROM user WHERE status = "active "', (err, rows) => {
        if (!err) {
          let sellNotification = encodeURIComponent('Vielen Dank, dass Du Dein Getränk bezahlt hast!');
          res.redirect('/?notification=' + sellNotification);
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
 * set the status of all orders of one user to payed and render the homepage
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.payall = (req, res) => {
  connection.query('UPDATE sales SET payed = 1 WHERE user_id = ?', req.params.user_id, (err, rows) => {
    if (!err) {
      connection.query('SELECT * FROM user WHERE status = "active "', (err, rows) => {
        if (!err) {
          let sellNotificationAll = encodeURIComponent('Vielen Dank, dass Du alle Deine Getränke bezahlt hast!');
          res.redirect('/?notificationAll=' + sellNotificationAll);
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
}