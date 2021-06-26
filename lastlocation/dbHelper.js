
import model from './model';


export const addlastlocation = async(data)=>{

    try{
        
        const userdata = await model.findOne({"userId":data.userId});
        
        if(userdata){
            userdata.locations.push(data.loc);
            userdata.save();
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


