import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const main = async () =>{
    await prisma.comment.deleteMany();
    await prisma.list.deleteMany();
    await prisma.review.deleteMany();
    await prisma.user.deleteMany();

    const admin = await prisma.user.create({
        data:{
            username: "admin",
            email: "admin@yadig.com",
            password: await hash("verySecure",12),
            role: "admin"
        }         
    })

    const mod1 = await prisma.user.create({
        data:{
            username: "fr3udian",
            email: "adam@yadig.com",
            password: await hash("adamDaMadMod",12),
            role: "moderator"
        }         
    })

    const mod2 = await prisma.user.create({
        data:{
            username: "dezz",
            email: "dezz@yadig.com",
            password: await hash("dezzDaMod",12),
            role: "admin"
        }         
    })
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
