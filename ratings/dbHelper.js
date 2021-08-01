
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
/*
export const getRatingsReview = async (body) => {
    try {
        const {filter,pagination} = body;
        const {pageNo,pageSize} = pagination;
        return ratings.find(filter).sort()
            .exec()
            .then((results) => {
                const startIndex = (pageNo && pageSize)? (pageNo-1)*pageSize : 0;
                const endIndex = (pageNo && pageSize) ? startIndex + pageSize : results.length;
                const activeRatings = results.filter(r => (r.rate));
                const paginationResult = activeRatings.slice(startIndex,endIndex);
                return paginationResult;
            });
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}
*/
ratingsDbHelper.getRatingsReview = async (rate,review) => {
    try {
        return ratings.find({"_rate":rate,"_review":review})
            .exec()
            .then((results) => {
                return results;
            });
    } catch (err) {
        return Promise.reject(err);
    }
}


export default ratingsDbHelper;


