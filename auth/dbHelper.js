import model from './model';

export const getTestFromDb = async() => {
    try {
        return await model.find({});
    } catch (error) {
        return Promise.reject(err);
    }
}

export const saveTestFromDb = async(newAuth) => {
    try {
        const obj = new model(newAuth);
        await obj.save();
    } catch (error) {
        return Promise.reject(err);
    }
}