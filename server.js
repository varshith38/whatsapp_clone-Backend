import express from 'express';
import mongoose from 'mongoose';
import router from './Routes/Route.js';
import Pusher from 'pusher';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000

const pusher = new Pusher({
    appId: "1208464",
    key: "71a6b20e4c83f2bc844c",
    secret: "a6255337edff522a17fe",
    cluster: "us2",
    useTLS: true
  });

app.use(express.json())
app.use(cors())

const db_connection = 'mongodb+srv://admin:QOtz9B5WgvIuhi7b@cluster0.wbbi3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(db_connection , {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.once('open', () => {
    console.log('DB connected');

    const msgCollection = db.collection('messagecontents')
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log(change)
        if (change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',{
                user: messageDetails.name,
                message: messageDetails.message,
                time: messageDetails.time,
                received: messageDetails.received,
            })
        }else{
            console.log('Error triggering pusher');
        }
    })
})

app.use('/',router);



app.listen(port,() => console.log('Listening on port ' + port ))