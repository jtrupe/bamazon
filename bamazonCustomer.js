const mysql = require("mysql");
const fs = require("fs");
const inquirer = require("inquirer");

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
    bamazon.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res)
        showResults(res);
        // console.log("Stock: " + res[i].stock_quantity);
        // bamazon.end();
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
    buyThings(response);
};

var questions = [
    {
        name: "item_id",
        type: "input",
        message: "What is the ID of the product you'd like to buy?",
    }, {
        name: "quantity",
        type: "input",
        message: "How many do you want?",
    }
]
function buyThings(response) {
    inquirer.prompt(questions).then(function (answers) {
        var stock = parseInt(answers.quantity);
        index = parseInt(answers.item_id) - 1;
        var newStock = response[index].stock_quantity - stock;
        var totalCost = (stock * (response[index].price)).toFixed(2);
        if (answers.item_id > response.length || answers.item_id < 1 || isNaN(answers.item_id) === true) {
            console.log("Sorry we don't have that item in stock...");
            return false;
        } else if (stock > response[index].stock_quantity) {
            console.log("Insufficient Quantity! We only have " + response[index].stock_quantity + " " + response[index].product_name + "s in stock.");
            return false;
        } else {
            console.log("You total comes to $" + totalCost);
            updateProduct(answers.item_id, newStock);
        }
    })
};

var updateProduct = function (updateID, updateQuantity) {
    bamazon.query(
        "UPDATE products SET ? WHERE ?",
        [
            { stock_quantity: updateQuantity },
            { item_id: updateID }
        ]
    )
    bamazon.end();
}
