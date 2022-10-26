const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { menuQuestion, departmentQuestion, roleQuestion, employeeQuestion } = require('./src/questions');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db',
});

const printTitle = () => {
    console.log('\x1b[36m%s\x1b[0m', '==============================');
    console.log('                                                  ');
    console.log('\x1b[36m%s\x1b[0m', '       EMPLOYEE-TRACKER       ');
    console.log('                                                  ');
    console.log('\x1b[36m%s\x1b[0m', '==============================');
}

const ViewDepartments = () => {
    db.promise().query('SELECT * FROM department')
        .then(result => {
            console.table(result[0]);
            menu();
        })
        .catch(err => console.error(err));
};

const ViewRoles = () => {
    db.promise().query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON department.id = role.department_id')
    .then(result => {
        console.table(result[0]);
        menu();
    })
    .catch(err => console.error(err));
};

const ViewEmployees = () => {
    db.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee  manager ON manager.id = employee.manager_id;")
    .then(result => {
        console.table(result[0]);
        menu();
    })
    .catch(err => console.error(err));
};

const addDepartment = (data) => {
    const queryStr = `INSERT INTO department(name) VALUES (?);`;
    db.query(queryStr, [data.name], (err) =>
        err ? console.log(err) : console.log('\x1b[33m%s\x1b[0m', `${data.name} department added`));
}

const addRole = (data) => {
    const queryStr = ' name FROM department'
    const departmentArr = db.query(queryStr);
    console.log(departmentArr)
}

const choices = (result) => {
    switch (result.choice) {
        case 'View all departments':
            ViewDepartments();
            break;
        case 'View all roles':
            ViewRoles();
            break;
        case 'View all employees':
            ViewEmployees();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        
            
    }
}

async function menu() {
    const result = await inquirer.prompt(menuQuestion);
    choices(result);
}


printTitle();
menu();