import jwt from "jsonwebtoken";

export const generateJWT = (role: string,  username: string): string => {
    const options = {
        expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`,
        issuer: 'yadig'
    };

    const secret = process.env.JWT_SECRET??'default_secret';

    try{
        return jwt.sign({role, username}, secret, options);
    }catch(e){
        console.log(e);
        throw new Error('error generating JWT see server log for details')
    }
};
