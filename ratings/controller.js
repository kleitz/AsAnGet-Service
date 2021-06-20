import dbHelper from './dbHelper';

const ratings= {};

export const add = async (req, res, next) => {  
    try {  
       await dbHelper.save(req.body);
        return res.status(200).json({ data: "saved" });
    } catch (err) {
        return next(err);
    }
}

export var rate =[];
var totalSum = 0;
for(var i in rate) {
    totalSum += rate[i];
}
var average = totalSum / rate.length;



export default ratings;