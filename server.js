const inquirer = require('inquirer');
const util = require('util')
const figlet = require('figlet');

const { menuQuestion } = require('./helpers/questions')
const { db, viewAllDepartments, viewAllRoles, viewAllEmployees, viewBudget, addDepartment, addRole, addEmployee, updateEmployee, deleteDep } = require('./helpers/query-func')

//use figlet to print 'Employee Tracker' logo
const printTitle = async () => {
    const figletPromise = util.promisify(figlet.text)
    const data = await figletPromise('Employee Tracker', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 100,
        whitespaceBreak: true
    })
    console.log(data)
}

const choices = async (result) => {
    switch (result.choice) {
        case 'View all departments':
            await viewAllDepartments();
            menu();
            break;
        case 'View all roles':
            await viewAllRoles();
            menu();
            break;
        case 'View all employees':
            await viewAllEmployees();
            menu();
            break;
        case 'Add a department':
            await addDepartment();
            menu();
            break;
        case 'Add a role':
            await addRole();
            menu();
            break;
        case 'Add an employee':
            await addEmployee();
            menu();
            break;
        case 'Update an employee role':
            await updateEmployee();
            menu();
            break;
        case 'View budget':
            await viewBudget();
            menu();
            break;
        case 'Delete a department':
            await deleteDep();
            menu();
            break;
        case 'Quit':
            db.end();
            break;
        default:
            console.log('Error');
            break;
    }
}

const menu = async () => {
    const result = await inquirer.prompt(menuQuestion);
    choices(result);
}

const start = async () => {
    await printTitle();
    menu();
}

start();

