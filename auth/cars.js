import {addUserCar, myCars, deleteCar, updateCar} from './dbHelper';

/*addCar() adds car according to modelView*/
export const addCar = async (req, res, next) => {
    try {
        const {user_id,  category,model_type, seat, car_no, brand  } = req.body;     
        const modelView = {
            user_id : user_id,
            category : category,
            model : model_type,
            seats : seat,
            carNo : car_no,
            brand : brand

        };
        await addUserCar(modelView);
        return res.status(200).send({"Success":"Car added succesfully"});
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
            const category = task.category;
            const carNo = task.carNo; 
            const seats = task.seats -1; 
            const model = task.model;
            return {category, carNo, seats, model};
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
        const {user_id, car_no } = req.body;     
        
       await deleteCar(user_id, car_no);
        return res.status(200).send("Success");
    } catch (error) {
        next(error);
    }
}

export const editCar = async (car_id, user_Id, category, model, seat, brand) => {
    try {
        const {user_id, car_no, category, model, seat, brand } = req.body;     
        
       await updateCar(user_id, car_no, category, model, seat, brand);
        return res.status(200).send("Success");
    } catch (error) {
        next(error);
    }
}