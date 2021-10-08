
import payment from './model';
import {UnSUCCESS,SUCCESS} from './const';
const paymentDbHelper = {};

paymentDbHelper.getOrderId = async () => {
    const orderIds = await payment.find({}, { orderId: 1, _id: 0 });
    const orderIdsNumber = orderIds.map(ord => (parseInt(ord.orderId)));
    const max = Math.max(...orderIdsNumber);
    let updatedOrderId = ''
    if (max.toString().length < 6) {
        updatedOrderId = '';
        for (let i = 0; i < 6 - max.toString().length; i++) {
            updatedOrderId += '0';
        }
        updatedOrderId += (max + 1);
    }
    return updatedOrderId;
}

paymentDbHelper.save = async (paymentInput) => {
    try {
        const maxorderId = await paymentDbHelper.getOrderId();
        paymentInput.orderId = maxorderId;
        const model = await new payment(paymentInput);
        return await model.save();
    } catch (err) {
        return Promise.reject(err);
    }
}

paymentDbHelper.update = async (body) => {
    try {
        const {ORDER,ACTION,RC} = body;
        let status = UnSUCCESS;
        if(ACTION === '0' && RC === '00') status = SUCCESS;
        return await payment.updateMany({ "orderId": ORDER },{$set:{
            "transcation":JSON.stringify(body),
            "status":status
        }});
    } catch (error) {
        return Promise.reject(error);
    }
}

paymentDbHelper.getAll = async()=>{
    return await payment.find({});
}

paymentDbHelper.getByOrderId =async(orderId)=>{
    return await payment.find({"orderId":orderId});
} 


export default paymentDbHelper;


