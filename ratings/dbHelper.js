
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
export const getuserratings = async (user_id, role) => {
    try {
        const userdata = await ratings.find({ "ratedUserId": user_id, "role": role });
        const rating = userdata.map((task) => {
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

export const getuserratingOutOf5 = async (user_id) => {
    try {
        const userdata = await ratings.find({ "ratedUserId": user_id});
        const rating5 = [];
        const rating4 = []
        const rating3 = []
        const rating2 = []
        const rating1 = []

        for (let index = 0; index < userdata.length; index++) {
            const element = userdata[index];
            if(task.rate === 5)     rating5.push(element.rate);
            else if(task.rate === 4) rating4.push(element.rate);
            else if(task.rate === 3) rating3.push(element.rate);
            else if(task.rate === 2) rating2.push(element.rate);
            else if(task.rate === 1) rating1.push(element.rate);
        }

       const allRatingSum = 5*rating5.length +  4*rating4.length +  
                            3*rating3.length +  2*rating2.length + 1*rating1.length;
       const totalResponse = rating5.length +  rating4.length +  rating3.length + 
                             rating2.length + rating1.length;  
        const rating5Star = (totalResponse > 0) ? (allRatingSum / totalResponse).toFixed(1) : 1;
        console.log('888888888----', rating5Star,allRatingSum,totalResponse);
        return rating5Star;                   

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
ratingsDbHelper.getRatingsReview = async (rate, review) => {
    try {
        return ratings.find({ "_rate": rate, "_review": review })
            .exec()
            .then((results) => {
                return results;
            });
    } catch (err) {
        return Promise.reject(err);
    }
}


export default ratingsDbHelper;


