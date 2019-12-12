const mysql = require("mysql");
const fs = require("fs");

const bamazon = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

bamazon.connect(function (err) {
    if (err) throw err;
    console.log("connected as id: " + bamazon.threadId + "\n");
    readProducts();
});

function readProducts() {
    bamazon.query("SELECT * FROM products WHERE department_name=?", ["fruit"], function (err, res) {
        if (err) throw err;
        // console.log(res)
        showResults(res);
        // console.log("Stock: " + res[i].stock_quantity);
        bamazon.end();
    })
}

function showResults(response) {
    // console.log(response.length);
    for (let i = 0; i < response.length; i++) {
        console.log("-------------------------");
        console.log("id: " + response[i].item_id);
        console.log("Product: " + response[i].product_name);
        console.log("Department: " + response[i].department_name);
        console.log("Price: " + parseFloat(response[i].price));
        console.log("Stock: " + parseInt(response[i].stock_quantity));
        // console.log("-------------------------");
    }
};