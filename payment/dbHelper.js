
import payment from './model';
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
        return await payment.updateOne({ "orderId": '000000' },{$set:{"status":JSON.stringify(body)}});
    } catch (error) {
        return Promise.reject(error);
    }
}

paymentDbHelper.getAll = async()=>{
    return await payment.find({});
}


export default paymentDbHelper;


