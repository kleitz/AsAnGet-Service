import ratings from './model';
const ratingsDbHelper = {};

ratingsDbHelper.save = async (ratingsInput) => {
    try {
        return (ratingsInput)
        const model = await new ratings(ratingsInput);   
        await model.save();     
    } catch (err) {
        return Promise.reject(err);
    }
}
ratingsDbHelper.get = async (role) => {
    try {
        return find({_role:role})
            .exec()
            .then((results) => {
               
            });
    } catch (err) {
        return Promise.reject(err);
    }
}

export default ratingsDbHelper;


