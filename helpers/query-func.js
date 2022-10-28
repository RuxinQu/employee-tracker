const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const { departmentQuestion, roleQuestion, employeeQuestion, updateQuestion, selectDepQuestion, deleteConfirm } = require('./questions');

//connect the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db',
});

const viewAllDepartments = async () => {
    try {
        const result = await db.promise().query('SELECT * FROM department')
        console.table(result[0]);
    }
    catch (error) {
        console.error(error);
    }
};

//get all roles and rename the department.name column
const viewAllRoles = async () => {
    try {
        const result = await db.promise().query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON department.id = role.department_id')
        console.table(result[0]);
    }
    catch (error) {
        console.error(error);
    }
};

//concat the first name and last name to and save to manager, self join the employee table to see the manager of each employee
const viewAllEmployees = async () => {
    try {
        const result = await db.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee  manager ON manager.id = employee.manager_id;")
        console.table(result[0]);
    }
    catch (error) {
        console.error(error);
    }
};

// choose a department to view budget, the query does a select from a joint table
const viewBudget = async () => {
    try {
        const getDep = await db.promise().query('SELECT * FROM department;');
        const depList = getDep[0].map(ele => ele.name);
        const depToViewBudget = await inquirer.prompt(selectDepQuestion(depList, 'view'));
        const budget = await db.promise().query('SELECT name AS department, SUM(salary) AS budget FROM (SELECT salary,department.name FROM role LEFT JOIN department ON role.department_id = department.id) AS dep_role WHERE dep_role.name = (?);', depToViewBudget.name)
        console.table(budget[0])
    } catch (error) {
        console.error(error);
    }
}

const addDepartment = async () => {
    try {
        const newDep = await inquirer.prompt(departmentQuestion);
        await db.promise().query(`INSERT INTO department(name) VALUES (?);`, newDep.name)
        console.log('\x1b[33m%s\x1b[0m', `${newDep.name} department added`);
    } catch (error) {
        console.error(error);
    }
};

//get all the departments from the bd and save all the names into an array. Then use the array as choices for inquirer. After all the prompts are answered,
//get the id from the selected department based on the name, then insert the new role to the role table
const addRole = async () => {
    try {
        const getDep = await db.promise().query('SELECT * FROM department;');
        const depList = getDep[0].map(({ id, name }) => ({ name: name, value: id }));
        const newRole = await inquirer.prompt(roleQuestion(depList));
        await db.promise().query(`INSERT INTO role(title, salary, department_id) VALUES (?,?,?);`, [newRole.name, newRole.salary, newRole.department])
        console.log('\x1b[33m%s\x1b[0m', ` new role ${newRole.name} added`);
    } catch (error) {
        console.error(error);
    }
}

//get all the roles and managers from database then save each of them into an array. use these two arrays as choices for prompt. Then get id for the selected role and manager(if 
//manager isn't None) and insert the new employee to employee table
const addEmployee = async () => {
    try {
        const getRole = await db.promise().query('SELECT * FROM role;');
        const roleList = getRole[0].map(({ id, title }) => ({ name: title, value: id }));
        const getManager = await db.promise().query('SELECT * FROM employee WHERE manager_id IS NULL');
        const managerList = getManager[0].map(({ first_name, last_name, id }) => ({ name: first_name + ' ' + last_name, value: id }));
        managerList.unshift('None');
        const newEmployee = await inquirer.prompt(employeeQuestion(roleList, managerList));
        newEmployee.manager === 'None'
            ? await db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,NULL);`, [newEmployee.first, newEmployee.last, newEmployee.role])
            : await db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, [newEmployee.first, newEmployee.last, newEmployee.role, newEmployee.manager])
        console.log('\x1b[33m%s\x1b[0m', `new employee ${newEmployee.first} ${newEmployee.last} added`);
    } catch (error) {
        console.error(error);
    }
}

//get all the employee's names and all the roles and save each into an array. Then prompt the user with the choices. get the name and role id from the answer,
// then get the manager id from the role id, finally do the query to update the role id and manager id to the selected employee
const updateEmployee = async () => {
    try {
        const getEmployee = await db.promise().query("SELECT * FROM employee");
        const employeeList = getEmployee[0].map(({ first_name, last_name, id }) => ({ name: first_name + ' ' + last_name, value: id }));
        const getRole = await db.promise().query('SELECT * FROM role;');
        const roleList = getRole[0].map(({ id, title }) => ({ name: title, value: id }));
        const updatedEmployee = await inquirer.prompt(updateQuestion(employeeList, roleList));
        await db.promise().query('UPDATE employee SET role_id = (?) WHERE id = (?);', [updatedEmployee.role, updatedEmployee.name])
        console.log('\x1b[33m%s\x1b[0m', 'employee updated');
    } catch (error) {
        console.error(error);
    }
}

//choose a departmen to delete 
const deleteDep = async () => {
    const getDep = await db.promise().query('SELECT * FROM department;');
    const depList = getDep[0].map(ele => ele.name);
    const depToDelete = await inquirer.prompt(selectDepQuestion(depList, 'delete'));
    const confirm = await inquirer.prompt(deleteConfirm())
    if (confirm.confirm === 'y') {
        await db.promise().query('DELETE FROM department WHERE name = (?)', depToDelete.name);
        console.log('\x1b[33m%s\x1b[0m', `${depToDelete.name} department is deleted`);
    }
    menu();
}


module.exports = { db, viewAllDepartments, viewAllRoles, viewAllEmployees, viewBudget, addDepartment, addRole, addEmployee, updateEmployee, deleteDep }