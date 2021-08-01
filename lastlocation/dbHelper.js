
import model from './model';


export const addlastlocation = async(data)=>{

    try{
        const userdata = await model.findOne({"userId":data.userId});
        
        if(userdata){
            for(var i=0; i<userdata.locations.length; i++){
                if(userdata.locations[i].loc == data.loc){
                    return;
                }
               }
            const newdata = {"loc":data.loc, "latlog":data.latlog};
            userdata.locations.push(newdata);
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
        if(userdata)
        {
        const loc = userdata.locations;
        return loc;
        }
        else {
         
            return ;
        }

    }

catch (error) {
        return Promise.reject(error);
    }

}