-- -----------------------------------------------------
-- Schema onlinemarketplace
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `onlinemarketplace`;

USE `onlinemarketplace`;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Brand;
DROP TABLE IF EXISTS Type;
DROP TABLE IF EXISTS Product;

-- Create the Brand table
CREATE TABLE `Brand` (
                         `Id` INT AUTO_INCREMENT PRIMARY KEY,
                         `Name` VARCHAR(255) NOT NULL
);

-- Insert data into the Brand table
INSERT INTO Brand (Name) VALUES
                             ('Adidas'),
                             ('ASICS'),
                             ('Sony'),
                             ('Apple'),
                             ('Samsung'),
                             ('Nike'),
                             ('Dell');

-- Create the Type table
CREATE TABLE `Type` (
                        `Id` INT AUTO_INCREMENT PRIMARY KEY,
                        `Name` VARCHAR(255) NOT NULL
);

-- Insert data into the Type table
INSERT INTO Type (Name) VALUES
                            ('Electronics'),
                            ('Footwear'),
                            ('Furniture'),
                            ('Accessories');

-- Create the Product table
CREATE TABLE `Product` (
                           `Id` INT AUTO_INCREMENT PRIMARY KEY,
                           `Name` VARCHAR(255) NOT NULL,
                           `Description` TEXT,
                           `Price` DECIMAL(10, 2) NOT NULL,
                           `PictureUrl` VARCHAR(255),
                           `ProductTypeId` INT NOT NULL,
                           `ProductBrandId` INT NOT NULL,
                           FOREIGN KEY (`ProductTypeId`) REFERENCES `Type`(`Id`),
                           FOREIGN KEY (`ProductBrandId`) REFERENCES `Brand`(`Id`)
);

-- Insert data into the Product table (generalized products)
INSERT INTO Product (Name, Description, Price, PictureUrl, ProductTypeId, ProductBrandId) VALUES
                                                                                              ('Sony WH-1000XM4 Wireless Headphones', 'Industry-leading noise-cancelling headphones with long battery life and excellent sound quality.', 299.99, 'images/Product/sony_headphones.png', 1, 3),
                                                                                              ('Apple iPhone 14 Pro', 'The latest iPhone with advanced features, including the new Dynamic Island and Pro camera system.', 999.99, 'images/Product/iphone_14.png', 1, 4),
                                                                                              ('Adidas Running Shoes', 'Comfortable and lightweight running shoes suitable for all terrains.', 89.99, 'images/Product/adidas_shoe-1.png', 2, 1),
                                                                                              ('Dell XPS 13 Laptop', 'Compact, high-performance laptop with Intel Core i7 processor and ultra-thin design.', 1299.99, 'images/Product/dell_xps13.png', 1, 7),
                                                                                              ('Samsung 4K Smart TV', 'Ultra HD smart TV with high dynamic range (HDR) and built-in streaming apps.', 549.99, 'images/Product/samsung_tv.png', 1, 5),
                                                                                              ('ASICS Court Shoes', 'Indoor court shoes with excellent grip and comfort.', 119.99, 'images/Product/asics_shoe.png', 2, 2),
                                                                                              ('Nike Sports Bag', 'Durable and spacious sports bag with multiple compartments for easy storage.', 49.99, 'images/Product/nike_bag.png', 4, 6),
                                                                                              ('Wooden Dining Table', 'Elegant and sturdy wooden dining table that seats six people comfortably.', 499.99, 'images/Product/dining_table.png', 3, 7);
