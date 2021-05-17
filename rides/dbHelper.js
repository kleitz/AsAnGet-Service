import model from './model';

export const saveRideInDB = async(newRide) => {
    try {
        const obj = new model(newRide);
        await obj.save();
    } catch (error) {
        return Promise.reject(err);
    }
}

export const getRidesFromDb = async() => {
    try {
        return await model.find({});
    } catch (error) {
        return Promise.reject(err);
    }
}
