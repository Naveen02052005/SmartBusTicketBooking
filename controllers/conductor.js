// const connection = require("../db");
// module.exports.renderConductorActive = ((req,res) =>{
//     const query = `
//         SELECT * FROM Tickets 
//         WHERE source LIKE ? OR destination LIKE ? 
//         ORDER BY bookingTime DESC
//     `;
    
//     const routeParts = req.session.route ? req.session.route.split(' → ') : ["", ""];
//     connection.query(query, [routeParts[0] + '%', routeParts[1] + '%'], (err, tickets) => {
//         if (err) {
//             console.error(err);
//             tickets = []; // Fallback to empty array
//         }

//         // Process tickets for display
//         const processedTickets = tickets.map(ticket => {
//             const bookingTime = new Date(ticket.bookingTime);
//             const now = new Date();
//             const hoursDiff = (now - bookingTime) / (1000 * 60 * 60);
            
//             return {
//                 ...ticket,
//                 isExpired: hoursDiff > 24,
//                 bookingDateIST: bookingTime.toLocaleString("en-IN", {
//                     timeZone: "Asia/Kolkata"
//                 }),
//                 qrImage: `/qrcodes/${ticket.ticketNumber}.png`
//             };
//         });

//         res.render("pages/conductor-active", {
//             conductor: {
//                 id: req.session.employeeId,
//                 name: req.session.conductorName,
//                 busNumber: req.session.busNumber,
//                 route: req.session.route,
//                 startTime: req.session.journeyStartTime = new Date()
//             },
//             tickets: processedTickets,
//             journey: {
//                 busNumber: req.session.busNumber,
//                 route: req.session.route,
//                 date: new Date().toLocaleDateString('en-IN', { 
//                     weekday: 'long', 
//                     year: 'numeric', 
//                     month: 'long', 
//                     day: 'numeric' 
//                 }),
//                 startTime: new Date(req.session.journeyStartTime).toLocaleTimeString('en-IN', {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     hour12: true
//                 }),
//                 endTime: new Date(new Date(req.session.journeyStartTime).getTime() + 4.5 * 60 * 60 * 1000).toLocaleTimeString('en-IN', {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     hour12: true
//                 }),
//                 status: "active"
//             }
//         });
//     });
// });


// // Scan Ticket

// module.exports.scanTicket =((req, res) => {
//     try {
//         console.log('Scan ticket request received:', req.body);
        
//         const { ticketNumber } = req.body;

//         if (!ticketNumber) {
//             console.log('No ticket number provided');
//             return res.status(400).json({
//                 success: false,
//                 message: "Ticket number is required"
//             });
//         }

//         console.log('Looking for ticket:', ticketNumber);

//         // Mock ticket database for testing
//         const mockTickets = [
//             {
//                 ticketNumber: "TG20240403456",
//                 fullName: "Raj Kumar",
//                 source: "Godavarikhani",
//                 destination: "Peddapalli",
//                 busType: "ordinary",
//                 adults: 2,
//                 children: 1,
//                 totalFare: 150,
//                 bookingTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
//                 boardedStatus: null
//             },
//             {
//                 ticketNumber: "TG20240403789",
//                 fullName: "Priya Sharma",
//                 source: "Godavarikhani",
//                 destination: "Karimnagar",
//                 busType: "express",
//                 adults: 1,
//                 children: 0,
//                 totalFare: 100,
//                 bookingTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
//                 boardedStatus: null
//             },
//             {
//                 ticketNumber: "TG20240403123",
//                 fullName: "Amit Patel",
//                 source: "Peddapalli",
//                 destination: "Mancherial",
//                 busType: "ordinary",
//                 adults: 3,
//                 children: 1,
//                 totalFare: 200,
//                 bookingTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
//                 boardedStatus: null
//             },
//             {
//                 ticketNumber: "TG20240403457",
//                 fullName: "Sneha Reddy",
//                 source: "Karimnagar",
//                 destination: "Warangal",
//                 busType: "express",
//                 adults: 2,
//                 children: 2,
//                 totalFare: 380,
//                 bookingTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
//                 boardedStatus: null
//             },
//             {
//                 ticketNumber: "TG20240403458",
//                 fullName: "Vikram Singh",
//                 source: "Warangal",
//                 destination: "Hyderabad",
//                 busType: "ordinary",
//                 adults: 1,
//                 children: 1,
//                 totalFare: 120,
//                 bookingTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
//                 boardedStatus: null
//             }
//         ];

//         // Find ticket in mock database
//         const ticket = mockTickets.find(t => t.ticketNumber === ticketNumber);

