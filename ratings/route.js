import express from 'express';
import controller from'./controller';
const router=express.Router();


router.post('/add', async (req, res, next) => {  
    try {
        const result = await controller.add(req);
        console.log(result);
        return res.status(200).json({ data: "saved" });
    } catch (err) {
        return next(err);
    }
});
router.get('/get',async (req, res, next)=> {
    try {
        const results = await controller.get();
        return res.status(200).json({ data: results });
    } catch (err) {
        return next(err);
    }
});

 export default router;