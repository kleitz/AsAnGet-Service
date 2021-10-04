import dbHelper from './dbHelper';

const payment= {};

export const add = async (req, res, next) => {  
    try {  
       const paymentObj = await dbHelper.save(req.body);
        return res.status(200).json({ data: paymentObj });
    } catch (err) {
        return next(err);
    }
}
export const update = async (req, res, next) => {
    try {
        
        // const { user_id,role } = req.body;
        // const rideDetails = await getuserpayment(user_id,role );
        return res.status(200).send({});
    } catch (error) {
        next(error);
    }
}


export default payment;