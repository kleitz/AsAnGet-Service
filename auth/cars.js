import {addUserCar, myCars, deleteCar, findCar, updateCar} from './dbHelper';

/*addCar() adds car according to modelView*/
export const addCar = async (req, res, next) => {
    try {
        const {user_id,  category,model_type, seat, car_no ,Brand } = req.body;     
        const modelView = {
            user_id : user_id,
            category : category,
            model : model_type,
            brand : Brand,
            seats : seat,
            carNo : car_no    
        };
        await addUserCar(modelView);
        return res.status(200).send({"Success":"Car is added successfully."});
    } catch (error) {
        next(error);
    }
}
/*myCar() used to add user car*/ 
export const myCar = async (req, res, next) => {
    try {
        const {user_id } = req.body;     
        
        const cars = await myCars(user_id);
        return res.status(200).send({cars});
    } catch (error) {
        next(error);
    }
}
/*userCars() is used to add other deatails about cars*/
export const userCars = async (req, res, next) => {
    try {
        const {user_id } = req.body;     
        
        const cars = await myCars(user_id);
        console.log(cars);
        
        if(cars){
            const data = cars.map( (task)=> {
            const id = task._id;     
            const category = task.category;
            const carNo = task.carNo; 
            const seats = task.seats -1; 
            const model = task.model;
            return {category, carNo, seats, model,id};
        });
        return res.status(200).send({data});

    }
        return res.status(200).send({"data":[]});
    } catch (error) {
        next(error);
    }
}


export const removeCar = async (req, res, next) => {
    try {
        const {userId, carId } = req.body;     
        await deleteCar(userId, carId);
        return res.status(200).send("Car Deleted Successfully");
    } catch (error) {
        next(error);
    }
}

export const getcar = async (req, res, next) => {
    try {
        const {userId, carId} = req.body;     
        const Car = await findCar(userId, carId);
        return res.status(200).send({Car});
    } catch (error) {
        next(error);
    }
}

export const updatecar = async (req, res, next) => {
    try {
        await updateCar(req.body);
        return res.status(200).send({"Update":"Success"});
    } catch (error) {
        next(error);
    }
}