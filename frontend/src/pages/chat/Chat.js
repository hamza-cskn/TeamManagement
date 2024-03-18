import React, {useEffect, useState} from 'react';
import {HubConnectionBuilder} from "@microsoft/signalr";
import {ChatBubble} from "./ChatsPage";
import {FooterComponent, NavbarComponent} from "../../common/Layout";
import "../../App.css";
import {shortString} from "../issue/IssuePage";

let isConnectionCreated = false;

async function createHubConnection(setHubConnection, setError) {
    if (isConnectionCreated)
        return;
    isConnectionCreated = true;
    const hubCn = new HubConnectionBuilder().withUrl("http://localhost:5229/chathub").build()
    hubCn.start()
        .then(() => {
            console.log("connid:", hubCn.connectionId);
            setHubConnection(hubCn);
        })
        .catch((e) => {
            console.error(e);
            setError(e.message);
        });
}

function sendMsg(hubConnection, text) {
    if (!hubConnection)
        return;
    hubConnection.invoke("SendMessage", text).then((res) => {
    })
}

export function Chat() {
    const [text, setText] = useState("");
    const [msgList, setMsgList] = useState([]);
    const [hubConnection, setHubConnection] = useState(undefined);
    const [error, setError] = useState(undefined);
    useEffect(() => {
        createHubConnection(setHubConnection, setError);
    }, []);

    useEffect(() => {
        if (hubConnection) {
            hubConnection.on("ReceiveMessage", (msg) => {
                setMsgList((prevState) => {
                    return prevState.concat(msg)
                })
                const chatBox = document.getElementById("chat-box");
                console.log("chatBox", chatBox);
                setTimeout(() => {
                    chatBox.scrollTo(0, chatBox.scrollHeight);
                }, 10);
            })

        }
    }, [hubConnection])
    if (error)
        return <div className="text-center">An error occurred: {error}</div>
    if (!hubConnection)
        return <div className="text-center">Connecting...</div>
    const user = {name: {name: "Hamza", surname: "COŞKUN"}};
    return (
        <div>
            <NavbarComponent currentPage={"Chat"}/>
            <div className="pb-8">
                <div className="flex">
                    <ChatList/>
                    <ChatBox msgList={msgList} user={user}/>
                </div>
                <div className="w-full text-center bottom-0 bg-none">
                    <InputBox text={text} setText={setText} hubConnection={hubConnection}/>
                    <SendButton text={text} setText={setText} hubConnection={hubConnection}/>
                </div>
            </div>
            <FooterComponent/>
        </div>
    );
}

function ChatList() {
    const chatList = [
        {name: "Hamza COŞKUN", messages: "Hello, how are you?"},
        {name: "Ahmet KESKİN", messages: "did you broke the system again?"},
        {name: "Çağatay EREM", messages: "what did you do this time?"},
    ];
    return (<div id="chat-list" style={{height: "75vh"}}
                 className="w-1/4 pb-4 mb-16 hidden-scrollbar
             bg-white">
            <h2 className="font-bold text-xl text-gray-600 text-center py-5">Chats</h2>
            <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-700">
                    {chatList.map((item, index) => {
                        return <li className="py-2.5 hover:bg-gray-100 hover:cursor-pointer px-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 mx-auto sm:mx-0">
                                    <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile.png"
                                         alt="Thomas image"/>
                                </div>
                                <div className="sm:block hidden flex-1 min-w-0 ms-4">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        {item.name}
                                    </p>
                                    <div
                                        className="inline-flex truncate items-center text-sm font-normal text-gray-700 dark:text-white">
                                        {shortString(item.messages, 30)}
                                    </div>
                                </div>
                            </div>
                        </li>
                    })}
                </ul>
            </div>

        </div>
    )
}

function ChatBox({
                     msgList, user
                 }) {
    return (<div id="chat-box" style={{height: "75vh"}}
                 className="w-3/4 pb-4 mb-16 hidden-scrollbar
             bg-white border-l border-gray-100">
        <h2 className="font-medium text-xl text-gray-400 text-center py-5">Start of the messages</h2>
        <ul>
            {msgList.map((item, index) => {
                return (
                    <li key={index} className="px-5 py-2">
                        <ChatBubble user={user} message={item}/>
                    </li>
                )
            })}
        </ul>
    </div>)
}

function InputBox({
                      text, setText, hubConnection
                  }) {
    return (
        <input className="w-1/2 min-w-[260px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5
        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white outline-0" autoFocus={true}
               value={text}
               placeholder="write a message"
               onChange={(e) => {
                   setText(e.target.value)
               }}
               onKeyDown={(e) => {
                   if (e.key === "Enter" && text.trim() !== "") {
                       sendMsg(hubConnection, text);
                       setText("");
                   }
               }}
        />
    )
}

function SendButton({
                        text, setText, hubConnection
                    }) {
    return (
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300
    font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700
    focus:outline-none dark:focus:ring-blue-800 m-2"
                onClick={
                    () => {
                        if (text.trim() !== "") {
                            sendMsg(hubConnection, text);
                            setText("");
                        }
                    }
                }>
            Send
        </button>
    )
}