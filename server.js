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
        const getDep = await db.promise().query('SELECT * FROM department;');
        const depList = getDep[0].map(ele => ele.name);
        const newRole = await inquirer.prompt(roleQuestion(depList));
        const getDepId = await db.promise().query(`SELECT id FROM department WHERE name = ?;`, newRole.department);
        await db.promise().query(`INSERT INTO role(title, salary, department_id) VALUES (?,?,?);`, [newRole.name, newRole.salary, getDepId[0][0].id])
        console.log('\x1b[33m%s\x1b[0m', ` new role ${newRole.name} added`);
        menu();
    } catch (error) {
        console.error(error);
    }
}

const addEmployee = async () => {
    try {
        const getRole = await db.promise().query('SELECT * FROM role;');
        const roleList = getRole[0].map(ele => ele.title);
        const getManager = await db.promise().query('SELECT * FROM employee WHERE manager_id IS NULL');
        const managerList = getManager[0].map(ele => ele.first_name + ' ' + ele.last_name);
        managerList.unshift('None');
        const newEmployee = await inquirer.prompt(employeeQuestion(roleList, managerList));
        const getRoleId = await db.promise().query(`SELECT id FROM role WHERE title = ?;`, newEmployee.role);
        if (newEmployee.manager === 'None') {
            await db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,NULL);`, [newEmployee.first, newEmployee.last, getRoleId[0][0].id])
        } else {
            const getManagerId = await db.promise().query(`SELECT id FROM employee WHERE first_name = ?;`, newEmployee.manager.split(' ')[0]);
            await db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, [newEmployee.first, newEmployee.last, getRoleId[0][0].id, getManagerId[0][0].id])
        }
        console.log('\x1b[33m%s\x1b[0m', `new employee ${newEmployee.first} ${newEmployee.last} added`);
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
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployee();
            break;
    }
}

async function menu() {
    const result = await inquirer.prompt(menuQuestion);
    choices(result);
}


printTitle();
menu();

