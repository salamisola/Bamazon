var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Penn1510$",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function (error) {
    if (error) throw error;
    // run the start function after the connection is made to prompt the user
    loadProducts();
});

/* function loadProducts() {
   connection.query("SELECT * FROM products", function (err, res) {
       if (err) throw err;
       console.table(res);
       start();
   })
}; */
var userPrompt = {
    productIDPrompt: {
        type: "input",
        name: "product",
        message: "Please enter the product ID:"
    },
    numberOfUnitsPrompt: {
        type: "input",
        name: "numberOfUnits",
        message: "Please enter the quantity you want to buy"
    }
}


var loadProducts = function () {
    console.log('----------');
    connection.query("SELECT * FROM products", function (errors, results) {
        if (errors) throw errors;
        results.forEach(function (element) {
            /*console.table(results);*/
            console.log("Product ID: " + element.item_id + "\n Name: " + element.product_name + "\n Price($): " + element.price + "\n");
        });
        purchaseItem();
    });
}

var purchaseItem = function () {
    console.log('----------');
    inquirer.prompt([userPrompt.productIDPrompt, userPrompt.numberOfUnitsPrompt]).then(function (answers) {
        var query = "SELECT item_id, stock_quantity, price FROM products WHERE ?";
        connection.query(query, {
            item_id: answers.productID
        }, function (error, results) {
            if (results.length === 0) {
                console.log('----------');
                console.log('\n Selected Product ID is not found');
                purchaseItem();
            } else if (results.length > 0) {
                if (answers.numberOfUnits <= results[0].stock.quantity) {
                    var totalCost = answers.numberOfUnits * results[0].price;
                    var updateStockQuantity = results[0].stock_quantity - answers.numberOfUnits;
                    var query = connection.query(
                        "UPDATE products SET ? WHERE ? ", [{ stock_quantity: updateStockQuantity }, { item_id: answers.productID }],
                        function (error, results) {
                            console.log('----------');
                            console.log('Your total cost is: $' + totalCost);
                            connection.end();
                        }
                    );
                } else if (answers.numberOfUnits > results[0].stock_quantity) {
                    console.log('----------');
                    console.log('\n Insufficient Stock!');
                    console.log('Only ' + results[0].stock_quantity + 'units available');
                    console.log('Please try again. \n');
                    purchaseItem();
                }
            }
        });
    });
}


