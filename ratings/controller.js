import dbHelper from './dbHelper';

const ratings= {};

ratings.add = async (req) => {
    try {
        return await dbHelper.save(req.body);
    } catch (err) {
        return Promise.reject(err);
    }
}

ratings.get = async () => {
    try {
        return await dbHelper.get();
    } catch (err) {
        return Promise.reject(err);
    }
}

export default ratings;