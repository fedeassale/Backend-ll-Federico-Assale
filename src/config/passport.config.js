import passport from "passport";
import jwt from "passport-jwt";

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse",
        //Misma palabra secreta que tenemos en App.js
    }, async (jwt_payload, done) => {
        console.log("JWT Payload:", jwt_payload);
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))


}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
}

export default initializePassport;