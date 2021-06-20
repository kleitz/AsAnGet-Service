import ratings from './model';
const ratingsDbHelper = {};

ratingsDbHelper.save = async (ratingsInput) => {
    try {
        const model = await new ratings(ratingsInput); 
        await model.save();     
    } catch (err) {
        return Promise.reject(err);
    }
}

export default ratingsDbHelper;


