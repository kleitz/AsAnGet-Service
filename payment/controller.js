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
    try{
    const updatePayment = await dbHelper.update(req.body);
    return res.status(200).send({updatePayment});
    } catch (error) {
        next(error);
    }
    
}

export const getByOrderId = async(req, res, next) => {
    try {
        const {orderId} = req.body;
        const order = await dbHelper.getByOrderId(orderId);
        return res.status(200).send(order);
    } catch (error) {
        next(error);
    }
}


export default payment;