//         if (!ticket) {
//             console.log('Ticket not found:', ticketNumber);
//             return res.status(404).json({
//                 success: false,
//                 message: `Ticket not found: ${ticketNumber}. Available tickets: TG20240403456, TG20240403789, TG20240403123, TG20240403457, TG20240403458`
//             });
//         }

//         console.log('Ticket found:', ticket);

//         const bookingTime = new Date(ticket.bookingTime);
//         const now = new Date();
//         const hoursDiff = (now - bookingTime) / (1000 * 60 * 60);

//         // Check if ticket is expired
//         if (hoursDiff > 24) {
//             console.log('Ticket expired:', ticketNumber);
//             return res.status(400).json({
//                 success: false,
//                 message: "Ticket has expired",
//                 ticket: {
//                     ticketNumber: ticket.ticketNumber,
//                     fullName: ticket.fullName,
//                     source: ticket.source,
//                     destination: ticket.destination,
//                     totalFare: ticket.totalFare,
//                     status: "expired"
//                 }
//             });
//         }

//         // Check if already boarded
//         if (ticket.boardedStatus === 'boarded') {
//             console.log('Ticket already boarded:', ticketNumber);
//             return res.status(400).json({
//                 success: false,
//                 message: "Ticket already boarded",
//                 ticket: {
//                     ticketNumber: ticket.ticketNumber,
//                     fullName: ticket.fullName,
//                     source: ticket.source,
//                     destination: ticket.destination,
//                     totalFare: ticket.totalFare,
//                     status: "boarded"
//                 }
//             });
//         }

//         // Mark passenger as boarded (mock update)
//         ticket.boardedStatus = 'boarded';
//         ticket.boardedTime = new Date();

//         console.log('Mock ticket boarded successfully:', ticket);

//         res.json({
//             success: true,
//             message: "Passenger boarded successfully",
//             ticket: {
//                 ticketNumber: ticket.ticketNumber,
//                 fullName: ticket.fullName,
//                 source: ticket.source,
//                 destination: ticket.destination,
//                 totalFare: ticket.totalFare,
//                 status: "boarded"
//             }
//         });
//     } catch (error) {
//         console.error('Error in scan-ticket route:', error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error: " + error.message
//         });
//     }
// });

// // get journey statistics

// module.exports.journeyDetails = ((req, res) => {
//     const query = `
//         SELECT 
//             COUNT(*) as totalTickets,
//             SUM(CASE WHEN boardedStatus = 'boarded' THEN 1 ELSE 0 END) as boardedTickets,
//             SUM(CASE WHEN boardedStatus IS NULL OR boardedStatus != 'boarded' THEN 1 ELSE 0 END) as pendingTickets,
//             SUM(totalFare) as totalRevenue
//         FROM Tickets 
//         WHERE source LIKE ? OR destination LIKE ?
//     `;
    
//     const routeParts = req.session.route.split(' → ');
//     connection.query(query, [routeParts[0] + '%', routeParts[1] + '%'], (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to fetch statistics"
//             });
//         }

//         const stats = results ? results[0] : {};
//         res.json({
//             success: true,
//             stats: {
//                 totalTickets: stats.totalTickets || 0,
//                 boardedTickets: stats.boardedTickets || 0,
//                 pendingTickets: stats.pendingTickets || 0,
//                 totalRevenue: stats.totalRevenue || 0,
//                 boardingPercentage: stats.totalTickets > 0 ? 
//                     Math.round((stats.boardedTickets / stats.totalTickets) * 100) : 0
//             }
//         });
//     });
// });



const connection = require("../db");

// =============================
// RENDER CONDUCTOR ACTIVE PAGE
// =============================
module.exports.renderConductorActive = (req, res) => {

    // ✅ FIX: Prevent crash if route is undefined
    const routeParts = req.session.route 
        ? req.session.route.split(' → ') 
        : ["", ""];

    const query = `
        SELECT * FROM Tickets 
        WHERE source LIKE ? OR destination LIKE ?
        ORDER BY bookingTime DESC
    `;

    connection.query(query, [routeParts[0] + '%', routeParts[1] + '%'], (err, tickets) => {

        if (err) {
            console.error(err);
            tickets = [];
        }

        // ✅ FIX: Set journey start time only once
        if (!req.session.journeyStartTime) {
            req.session.journeyStartTime = new Date();
        }

        const processedTickets = tickets.map(ticket => {
            const bookingTime = new Date(ticket.bookingTime);
            const now = new Date();
            const hoursDiff = (now - bookingTime) / (1000 * 60 * 60);

            return {
                ...ticket,
                isExpired: hoursDiff > 24,
                bookingDateIST: bookingTime.toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                }),
                qrImage: `/qrcodes/${ticket.ticketNumber}.png`
            };
        });

        res.render("pages/conductor-active", {
            conductor: {
                id: req.session.employeeId,
                name: req.session.conductorName,
                busNumber: req.session.busNumber,
                route: req.session.route,
                startTime: req.session.journeyStartTime // ✅ FIX
            },
            tickets: processedTickets,
            journey: {
                busNumber: req.session.busNumber,
                route: req.session.route,
                date: new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                startTime: new Date(req.session.journeyStartTime).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
                endTime: new Date(
                    new Date(req.session.journeyStartTime).getTime() + 4.5 * 60 * 60 * 1000
                ).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
                status: "active"
            }
        });
    });
};


