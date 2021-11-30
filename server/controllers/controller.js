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
 * Renders the homepage
 * 
 * It querrys the user table to get all active users and sens them inside the rows object to the homepage where they're diplayed
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.home = (req, res) => {
/*   connection.query('SELECT * FROM user WHERE status = "active "', (err, rows) => {
    if (!err) {
      let sellNotification = req.query.notification;
      let sellNotificationAll = req.query.notificationAll;
      let buchungsNotification = req.query.buchung;
      res.render('home', { rows, sellNotification, sellNotificationAll, buchungsNotification });
    } else {
      console.log(err);
    }
  }); */
  res.render('home')
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
  connection.query('INSERT INTO users SET name = ?, age = ?, sclass = ?, sex = ?', 
  [name, age, sclass, sex], (err, rows) => {
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
      res.redirect('/usermanagement/?removed=' + removedUser);
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