//----------------------------------------------------
//started on July 6,2017, completed on July 6,2017
//Developed by Aelly Liu
//
//Supervisor operation: 
//View Product Sales by Department - show prodcut sales info by department
//Create New Department - add new department
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
        choices:["View Product Sales by Department","Create New Department"],
        name:"op"

    }
]).then(function(answer){
    switch(answer.op)
    {
        case "View Product Sales by Department":
            viewProductSales();
            break;
        case "Create New Department":
            addNewDep();
            break;
        default:
            console.log("You have selected an invalid operation.");
    }
});

function viewProductSales()
{
    connection.query("select sum(p.product_sales)-d.over_head_costs as profit,sum(p.product_sales) as total_dep_sales,d.department_id,d.department_name,d.over_head_costs from departments as d left join products as p on d.department_name=p.department_name group by d.department_name,d.over_head_costs,d.department_id order by d.department_id;",function (error, results){
        if (error) throw error;
        //console.log(results);
        
        console.log("--------------------------------------------------\n");
        console.log("Department Id | Department Name\t| Over Head Costs  | Total Product Sales | Total Profit\n");


        for(var i=0;i<results.length;i++)
        {
            //var profit=results[i].total_dep_sales - results[i].over_head_costs;
            console.log(String("               "+results[i].department_id).slice(-13)+" |"
            + String("              "+ results[i].department_name).slice(-16)
            +" | "+ String("                           "+results[i].over_head_costs).slice(-16)
            +" | "+ String("                     "+results[i].total_dep_sales).slice(-19)
            +" | "+ String("                     "+results[i].profit).slice(-10)
            +"\n");

        }

        connection.end();

    });

}

function addNewDep()
{
    inquirer.prompt([
        {
            type:"input",
            name:"department",
            message:"Please enter department name: "
        },
        {
            type:"input",
            name:"overhead",
            message:"Please enter the over head costs for this department: "
        }
    ]).then(function (answer){

        connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?,?)",[answer.department,answer.overhead],function(error){
            if(error) throw error;

            console.log("New department "+ answer.department+" is added.\n");
            connection.end();
        });

    });
}

