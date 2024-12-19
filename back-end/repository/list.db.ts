import { List } from "../model/list";
import database from "../util/database";

const getAllLists = async (): Promise<List[]> => {
    try{
        const listsPrisma = await database.list.findMany({
            include: {
                author: true,
                likes: true
            }
        });
        return listsPrisma.map((list) => List.from(list))??[];
    }catch(e){
        throw new Error('db Error');
    }
};

const getListById= async (id:number): Promise<List | null> => {
    try{
        const listsPrisma = await database.list.findUnique({
            where:{id},
            include: {
                author: true,
                likes: true
            }
        });
        if(!listsPrisma)return null;
        return List.from(listsPrisma);
    }catch(e){
        throw new Error('db Error');
    }
};

const getById = async (id: number): Promise<List | null> => {
    try{
        const listsPrisma = await database.list.findUnique({
            where: {id},
            include: {
                author: true,
                likes: true
            }
        });
        if(!listsPrisma) return null;
        return List.from(listsPrisma);
    }catch(e){
        throw new Error('db Error');
    }
};

const getUserLists = async (authorId: number): Promise<List[]> => {
    try{
        const listsPrisma = await database.list.findMany({
            where: {authorId},
            include: {
                author: true,
                likes: true
            }
        });
        if(!listsPrisma) return [];
        return listsPrisma.map((list) => List.from(list));
    }catch(e){
        throw new Error('db Error');
    }
};

const createList = async (list: List, authorId: number): Promise<List> => {
    try{
        const listPrisma = await database.list.create({
            data:{
                title: list.getTitle(), 
                description: list.getDescription(),
                albumIds: list.getAlbums(),
                author: {
                    connect: {id: authorId}
                }
            },
            include:{
                author: true,
            }
        })
        return List.from(listPrisma);
    }catch(e){
       throw new Error("DB Error");
    }
}

const editList = async (list: List, id: number): Promise<List> => {
    try{
        const listPrisma = await database.list.update({
            data:{
                title: list.getTitle(),
                description: list.getDescription(),
                albumIds: list.getAlbums(),
            },
            where: {id},
            include: {
                author: true,
                likes: true
            }
        })
        return List.from(listPrisma);
    }catch(e){
        throw new Error("DB ERROR");
    } 
}

const likeList = async (id:number, username: string): Promise<List> => {
    try{
        const listPrisma = await database.list.update({
            data:{
                likes: { connect: {username}}
            },
            where: {id},
            include: {
                author: true,
                likes: true
            }
        })
        return List.from(listPrisma);
    }catch(e){
        throw new Error("DB ERROR");
    } 
}

const unlikeList = async (id:number, username: string): Promise<List> => {
    try{
        const listPrisma = await database.list.update({
            data:{
                likes: { disconnect: {username}}
            },
            where: {id},
            include: {
                author: true,
                likes: true
            }
        })
        return List.from(listPrisma);
    }catch(e){
        throw new Error("DB ERROR");
    } 
}

const deleteList = async (id: number)=>{
    try{
        await database.list.delete({
            where: {id}
        })
    }catch(e){
        throw new Error("DB Error");
    }
}

export default {
    getAllLists,
    getListById,
    getById,
    createList,
    editList,
    getUserLists,
    likeList,
    unlikeList,
    deleteList,
}
