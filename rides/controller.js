import {getTestFromDb,saveTestFromDb} from './dbHelper';

export const getTest = async () => {
    try {
        await getTestFromDb();
    } catch (error) {
        return Promise.reject(error);
    }
}

export const saveTest = async (body) => {
    try {
        await saveTestFromDb(body);
    } catch (error) {
        return Promise.reject(error);
    }
}