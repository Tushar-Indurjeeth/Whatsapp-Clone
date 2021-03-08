import { Avatar, IconButton } from '@material-ui/core';
import React, { useState } from 'react';
import './Chat.css';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import axios from './axios.js';

export default function Chat({ messages }) {

    const [input, setInput] = useState("");

    const sendMessage = async (e) => { // the e is for event
        e.preventDefault(); // Prevent refersh when button is clicked

        await axios.post('/messages/new', {
            message: input,
            name: "DEMO APP",
            timestamp: "Just now",
            received: true,
        });
        setInput('');
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar />

                <div className="chat__headerInfo">
                    <h3>Room Info</h3>
                    <p>Last seen at...</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlinedIcon />
                    </IconButton>

                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </div>
            </div>

            <div className="chat__body">
                {messages.map(message => (

                    <p className={`chat__message ${message.received && "chat__receiver"}`}>
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">{message.timestamp}</span>
                    </p>
                ))}
            </div>

            <div className="chat__footer">
                <InsertEmoticonIcon />

                <form>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a message"
                        type="text"
                    />
                    <button
                        onClick={sendMessage}
                        type="Submit">
                        Send a message
                        </button>

                </form>
                <MicIcon />

            </div>
        </div >
    )
}
