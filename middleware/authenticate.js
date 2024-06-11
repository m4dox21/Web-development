const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.mytoken;
        if (!token) {
            console.log('Token not found');
            return res.send('Login in first!');
        }

        const decoded = jwt.verify(token, 'kodSzyfrujacy');
        console.log('Decoded token:', decoded);

        const userId = decoded._id;
        console.log('User ID from token:', userId);

        const user = await User.findById(userId).exec();
        if (!user) {
            console.log('User not found');
            return res.send('Login in first!');
        }

        req.user = user;
        console.log('Authenticated user:', req.user);

        next();
    } catch (err) {
        console.log('Authentication error:', err);
        res.send('Login in first!');
    }
};

module.exports = authenticate;
