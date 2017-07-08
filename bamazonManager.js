//----------------------------------------------------
//started on July 6,2017, completed on July 6,2017
//Developed by Aelly Liu
//
//Manager operation: 
//View Products for Sale - view all availiable products's info
//View Low Inventory - view products that are low in stock(less 5 in stock) only
//Add to Inventory - add more stock to any available items
//Add new product - add new product item to the store
//
//------------------------------------------------------

var inquirer = require("inquirer");

//Connection info for bamazon database
var mysql= require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});



inquirer.prompt([
    {
        type:"list",
        message:"What would you like to do? ",
        choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"],
        name:"op"

    }
]).then(function(answer){
    switch(answer.op)
    {
        case "View Products for Sale":
            viewProduct();
            break;
        case "View Low Inventory":
            lowInventory();
            break;
        case "Add to Inventory":
            addInventory();
            break;
        case "Add New Product":
            console.log("Begin add new product to inventory\n");
            addNew();
            break;
        default:
            console.log("You have selected an invalid operation.");
    }
});

function viewProduct()
{
    connection.query("SELECT * from products",function(error, results){
        if(error) throw error;

        console.log("--------------------------------------------------\n");
        console.log("Item id | Product Name\t\t\t| Price  | Stock Quantity | Total Product Sales\n");

        for(var i=0; i<results.length;i++)
        {
            
            console.log(results[i].item_id+"\t|"
            +String("                                                 "+ results[i].product_name).slice(-30)
            +" | "+ String("    "+results[i].price).slice(-6)
            +" | "+ String("                  "+results[i].stock_quantity).slice(-14)
            +" | "+ String("         "+results[i].product_sales).slice(-10)
            +"\n");
        }
        console.log("--------------------------------------------------\n");
        connection.end();
    });
}

function lowInventory()
{
    connection.query("SELECT * from products where stock_quantity<=5",function(error, results){
        if(error) throw error;

        console.log("--------------------------------------------------\n");
        console.log("Item id | Product Name\t\t\t| Price  | Stock Quantity | Total Product Sales\n");

        for(var i=0; i<results.length;i++)
        {
            
            console.log(results[i].item_id+"\t|"
            +String("                                                 "+ results[i].product_name).slice(-30)
            +" | "+ String("    "+results[i].price).slice(-6)
            +" | "+ String("                  "+results[i].stock_quantity).slice(-14)
            +" | "+ String("         "+results[i].product_sales).slice(-10)
            +"\n");
        }
        console.log("--------------------------------------------------\n");
        connection.end();
    });

}

function addInventory()
{
    connection.query("SELECT item_id, product_name,stock_quantity from products",function(error, results){
        if(error) throw error;

        console.log("--------------------------------------------------\n");
        console.log("Item id | Product Name\t\t\t| Stock Quantity\n");

        for(var i=0; i<results.length;i++)
        {
            
            console.log(results[i].item_id+"\t|"
            +String("                                                 "+ results[i].product_name).slice(-30)
            +" | "+ String("                  "+results[i].stock_quantity).slice(-14)
            +"\n");
        }
        console.log("--------------------------------------------------\n");
        console.log("Which item would you like to add more in stock? ")
        inquirer.prompt([
            {
                type:"input",
                name:"itemId",
                message:"Please enter the item id: "
            },
            {
                type:"input",
                name:"addQty",
                message:"Please enter the number of quantity to add to the inventory: "
            }
        ]).then(function(answer){
            
            connection.query("SELECT * from products where item_id=?",[answer.itemId],function(error,result){
                var totalQty=result[0].stock_quantity + parseInt(answer.addQty);
            
                connection.query("UPDATE products SET stock_quantity=? WHERE item_id = ?",[totalQty,+answer.itemId],function(error){
                        if (error) throw error;

                        console.log("\n You have added "+answer.addQty+" to "+ result[0].product_name+".\n");

                        connection.end();
                    });
        
            });


            
        });

    });

}

function addNew()
{

    inquirer.prompt([
        {
            type:"input",
            name:"productName",
            message: "Please enter the new product name: "
        },
        {
            type:"input",
            name:"department",
            message:"Please enter department name: "
        },
        {
            type:"input",
            name:"price",
            message:"Please enter the price for the new product: "
        },
        {
            type:"input",
            name:"qty",
            message:"How many in stock?"
        }
    ]).then(function (answer){

        connection.query("INSERT INTO products (product_name, department_name, price,stock_quantity) VALUES (?,?,?,?)",[answer.productName,answer.department,answer.price,answer.qty],function(error){
            if(error) throw error;

            console.log("New product "+ answer.productName+" is added.\n");
            connection.end();
        });

    });

}