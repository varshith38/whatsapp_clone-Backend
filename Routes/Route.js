import express from 'express';
import Messages from '../Model/dbMessages.js';

const router = express.Router();

router.post('/messages/new', (req,res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err){
            res.status(500).send(err)
        }else{
            res.send(data)
        }
    })
})

router.get('/messages/sync', (req, res) => {
    Messages.find((err,data) => {
        if (err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

export default router;