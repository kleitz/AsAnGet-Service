
import model from './model';


export const addlastlocation = async(data)=>{

    try{
        const userdata = await model.findOne({"userId":data.userId});
        if(userdata){
            userdata.locations.push(data.loc);
            if(userdata.locations.length > 5)
            {
                userdata.locations.shift();
                userdata.save();    
            }
            else{
                userdata.save();
            }
        }
        else{
            const obj = await new model(data); 
            await obj.save();    
        }

    }

catch (error) {
        return Promise.reject(error);
    }

}


export const getalllocation = async(userId)=>{

    try{
        const userdata = await model.findOne({"userId":userId});
        const loc = userdata.locations;
        return loc;

    }

catch (error) {
        return Promise.reject(error);
    }

}