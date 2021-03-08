import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 8000;

const pusher = new Pusher({
    appId: "1167682",
    key: "7f262c9b9723829f0b4b",
    secret: "43da2f1641c33a8dbcd2",
    cluster: "mt1",
    useTLS: true
});

// middleware
app.use(express.json());

app.use(cors());

// DB config
const dbUrl = "mongodb+srv://admin:oyRywPnzDfbVySav@cluster0.aslpt.mongodb.net/whatsappDb?retryWrites=true&w=majority";

mongoose.connect(dbUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => {
    console.log('DATABASE CONNECTED');

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        // console.log("A CHANGE OCCURED", change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            });
        } else {
            console.log("Error trying to push");
        }
    });

});

// ?????

// API Endpoints

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
});

// Listen
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));