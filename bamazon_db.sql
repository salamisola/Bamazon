DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;
CREATE TABLE products (
item_id INTEGER(20) NOT NULL auto_increment,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price INTEGER(10) NOT NULL,
stock_quantity INTEGER(30) NOT NULL,
PRIMARY KEY (id)
);




