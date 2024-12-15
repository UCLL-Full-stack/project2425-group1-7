import jwt from "jsonwebtoken";

export const generateJWT = (email: string, id: number, username: string): string => {
    const options = {
        expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`,
        issuer: 'yadig'
    };

    const secret = process.env.JWT_SECRET??'default_secret';

    try{
        return jwt.sign({email, id, username}, secret, options);
    }catch(e){
        console.log(e);
        throw new Error('error generating JWT see server log for details')
    }
};
