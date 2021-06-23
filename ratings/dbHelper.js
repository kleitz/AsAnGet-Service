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
export const getuserratings = async(user_id,role) => {
    try {
     
      const ratings = await model.findall({"ratedUserId":user_id, "role":role});
        
        return;
    } catch (error) {
        return Promise.reject(error);
    }
}


export default ratingsDbHelper;


