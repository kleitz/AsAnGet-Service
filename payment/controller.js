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

export const getAll = async(req, res, next) => {
    try {
        const payments = await dbHelper.getAll();
        return res.status(200).send({payments});
    } catch (error) {
        next(error);
    }
}

export const callback = async(req, res, next)=>{
    const updatePayment = await dbHelper.update(req.body);
    return res.status(200).send({updatePayment});
    
}


export default payment;