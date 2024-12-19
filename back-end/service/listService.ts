import { List } from "../model/list"
import { ListInput, Role } from "../types";
import listDb from "../repository/list.db";

const getLists = async (): Promise<List[]> => {
    try{
        return await listDb.getAllLists();
    }catch(e){
        throw e;
    }
};

const getListById = async (id:number): Promise<List> => {
    try{
        const list = await listDb.getListById(id);
        if (!list) throw new Error("List Not Found");
        return list;
    }catch(e){
        throw e;
    }
};

const createList = async (list: ListInput): Promise<List> => {
    try{
        const newList = new List({
            title: list.title,
            description: list.description,
            albumIds: list.albums,
        });

        return await listDb.createList(newList, list.authorId);
    }catch(e){
        throw e;
    }
}

const editList = async (listInput: ListInput, id: number, username: string, role: Role): Promise<List> => {
    try{
        const list = await listDb.getById(id);
        if(!list) throw new Error("List Doesn't exist");
        if(list.getAuthor()?.username !== username && role !== 'admin'){
            throw new Error("you are not authorized to access this resource");
        } 
    }catch(e){
        throw e;
    }

    const list = new List({
        title: listInput.title,
        description: listInput.description,
        albumIds: listInput.albums,
    });

    try{
        return await listDb.editList(list, id);
    }catch(e){
        throw e
    }
}

const likeList = async (id: number, username: string): Promise<List> => {
    try{
        const list = await listDb.getById(id);
        if(!list) throw new Error("List Doesn't exist");
    }catch(e){
        throw e;
    }

    try{
        return await listDb.likeList(id, username);
    }catch(e){
        throw e
    }
}

const unlikeList = async (id: number, username: string): Promise<List> => {
    try{
        const list = await listDb.getById(id);
        if(!list) throw new Error("List Doesn't exist");
    }catch(e){
        throw e;
    }

    try{
        return await listDb.unlikeList(id, username);
    }catch(e){
        throw e
    }
}

const deleteList = async (id: number) => {
    try{
        await listDb.deleteList(id);
    }catch(e){
        throw e;
    }
}

export default {
    getLists, 
    getListById,
    createList,
    editList,
    likeList,
    unlikeList,
    deleteList
}
