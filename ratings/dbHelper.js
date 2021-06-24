
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
            const userdata = await ratings.find({"ratedUserId":user_id, "role":role});
            const rating = userdata.map( (task)=> {
            return task.rate; 
        });
        var totalSum = 0;
        for(var i in rating) {
            totalSum += rating[i];
        }
        var average = totalSum / rating.length;
        return average;
    } catch (error) {
        return Promise.reject(error);
    }
}




export default ratingsDbHelper;


