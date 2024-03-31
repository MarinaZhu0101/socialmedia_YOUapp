const {verify} = require("jsonwebtoken");


// const validateToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({error: "User not logged in!"});

//     const token = authHeader.split(' ')[1]; // Assuming "Bearer <token>"
//     if (!token) return res.status(401).json({error: "Token not provided!"});

//     try {
//         const validToken = verify(token, process.env.JWT_SECRET);
//         if (validToken) {
//             req.user = validToken; // Optionally attach user payload to request
//             return next();
//         }
//     } catch (err) {
//         return res.status(403).json({error: "Invalid token"});
//     }
// };


const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(); 
    }

    const token = authHeader.split(' ')[1]; 
    if (!token) {
        return next(); 
    }

    try {
        const validToken = verify(token, process.env.JWT_SECRET);
        if (validToken) {
            req.user = validToken; 
        }
    } catch (err) {
 
    }
    return next(); 
};


module.exports = { validateToken };