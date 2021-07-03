import {addUserCar, myCars} from './dbHelper';


export const addCar = async (req, res, next) => {
    try {
        const {user_id,  category,model_type, seat, car_no  } = req.body;     
        const modelView = {
            user_id : user_id,
            category : category,
            model : model_type,
            seats : seat,
            carNo : car_no    
        };
        await addUserCar(modelView);
        return res.status(200).send({"Success":"Car added succesfully"});
    } catch (error) {
        next(error);
    }
}

export const myCar = async (req, res, next) => {
    try {
        const {user_id } = req.body;     
        
        const cars = await myCars(user_id);
        return res.status(200).send({cars});
    } catch (error) {
        next(error);
    }
}

export const userCars = async (req, res, next) => {
    try {
        const {user_id } = req.body;     
        
        const cars = await myCars(user_id);
        console.log(cars);
        const data = cars.map( (task)=> {
            const category = task.category;
            const carNo = task.carNo; 
            const seats = task.seats; 
            return {category, carNo, seats};
        });
        return res.status(200).send({data});
    } catch (error) {
        next(error);
    }
}