// =============================
// SCAN TICKET (REAL DATABASE)
// =============================
module.exports.scanTicket = (req, res) => {

    try {
        const { ticketNumber } = req.body;

        if (!ticketNumber) {
            return res.status(400).json({
                success: false,
                message: "Ticket number is required"
            });
        }

        const query = "SELECT * FROM Tickets WHERE ticketNumber = ?";

        connection.query(query, [ticketNumber], (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database error",
                    ticket: null   
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Ticket not found",
                    ticket: null   
                });
            }

            let ticket = results[0];

            const bookingTime = new Date(ticket.bookingTime);
            const now = new Date();
            const hoursDiff = (now - bookingTime) / (1000 * 60 * 60);

            if (hoursDiff > 24) {
                return res.status(400).json({
                    success: false,
                    message: "Ticket expired",
                    ticket: {
                        ticketNumber: ticket.ticketNumber,
                        fullName: ticket.fullName,
                        source: ticket.source,
                        destination: ticket.destination,
                        totalFare: ticket.totalFare,
                        status: "expired"
                    }
                });
            }

            if (ticket.boardedStatus === 'boarded') {
                return res.status(400).json({
                    success: false,
                    message: "Ticket already boarded",
                    ticket: {
                        ticketNumber: ticket.ticketNumber,
                        fullName: ticket.fullName,
                        source: ticket.source,
                        destination: ticket.destination,
                        totalFare: ticket.totalFare,
                        status: "boarded"
                    }
                });
            }

            const routeParts = req.session.route 
                ? req.session.route.split(' → ') 
                : ["", ""];

            if (
                routeParts[0] &&
                routeParts[1] &&
                (ticket.source !== routeParts[0] ||
                 ticket.destination !== routeParts[1])
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid route for this bus",
                    ticket: {
                        ticketNumber: ticket.ticketNumber,
                        fullName: ticket.fullName,
                        source: ticket.source,
                        destination: ticket.destination,
                        totalFare: ticket.totalFare,
                        status: "invalid-route"
                    }
                });
            }

            const updateQuery = `
                UPDATE Tickets 
                SET boardedStatus = 'boarded', boardedTime = NOW()
                WHERE ticketNumber = ?
            `;

            connection.query(updateQuery, [ticketNumber], (err) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: false,
                        message: "Failed to update boarding",
                        ticket: null   
                    });
                }

                return res.json({
                    success: true,
                    message: "Passenger boarded successfully",
                    ticket: {
                        ticketNumber: ticket.ticketNumber,
                        fullName: ticket.fullName,
                        source: ticket.source,
                        destination: ticket.destination,
                        totalFare: ticket.totalFare,
                        status: "boarded"
                    }
                });
            });

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            ticket: null   
        });
    }
};


// =============================
// JOURNEY STATISTICS
// =============================
module.exports.journeyDetails = (req, res) => {

    // ✅ FIX: prevent crash
    const routeParts = req.session.route 
        ? req.session.route.split(' → ') 
        : ["", ""];

    const query = `
        SELECT 
            COUNT(*) as totalTickets,
            SUM(CASE WHEN boardedStatus = 'boarded' THEN 1 ELSE 0 END) as boardedTickets,
            SUM(CASE WHEN boardedStatus IS NULL OR boardedStatus != 'boarded' THEN 1 ELSE 0 END) as pendingTickets,
            SUM(totalFare) as totalRevenue
        FROM Tickets 
        WHERE source LIKE ? OR destination LIKE ?
    `;

    connection.query(query, [routeParts[0] + '%', routeParts[1] + '%'], (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch statistics"
            });
        }

        const stats = results[0] || {};

        res.json({
            success: true,
            stats: {
                totalTickets: stats.totalTickets || 0,
                boardedTickets: stats.boardedTickets || 0,
                pendingTickets: stats.pendingTickets || 0,
                totalRevenue: stats.totalRevenue || 0,
                boardingPercentage: stats.totalTickets > 0
                    ? Math.round((stats.boardedTickets / stats.totalTickets) * 100)
                    : 0
            }
        });
    });
};