const express=require('express');
const router=express.Router();
const con=require('./../db'); 
router.post('/create', async(req , res)=>{
    try{
        const {title, event_datetime, location, capacity}=req.body;
        if(!capacity || capacity <=0 || capacity >1000){
            return res.status(400).json({error: "Capacity must be less than 1000"});
        }
        const result= await con.query(
            `INSERT INTO events (title, event_datetime, location, capacity) VALUES ($1, $2, $3, $4) RETURNING id`,
            [title, event_datetime, location, capacity],
        );
        res.status(200).json({ eventId:result.rows[0].id});
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: "Internal Server Error"});
    }
});
router.get('/upcoming', async(req, res)=>{
    try{
        const upcoming= await con.query(
            `SELECT * FROM events
            WHERE event_datetime > NOW()
            ORDER BY event_datetime ASC, location ASC`,
        );
        res.status(200).json({upcoming:upcoming.rows});
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: 'Internal Server Error'});
    }
});
router.get('/:id', async(req , res)=>{
    try{    
        const eventId= req.params.id;
        const eventRes= await con.query(
            `SELECT * FROM events WHERE id=$1`,
            [eventId],
        );
        if(eventRes.rows.length===0) return res.status(400).json({err: "Event Not Found"});
        const event=eventRes.rows[0];
        const userRes= await con.query(
            `SELECT u.id, u.name, u.email
             FROM event_registrations er
             JOIN users u ON er.user_id=u.id
             WHERE er.event_id=$1`,
             [eventId],
        );
        res.status(200).json({...event, registrations: userRes.rows});
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: "Internal Server Error"});
    }
});

router.post('/:id/register', async (req, res) => {
    try {
        const { id: eventId } = req.params;   
        const { userId } = req.body;   
        if (userId === undefined || userId === null || userId === "") {
    return res.status(400).json({ err: "User ID is required" });
}

        const eventRes = await con.query(
            `SELECT * FROM events WHERE id=$1`,
            [eventId]
        );
        if (eventRes.rows.length === 0) 
            return res.status(404).json({ err: "Event Not Found" });

        const event = eventRes.rows[0];

        if (new Date(event.event_datetime) < new Date()) 
            return res.status(400).json({ err: "Can't register for past events" });

       
        const alreadyRegistered = await con.query(
            `SELECT * FROM event_registrations WHERE event_id=$1 AND user_id=$2`,
            [eventId, userId]
        );
        if (alreadyRegistered.rows.length > 0) 
            return res.status(400).json({ err: "User already registered" });

       
        const capacityCheck = await con.query(
            `SELECT COUNT(*) FROM event_registrations WHERE event_id=$1`,
            [eventId]
        );
        const regCount = parseInt(capacityCheck.rows[0].count);
        if (regCount >= event.capacity) 
            return res.status(400).json({ err: "Event is full, you cannot register" });

        await con.query(
            `INSERT INTO event_registrations (user_id, event_id) VALUES ($1, $2)`,
            [userId, eventId]
        );

        res.status(200).json({ 
            message: "User registered successfully", 
            eventId, 
            userId 
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Internal Server Error" });
    }
});

router.delete('/:id/register', async(req, res)=>{
    try{
        const eventId=req.params.id;
        const {userId}=req.body;

        const delevent= await con.query(
            `DELETE FROM event_registrations WHERE user_id=$1 AND event_id=$2 RETURNING id`,
            [userId, eventId],
        );
        if(delevent.rows.length===0) return res.status(400).json({err: "User Does not exists for this event"});
        res.status(200).json({message: "Registration Cancelled"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({err: "Internal Server Error"});
    }
});

router.get('/:id/stats', async(req, res)=>{
    try{
        const {id:eventId}= req.params;
        const eventRes= await con.query(
            `SELECT capacity FROM events WHERE id=$1`,
            [eventId],
        );
        if(eventRes.rows.length===0) return res.status(400).json({err: "Event Not Found"});
        const capacity=eventRes.rows[0].capacity;
        const countRes= await con.query(
            `SELECT COUNT(*) FROM event_registrations WHERE event_id=$1`,
            [eventId],
        );
        const totalRegistrations= parseInt(countRes.rows[0].count);
        const remainingCapacity=capacity-totalRegistrations;
        const percentUsed=Math.round((totalRegistrations/capacity)*100);

        res.status(200).json({totalRegistrations, remainingCapacity, percentUsed});
    }
    catch(err){
        console.log(err);
        res.status(500).json({err : "Internal Server Error"});
    }
});
module.exports=router;