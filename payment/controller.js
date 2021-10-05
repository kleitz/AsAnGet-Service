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

export const getAll = async(req, res, next) => {
    try {
        const payments = await dbHelper.getAll();
        return res.status(200).send({payments});
    } catch (error) {
        next(error);
    }
}

export const callback = async(req, res, next)=>{
    console.log('------req-------', req.body);
    const updatePayment = await dbHelper.update(req.body);
    return res.status(200).send({updatePayment});
    
}


export default payment;