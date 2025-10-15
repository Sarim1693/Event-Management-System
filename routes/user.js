const express=require('express');
const router=express.Router();
const con=require('./../db');

router.post('/signup', async(req , res)=>{
    try{
        const {name, email}=req.body;
        if(!name || !email){
            return res.status(400).json({err: "Please Provide all credentials"});
        }

        const result=await con.query(
            `INSERT INTO users (name, email) VALUES($1, $2)`,
            [name, email],
        );
        res.status(200).json("User Added Successfully");
    }
    catch(err){
        console.log(err);
        res.status(500).json({err:"Internal Server Error"});
    }
});

router.get('/getAllUsers', async(req, res)=>{
    try{
        const result=await con.query(
            `SELECT id, name, email FROM users`
        );
        res.status(200).json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: "Internal Server Error"});
    }
});

module.exports=router;