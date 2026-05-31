-- & "C:\Program Files\MySQL\MySQL Server 8.3\bin\mysql.exe" -u root -p

CREATE TABLE Users(
    userId VARCHAR(50) PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Tickets (
    fullName varchar(60),
    ticketId INT AUTO_INCREMENT PRIMARY KEY,         
    ticketNumber VARCHAR(20) NOT NULL UNIQUE,      
    userId VARCHAR(50),                            
    aadhar VARCHAR(20) NOT NULL,                   
    source VARCHAR(50) NOT NULL,                    
    destination VARCHAR(50) NOT NULL,               
    busType ENUM('ordinary', 'express') NOT NULL,  
    adults INT DEFAULT 0,                            
    children INT DEFAULT 0,                          
    adultFare DECIMAL(10,2) DEFAULT 0,             
    childFare DECIMAL(10,2) DEFAULT 0,             
    totalTickets INT NOT NULL,                      
    totalFare DECIMAL(10,2) NOT NULL,              
    qrCode VARCHAR(255),                            
    status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',  
    bookingTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    paymentId VARCHAR(50),        
    boardedStatus VARCHAR(50) DEFAULT 'pending'        
    FOREIGN KEY (userId) REFERENCES Users(userId)   
);

CREATE TABLE BusFares (
    fareId INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    busType ENUM('ordinary','express') NOT NULL,
    adultFare DECIMAL(10,2) NOT NULL,
    childFare DECIMAL(10,2) NOT NULL,
    UNIQUE KEY (source, destination, busType)
);

CREATE TABLE Conductor (
    fullName VARCHAR(50),
    employeeId  VARCHAR(50) PRIMARY KEY,
    email VARCHAR(50),
    phone VARCHAR(15),
    licenseNumber VARCHAR(50),
    password VARCHAR(255),
    confirmPassword VARCHAR(50),
    terms BOOLEAN
);
