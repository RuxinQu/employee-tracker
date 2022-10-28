const menuQuestion = [{
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "View budget",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Delete a department",
        "Quit"
    ]
}];

const departmentQuestion = [{
    type: "input",
    name: "name",
    message: "What is the name of the department?",
    validate: function (input) {
        return !!input || "Please enter the name of the department!";
    }
}];

const roleQuestion = (department) => {
    return [
        {
            type: "input",
            name: "name",
            message: "What is the name of the role?",
            validate: function (input) {
                return !!input || "Please enter the name of the role!";
            }
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?",
            validate: function (input) {
                return isNaN(parseInt(input)) ? "Please enter the salary as a number!" : true;
            }
        },
        {
            type: "list",
            name: "department",
            message: "Which department does the role belong to?",
            choices: department
        }
    ]
};

const employeeQuestion = (role, manager) => {
    return [
        {
            type: "input",
            name: "first",
            message: "What's the employee's first name?",
            validate: function (input) {
                return !!input || "Please enter the first name!";
            }
        },
        {
            type: "input",
            name: "last",
            message: "What's the employee's last name?",
            validate: function (input) {
                return !!input || "Please enter the last name!";
            }
        },
        {
            type: "list",
            name: "role",
            message: "What's the employee's role?",
            choices: role
        },
        {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: manager
        }
    ]
}

const updateQuestion = (employee, role) => {
    return [
        {
            type: "list",
            name: "name",
            message: "Which employee would you like to update?",
            choices: employee
        },
        {
            type: "list",
            name: "role",
            message: "What role would you like to assign the selected employee?",
            choices: role
        }
    ]
}

const selectDepQuestion = (department, option) => {
    return [
        {
            type: "list",
            name: "name",
            message: `Which department would you like to ${option}?`,
            choices: department
        }
    ]
}

const deleteConfirm = () => {
    return [
        {
            type: "input",
            name: "confirm",
            message: "Delete the department will also delete the roles and employees inside it, are you sure you want to delete it? (y/n)",
            validate: function (input) {
                return !!input || "Please make a choice!";
            }
        },
    ]
}

module.exports = { menuQuestion, departmentQuestion, roleQuestion, employeeQuestion, updateQuestion, selectDepQuestion, deleteConfirm }