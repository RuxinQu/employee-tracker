const menuQuestion = [
    {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role"
        ]
    }]

const departmentQuestion = [{
    type: "input",
    name: "department-name",
    message: "What is the name of the department?",
    validate: function (input) {
        return !!input || "Please enter the name of the department!";
    }
}]

const roleQuestion = [
    {
        type: "input",
        name: "role-name",
        message: "What is the name of the role?",
        validate: function (input) {
            return !!input || "Please enter the name of the role!";
        }
    },
    {
        type: "input",
        name: "role-salary",
        message: "What is the salary of the role?",
        validate: function (input) {
            return !!input || "Please enter the salary of the role!";
        }
    },
    // fill this choice from the department list 
    {
        type: "list",
        name: "role-department",
        message: "Which department does the role belong to?",
        choices: [

        ]
    }
]

const employeeQuestion = [
    {
        type: "input",
        name: "first-name",
        message: "What's the employee's first name?",
        validate: function (input) {
            return !!input || "Please enter the first name!";
        }
    },
    {
        type: "input",
        name: "last-name",
        message: "What's the employee's last name?",
        validate: function (input) {
            return !!input || "Please enter the last name!";
        }
    },
    {
        type: "list",
        name: "employee-role",
        message: "What's the employee's role?",
        choices: [
            //get this from the database
        ]
    },
    {
        type: "list",
        name: "employee-manager",
        message: "Who is the employee's manager?",
        choices: [
            //get this from the database
        ]
    }
]

module.exports = { menuQuestion, departmentQuestion, roleQuestion, employeeQuestion }