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

const ViewDepartments = async () => {
    try {
        const result = await db.promise().query('SELECT * FROM department')
        console.table(result[0]);
        menu();
    }
    catch (error) {
        console.error(error);
    }
};

const ViewRoles = async () => {
    try {
        const result = await db.promise().query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON department.id = role.department_id')
        console.table(result[0]);
        menu();
    }
    catch (error) {
        console.error(error);
    }
};

const ViewEmployees = async () => {
    try {
        const result = await db.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee  manager ON manager.id = employee.manager_id;")
        console.table(result[0]);
        menu();
    }
    catch (error) {
        console.error(error);
    }
};

const addDepartment = async () => {
    try {
        const answer = await inquirer.prompt(departmentQuestion);
        const queryStr = `INSERT INTO department(name) VALUES (?);`;
        await db.promise().query(queryStr, answer.name)
        console.log('\x1b[33m%s\x1b[0m', `${answer.name} department added`);
        menu();
    } catch (error) {
        console.error(error);
    }
};

const addRole = async () => {
    try {
        const dep = await db.promise().query('SELECT * FROM department');
        const depList = dep[0].map(ele=>ele.name);
        const newRole = await inquirer.prompt(roleQuestion(depList));
        const getDepId = await db.promise().query(`SELECT id FROM department WHERE name = ?;`,newRole['department']);
        await db.promise().query(`INSERT INTO role(title, salary, department_id) VALUES (?,?,?);`,[newRole.name,newRole.salary,getDepId[0][0].id])
        console.log('\x1b[33m%s\x1b[0m', ` new role ${newRole.name} added`);
        menu();
    } catch (error) {
        console.error(error);
    }
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


