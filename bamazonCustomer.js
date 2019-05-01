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
            connection.query("SELECT * FROM products WHERE item_id =" + userChoice, function (err, res) {
                if (err) throw err;
                console.table(res);
                var product = res;

                if (product) {
                    howMany(product);
                } else {
                    console.log('\nProduct is not available');
                    loadProducts();

                };
                /* var product = checkUserChoice(userChoice, inventory); */


                /* if (product) {
                    howMany(product);
                } else {
                    console.log('\nProduct is not available'); */
                /* loadProducts(); */
            }
            )
        })
}


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
            console.log(val.quantity);
            console.log(product[0].stock_quantity);
            var quantity = parseInt(val.quantity);
            var stock_quantity = parseInt(product[0].stock_quantity);
            if (quantity > stock_quantity) {
                console.log("\n Not enough of the product! Sorry");
                loadProducts();
            } else {
                buyItems(product[0], val.quantity);
                console.log("there is enough")

            }
        })
}

function buyItems(product, quantity) {
    var new_stock_quantity = parseInt(product.stock_quantity) - parseInt(quantity);
    console.log(new_stock_quantity);
    console.log(product.item_id);
    connection.query(
        "UPDATE products SET stock_quantity =" + new_stock_quantity + "where item_id = " + product.item_id + ";",
        function (err, res) {
            console.log(
                "\n Congratulations you've purchased " + quantity +
                " " + product.product_name + "'s!"

            );
            loadProducts();
        }
    )
}

    // check to see if the product the user selected exists in the inventory
/* function checkInventory(pruduct_name, stock_quantity) {
    connection.query("SELECT product_name FROM products", function (err, res) {
        if (err) throw err;
        console.log("\n product available");

    })

}; */




