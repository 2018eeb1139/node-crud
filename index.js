const mysql = require('mysql2');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Amanapc@1999',
    database: 'employeeDB',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


//Get all employees
app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * FROM employees', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

// Get an employees
app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM employees WHERE employeeID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an employees
app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM employees WHERE employeeID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an employees
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @employeeID = ?;SET @employeeName = ?;SET @employeeCode = ?;SET @employeeSalary = ?; \
    CALL EmployeeAddOrEdit(@employeeID,@employeeName,@employeeCode,@employeeSalary);";
    mysqlConnection.query(sql, [emp.employeeID, emp.employeeName, emp.employeeCode, emp.employeeSalary], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id : '+element[0].employeeID);
            });
        else
            console.log(err);
    })
});

// //Update an employees
// app.put('/employees', (req, res) => {
//     let emp = req.body;
//     var sql = "SET @employeeID = ?;SET @employeeName = ?;SET @employeeCode = ?;SET @employeeSalary = ?; \
//     CALL EmployeeAddOrEdit(@employeeID,@employeeName,@employeeCode,@employeeSalary);";
//     mysqlConnection.query(sql, [emp.employeeID, emp.employeeName, emp.employeeCode, emp.employeeSalary], (err, rows, fields) => {
//         if (!err)
//             res.send('Updated successfully');
//         else
//             console.log(err);
//     })
// });