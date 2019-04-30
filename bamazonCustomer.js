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
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    loadProducts();
});

function loadProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
};

// function which prompts the user for what action they should take
function start(inventory) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "choice",
                message: "What is the id of the item you want to buy?"
            },
        ])
        .then(function (val) {
            var userChoice = parseInt(val.choice);
            var product = checkUserChoice(userChoice, stock_quanity);
            if (product) {
                howMany(product);
            } else {
                console.log('\nProduct is not available');
                loadProducts();
            }
        })


    function howMany(product) {
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "quantity",
                    message: "How many units do you want to buy?"
                }

            ])
            .then(function (val) {
                var quantity = parseInt(val.quantity);
                if (quantity > product.stock_quanity) {
                    console.log("\n Not enough of the product! Sorry");
                    loadProducts();
                } else {
                    buyItems(product, quantity);
                }
            })
    }

    function buyItems(product, quantity) {
        connection.query(
            "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
            [quantity, product.item_id],
            function (err, res) {
                console.log(
                    "\n Congratulations you've purchased " + quantity +
                    " " + product.product.name + "'s!"
                );
                loadProducts();
            }
        )
    }

    // check to see if the product the user selected exists in the inventory
    /* function checkInventory(choiceID, inventory) {

    }; */
};



