INSERT INTO department(name)
VALUES
    ('Sales'), 
    ('Engineering'), 
    ('Finance'), 
    ('Human Resource');
    
INSERT INTO role(title, salary, department_id )
VALUES
    ('Sales Lead', 100000, 1), 
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2), 
    ('Software Engineer', 120000, 2), 
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Human Resource Manager',155000, 4);
    

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('Nichola', 'Jewel', 1, NULL), 
    ('Annie', 'Emerie', 2, 1), 
    ('Chrissie', 'Daniela', 3, NULL), 
    ('Mabella', 'Toby', 4, 3),
    ('Jacinda', 'Addie', 5, NULL),
    ('Abigayle', 'Emory',6, 5),
    ('Lindsie', 'Isebella', 7, NULL); 




