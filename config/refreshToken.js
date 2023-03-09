const jwt = require("jsonwebtoken");

const generateRefreshToken =  (id) => {
    if(!id){
        throw new Error("Invalid refresh token")
    }else {
       return jwt.sign({ id }, process.env.JWT, { expiresIn: "3d" });
    }
};

module.exports = generateRefreshToken
