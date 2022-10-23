const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const { menuQuestion, departmentQuestion, roleQuestion, employeeQuestion } = require('./src/questions');

inquirer.prompt(menuQuestion)
.then((answer)=>console.log(answer))