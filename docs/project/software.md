# Реалізація інформаційного та програмного забезпечення

## SQL-скрипт для створення на початкового наповнення бази даних

```sql
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8mb4 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`User` ;

CREATE TABLE IF NOT EXISTS `User` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `roleId` INT UNSIGNED NOT NULL,
  `status` ENUM('ACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email`),
  INDEX `roleId_idx` (`roleId`),
  CONSTRAINT `fk_roleId`
      FOREIGN KEY (`roleId`)
          REFERENCES `Role` (`id`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Role` ;

CREATE TABLE IF NOT EXISTS `Role` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `idRole_UNIQUE` (`id`),
    UNIQUE INDEX `name_UNIQUE` (`name`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Project`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Project`;

CREATE TABLE IF NOT EXISTS `Project` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `ownerId` INT UNSIGNED NOT NULL,
    `teamId` INT UNSIGNED NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `name_UNIQUE` (`name`),
    INDEX `ownerId_idx` (`ownerId`),
    CONSTRAINT `fk_ownerId`
        FOREIGN KEY (`ownerId`)
            REFERENCES `User` (`id`)
            ON DELETE NO ACTION
            ON UPDATE CASCADE,
    CONSTRAINT `fk_teamId`
        FOREIGN KEY (`teamId`)
            REFERENCES `Team` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Team`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Team`;

CREATE TABLE IF NOT EXISTS `Team` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Member`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Member`;

CREATE TABLE IF NOT EXISTS `Member` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INT UNSIGNED NOT NULL,
    `teamId` INT UNSIGNED NOT NULL,
    `teamRole` ENUM('Developer', 'Project Leader') NOT NULL DEFAULT 'Developer',
    `joinedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `userId_idx` (`userId`),
    INDEX `teamId_idx` (`teamId`),
    CONSTRAINT `fk_userId`
        FOREIGN KEY (`userId`)
            REFERENCES `User` (`id`)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT `fk_member_teamId`
        FOREIGN KEY (`teamId`)
            REFERENCES `Team` (`id`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Task`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Task`;

CREATE TABLE IF NOT EXISTS `Task` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `assignedTo` INT UNSIGNED DEFAULT NULL,
  `projectId` INT UNSIGNED NOT NULL,
  `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
  `dueDate` DATETIME NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `assignedTo_idx` (`assignedTo`),
  INDEX `projectId_idx` (`projectId`),
  CONSTRAINT `fk_assignedTo_user`
      FOREIGN KEY (`assignedTo`)
          REFERENCES `User` (`id`)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
  CONSTRAINT `fk_projectId`
      FOREIGN KEY (`projectId`)
          REFERENCES `Project` (`id`)
          ON DELETE CASCADE
          ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Artefact`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Artefact`;

CREATE TABLE IF NOT EXISTS `Artefact` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `filePath` VARCHAR(255) NOT NULL,
  `fileType` VARCHAR(45) NOT NULL,
  `uploadedBy` INT UNSIGNED NOT NULL,
  `projectId` INT UNSIGNED NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `projectId_idx` (`projectId`),
  CONSTRAINT `fk_uploadedBy_user`
      FOREIGN KEY (`uploadedBy`)
          REFERENCES `User` (`id`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
  CONSTRAINT `fk_projectId_artefact`
      FOREIGN KEY (`projectId`)
          REFERENCES `Project` (`id`)
          ON DELETE CASCADE
          ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Grant`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Grant`;

CREATE TABLE IF NOT EXISTS `Grant` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
   `projectId` INT UNSIGNED NOT NULL,
   `userId` INT UNSIGNED NOT NULL,
   `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`),
   INDEX `projectId_idx` (`projectId`),
   INDEX `userId_idx` (`userId`),
   CONSTRAINT `fk_grant_project`
       FOREIGN KEY (`projectId`)
           REFERENCES `Project` (`id`)
           ON DELETE CASCADE
           ON UPDATE CASCADE,
   CONSTRAINT `fk_grant_user`
       FOREIGN KEY (`userId`)
           REFERENCES `User` (`id`)
           ON DELETE CASCADE
           ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Filling the tables with data
START TRANSACTION;

INSERT INTO `Role` (`name`) VALUES
('Admin'),
('Developer'),
('Manager');

INSERT INTO `User` (`username`, `email`, `password`, `roleId`, `status`) VALUES
('john_doe', 'john.doe@example.com', 'password123', 1, 'ACTIVE'),
('jane_smith', 'jane.smith@example.com', 'password123', 2, 'ACTIVE'),
('alex_williams', 'alex.williams@example.com', 'password123', 3, 'ACTIVE'),
('michael_brown', 'michael.brown@example.com', 'password123', 2, 'BANNED');

INSERT INTO `Team` () VALUES
(),
(),
(),
();

INSERT INTO `Member` (`userId`, `teamId`, `teamRole`) VALUES
(1, 1, 'Project Leader'),
(2, 1, 'Developer'),
(3, 2, 'Developer'),
(4, 3, 'Developer');

INSERT INTO `Project` (`name`, `description`, `ownerId`, `teamId`) VALUES
('Project A', 'Description for Project A', 1, 1),
('Project B', 'Description for Project B', 3, 2),
('Project C', 'Description for Project C', 1, 3);

INSERT INTO `Task` (`title`, `description`, `assignedTo`, `projectId`, `status`, `priority`, `dueDate`) VALUES
('Task 1 for Project A', 'Task 1 description', 2, 1, 'PENDING', 'HIGH', '2024-11-20 10:00:00'),
('Task 2 for Project A', 'Task 2 description', 3, 1, 'IN_PROGRESS', 'MEDIUM', '2024-11-25 12:00:00'),
('Task 1 for Project B', 'Task 1 description', 4, 2, 'PENDING', 'LOW', '2024-11-22 09:00:00'),
('Task 1 for Project C', 'Task 1 description', 2, 3, 'COMPLETED', 'HIGH', '2024-11-15 16:00:00');

INSERT INTO `Artefact` (`title`, `description`, `filePath`, `fileType`, `uploadedBy`, `projectId`) VALUES
('Artefact 1 for Project A', 'Initial design file', '/files/project_a/design_v1.pdf', 'PDF', 2, 1),
('Artefact 2 for Project B', 'Final report for Project B', '/files/project_b/report_final.pdf', 'PDF', 4, 2),
('Artefact 1 for Project C', 'Codebase for Project C', '/files/project_c/code.zip', 'ZIP', 2, 3);

INSERT INTO `Grant` (`projectId`, `userId`) VALUES
(1, 2),
(1, 3),
(2, 4);

COMMIT;
```
## RESTfull сервіс для управління даними
### Connection
```java
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '***',
    database: 'mydb',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connection to database successful!');
});
```
### User Entity
```java
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM User';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json(results);
        }
    });
});
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM User WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(results[0]);
        }
    });
});

app.post('/users', (req, res) => {
    const { username, email, password, roleId, status } = req.body;
    const query = 'INSERT INTO User (username, email, password, roleId, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [username, email, password, roleId, status], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.status(201).json({ message: 'User created', userId: result.insertId });
        }
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, password, roleId, status } = req.body;
    const query = 'UPDATE User SET username = ?, email = ?, password = ?, roleId = ?, status = ? WHERE id = ?';
    db.query(query, [username, email, password, roleId, status, id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json({ message: 'User updated' });
        }
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM User WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json({ message: 'User deleted' });
        }
    });
});
```
### Role Entity
```java
app.get('/roles', (req, res) => {
    const query = 'SELECT * FROM Role';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json(results);
        }
    });
});


app.get('/roles/:id', (req, res) => {
    const roleId = req.params.id;
    const query = 'SELECT * FROM Role WHERE id = ?';
    db.query(query, [roleId], (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Role not found' });
        } else {
            res.json(results[0]);
        }
    });
});

app.post('/roles', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO Role (name) VALUES (?)';
    db.query(query, [name], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.status(201).json({ message: 'Role created', roleId: result.insertId });
        }
    });
});

app.put('/roles/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const query = 'UPDATE Role SET name = ? WHERE id = ?';
    db.query(query, [name, id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }

        res.json({ message: 'Role updated' });
    });
});

app.delete('/roles/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Role WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json({ message: 'Role deleted' });
        }
    });
});
```
### Member Entity
```java
app.get('/members', (req, res) => {
    const query = 'SELECT * FROM Member';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json(results);
        }
    });
});

app.get('/members/:id', (req, res) => {
    const memberId = req.params.id;
    const query = 'SELECT * FROM Member WHERE id = ?';
    db.query(query, [memberId], (err, results) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Member not found' });
        } else {
            res.json(results[0]);
        }
    });
});

app.post('/members', (req, res) => {
    const { userId, teamId, teamRole } = req.body;
    const query = 'INSERT INTO Member (userId, teamId, teamRole) VALUES (?, ?, ?)';
    db.query(query, [userId, teamId, teamRole], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.status(201).json({ message: 'Member added', memberId: result.insertId });
        }
    });
});

app.put('/members/:id', (req, res) => {
    const { id } = req.params;
    const { userId, teamId, teamRole } = req.body;
    const query = 'UPDATE Member SET userId = ?, teamId = ?, teamRole = ? WHERE id = ?';
    db.query(query, [userId, teamId, teamRole, id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json({ message: 'Member updated' });
    });
});

app.delete('/members/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Member WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Request execution error:', err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.json({ message: 'Member removed' });
        }
    });
});

app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});

```

