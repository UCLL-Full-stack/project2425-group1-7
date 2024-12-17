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
            id:99999,
            username: "admin",
            email: "admin@yadig.com",
            password: await hash("verySecure",12),
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
