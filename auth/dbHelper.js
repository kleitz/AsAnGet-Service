import model from './model';



export const getbyId = async(user_id) => {
    try {
        const existUser = await model.findOne({ _id  : user_id });
        return {name:existUser.name,id:existUser._id,url:existUser.imageUrl,email:existUser.email};
    } catch (error) {
        return Promise.reject(error);
    }
}