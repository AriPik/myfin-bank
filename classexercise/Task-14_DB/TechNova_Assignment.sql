-- =========================================
-- TechNova Assignment
-- DDL Section
-- =========================================
CREATE DATABASE TechNovaDB;
USE TechNovaDB;
CREATE TABLE Department (
    DeptID INT AUTO_INCREMENT PRIMARY KEY,
    DeptName VARCHAR(100) NOT NULL UNIQUE,
    Location VARCHAR(100) NOT NULL
);

CREATE TABLE Employee (
    EmpID INT AUTO_INCREMENT PRIMARY KEY,
    EmpName VARCHAR(100) NOT NULL,
    Gender ENUM('Male','Female','Other') NOT NULL,
    DOB DATE NOT NULL,
    HireDate DATE NOT NULL,
    DeptID INT NOT NULL,
    
    CONSTRAINT fk_employee_department
        FOREIGN KEY (DeptID)
        REFERENCES Department(DeptID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Project (
    ProjectID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectName VARCHAR(150) NOT NULL,
    DeptID INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    
    CONSTRAINT fk_project_department
        FOREIGN KEY (DeptID)
        REFERENCES Department(DeptID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Performance (
    EmpID INT,
    ProjectID INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    ReviewDate DATE NOT NULL,
    
    PRIMARY KEY (EmpID, ProjectID),
    
    CONSTRAINT fk_perf_employee
        FOREIGN KEY (EmpID)
        REFERENCES Employee(EmpID)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_perf_project
        FOREIGN KEY (ProjectID)
        REFERENCES Project(ProjectID)
        ON DELETE CASCADE
);


CREATE TABLE Reward (
    EmpID INT,
    RewardMonth DATE,
    RewardAmount DECIMAL(10,2) NOT NULL CHECK (RewardAmount >= 0),
    
    PRIMARY KEY (EmpID, RewardMonth),
    
    CONSTRAINT fk_reward_employee
        FOREIGN KEY (EmpID)
        REFERENCES Employee(EmpID)
        ON DELETE CASCADE
);


CREATE INDEX idx_employee_name
ON Employee(EmpName);

CREATE INDEX idx_employee_dept
ON Employee(DeptID);

SHOW TABLES;

DESCRIBE Employee;

-- =========================================
-- DML Section
-- =========================================

-- use TechNovaDB;
-- show tables;
Describe Employee;

INSERT INTO Department (DeptName, Location) VALUES
('Engineering', 'Bangalore'),
('HR', 'Mumbai'),
('Finance', 'Delhi'),
('Marketing', 'Chennai'),
('Operations', 'Hyderabad');

SELECT * FROM Department;


INSERT INTO Employee (EmpName, Gender, DOB, HireDate, DeptID) VALUES
('Arijit Roy', 'Male', '1998-05-12', '2022-01-15', 1),
('Neha Sharma', 'Female', '1995-08-20', '2021-03-10', 2),
('Rahul Verma', 'Male', '1993-11-05', '2020-07-18', 1),
('Priya Iyer', 'Female', '1997-02-25', '2023-06-01', 3),
('Karan Mehta', 'Male', '1990-09-14', '2019-09-09', 4);

SELECT * FROM Employee;


INSERT INTO Project (ProjectName, DeptID, StartDate, EndDate) VALUES
('AI Platform', 1, '2023-01-01', NULL),
('HR Automation', 2, '2023-02-15', NULL),
('Financial Audit', 3, '2023-03-10', '2023-09-30'),
('Market Expansion', 4, '2023-04-01', NULL),
('Supply Chain Upgrade', 5, '2023-05-20', NULL);

INSERT INTO Reward (EmpID, RewardMonth, RewardAmount) VALUES
(1, '2024-01-01', 1500.00),
(2, '2024-01-01', 900.00),
(3, '2024-01-01', 2000.00),
(4, '2024-01-01', 1200.00),
(5, '2024-01-01', 800.00);


SELECT * FROM Reward;



UPDATE Employee
SET DeptID = 1
WHERE EmpID = 2;

SELECT EmpID, EmpName, DeptID FROM Employee WHERE EmpID = 2;

SELECT * FROM Reward WHERE RewardAmount < 1000;

DELETE FROM Reward
WHERE EmpID = 5 AND RewardAmount < 1000;

SELECT * FROM Reward;


SELECT EmpID, EmpName, HireDate
FROM Employee
WHERE HireDate > '2019-01-01';

-- Aggregate Example 

SELECT 
    d.DeptName,
    ROUND(AVG(p.Rating), 2) AS AvgRating
FROM Department d
JOIN Employee e ON d.DeptID = e.DeptID
JOIN Performance p ON e.EmpID = p.EmpID
GROUP BY d.DeptName;

SELECT * FROM Performance;


SELECT EmpID, EmpName FROM Employee;

SELECT ProjectID, ProjectName FROM Project;

INSERT INTO Performance (EmpID, ProjectID, Rating, ReviewDate) VALUES
(1, 16, 5, '2024-01-10'),
(5, 17, 4, '2024-01-12'),
(2, 18, 3, '2024-01-15'),
(4, 19, 5, '2024-01-18'),
(3, 20, 2, '2024-01-20');

SELECT * FROM Performance;

-- Total rewards This Year
SELECT 
    EmpName,
    DOB,
    TIMESTAMPDIFF(YEAR, DOB, CURDATE()) AS Age
FROM Employee;
SELECT * FROM Reward;

SELECT 
    SUM(RewardAmount) AS TotalRewardsThisYear
FROM Reward
WHERE YEAR(RewardMonth) = 2024;

SELECT 
    e.EmpName,
    r.RewardAmount,
    r.RewardMonth
FROM Employee e
JOIN Reward r ON e.EmpID = r.EmpID
WHERE r.RewardAmount >= 1500;
 
-- Multi-table Join 

SELECT 
    e.EmpName,
    d.DeptName,
    pr.ProjectName,
    p.Rating
FROM Employee e
JOIN Department d 
    ON e.DeptID = d.DeptID
JOIN Performance p 
    ON e.EmpID = p.EmpID
JOIN Project pr 
    ON p.ProjectID = pr.ProjectID;
    
-- Highest Rated Employee Per Department 
SELECT 
    e.EmpName,
    d.DeptName,
    p.Rating
FROM Employee e
JOIN Department d 
    ON e.DeptID = d.DeptID
JOIN Performance p 
    ON e.EmpID = p.EmpID
WHERE p.Rating = (
    SELECT MAX(p2.Rating)
    FROM Employee e2
    JOIN Performance p2 
        ON e2.EmpID = p2.EmpID
    WHERE e2.DeptID = e.DeptID
);



SELECT 
    e.EmpName
FROM Employee e
WHERE NOT EXISTS (
    SELECT 1
    FROM Reward r
    WHERE r.EmpID = e.EmpID
);

-- =========================================
-- TCL Section
-- =========================================

START TRANSACTION;

INSERT INTO Employee 
(EmpID, EmpName, Gender, DOB, HireDate, DeptID)
VALUES 
(200, 'Test Employee', 'Male', '1998-05-14', CURDATE(), 1);

INSERT INTO Performance 
(EmpID, ProjectID, Rating, ReviewDate)
VALUES 
(200, 1, 4.5, CURDATE());

COMMIT;

START TRANSACTION;
-- Select * from Project;
-- 1️⃣ Insert new employee
INSERT INTO Employee 
(EmpID, EmpName, Gender, DOB, HireDate, DeptID)
VALUES 
(6, 'Dinesh Shergill', 'Male', '1998-05-14', CURDATE(), 2);

-- 2️⃣ Add performance record
INSERT INTO Performance 
(EmpID, ProjectID, Rating, ReviewDate)
VALUES 
(6, 18, 4.6, CURDATE());

COMMIT;


DELIMITER //

CREATE PROCEDURE AddEmployeeWithPerformance()
BEGIN
    -- If any SQL error occurs → rollback
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    -- Insert Employee (all required columns)
    INSERT INTO Employee 
    (EmpID, EmpName, Gender, DOB, HireDate, DeptID)
    VALUES 
    (7, 'Anita Roy', 'Female', '1999-08-21', CURDATE(), 1);

    -- Insert Performance (no PerfID in your schema)
    INSERT INTO Performance 
    (EmpID, ProjectID, Rating, ReviewDate)
    VALUES 
    (7, 19, 4.8, CURDATE());

    COMMIT;

END //

DELIMITER ;



CALL AddEmployeeWithPerformance();


SELECT 
    e.EmpName,
    d.DeptName,
    pr.ProjectName,
    p.Rating
FROM Employee e
JOIN Department d ON e.DeptID = d.DeptID
JOIN Performance p ON e.EmpID = p.EmpID
JOIN Project pr ON p.ProjectID = pr.ProjectID;


EXPLAIN SELECT * from Performance;


CREATE INDEX idx_employee_dept ON Employee(DeptID);
CREATE INDEX idx_performance_emp ON Performance(EmpID);
CREATE INDEX idx_performance_project ON Performance(ProjectID);


EXPLAIN SELECT * from Performance;