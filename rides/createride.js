import model from './model';

export const createRide = async (req, res, next) => {
    
    const name = req.body.username;
    const startloc = req.body.from;
    const endloc = req.body.to;
    const seat = req.body.seat;



        try {
            const newRide = new model({
                username: name,
                from : startloc,
                to : endloc,
                seats_avail: seat

              });
              await newRide.save();
    
    return res.status(200).send(name);

     
    } 
    catch (error) {
        next(error)
    }
}