//--------------------------------------------------------------------
//week 12 homework Bamazon
//Developed by Aelly Liu
//Started on July 5.2017 completed July 6.2017
//
//This is for customer to review products and place order
//--------------------------------------------------------------------
var products=[];
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


function viewProducts(){
    connection.query("SELECT * from products",function(error,results){
        if(error) throw error;

        console.log("--------------------------------------------------\n");
        console.log("Item id | Product Name\t\t\t| Price\n");

        for(var i=0; i<results.length;i++)
        {
            
            console.log(results[i].item_id+"\t|"+String("                                                 "+results[i].product_name).slice(-30)+" | "+ results[i].price+"\n");
        }
        console.log("--------------------------------------------------\n");

        inquirer.prompt([
            {
                type:"confirm",
                name:"purchase",
                message:"Woud you like to place an order?"
            }
        ]).then(function (answer){
            if(answer.purchase){
                placeOrder(results.length);
            }else{
                console.log("\nThank you for shopping with Bamazon.");
                connection.end();
            }
        });

    });
}

function placeOrder(numProducts){
    inquirer.prompt([
        {
            type:"input",
            name:"itemId",
            message:"Please enter the item id you would like to purchase: "
        },
        {
            type:"input",
            name:"qty",
            message:"How many would you like to buy? "
        }
    ]).then(function(answer){

        if(numProducts>=answer.itemId)
        {
            //enter valid item id, start ordering process
             connection.query("SELECT * from products where item_id=?",[answer.itemId],function(error,result){
                var remainQty=result[0].stock_quantity - answer.qty;
            // console.log("remaining qty: "+remainQty);
            // console.log("stock qty: "+ result[0].stock_quantity);
            // console.log("buying qty:"+ answer.qty);
                

                if ( remainQty>=0 )
                {
                    //there are enough items in stock
                    var total = result[0].price * answer.qty;
                    var sales = result[0].product_sales + total;

                    //console.log("total price: "+ total);
                    //console.log("product sales: "+ sales);

                    connection.query("UPDATE products SET stock_quantity=?, product_sales=? WHERE item_id = ?",[remainQty,sales,+answer.itemId],function(error){
                        if (error) throw error;

                        console.log("\n You have placed an order for "+answer.qty+" "+ result[0].product_name+". \n Your total price is $"+ total);

                        connection.end();
                    })
                }
                else
                {
                    console.log("Insufficient quantity\n");
                    console.log("We are sorry that we don't have enought in our stock. Please come back again!")
                    connection.end();//close query connection
                }
            });

        }
        else
        {
            console.log("You have enter an invalid item id.");
            connection.end();
        }

       

    });


}



inquirer.prompt([
    {
        type:"confirm",
        message: "Would you like to see available products?",
        name: "viewProduct"
    }
]).then(function(answer){
    if(answer.viewProduct){
        console.log("Here are all available products\n");
        viewProducts();

    }else
    {
        console.log("\nThank you for shopping with Bamazon.");
    }
})