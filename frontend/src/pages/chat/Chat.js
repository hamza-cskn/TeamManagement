import React, {useEffect, useRef, useState} from 'react';
import {HubConnectionBuilder} from "@microsoft/signalr";
import {ChatBubble} from "./ChatsPage";
import "../../App.css";
import {shortString} from "../issue/IssuePage";
import {ErrorComponent, LoadingComponent} from "../../auth/FetchStates";
import {getToken} from "../../auth/AuthHandler";

let isConnectionCreated = false;

async function connectHubAsync(setHubConnection, setError) {
    if (isConnectionCreated)
        return;
    isConnectionCreated = true;
    const hubCn = new HubConnectionBuilder().withUrl("http://localhost:5229/chathub").build()
    hubCn.start()
        .then(() => setHubConnection(hubCn))
        .catch((e) => {
            console.error(e);
            setError(e.message);
        });
}

function loadMoreMessages(setMsgList, count) {
    setMsgList([]); //TODO: get from server
}

function listenHub(hubConnection, setMsgList) {
    if (hubConnection) {
        hubConnection.on("ReceiveMessage", (msg) => {
            setMsgList((prevState) => prevState.concat(msg))
            const chatBox = document.getElementById("chat-box");
            setTimeout(() => {
                chatBox.scrollTo(0, chatBox.scrollHeight);
            }, 10);
        });
        hubConnection.invoke("ClientReady");
        hubConnection.on("MessageError", (msg) => {
           console.error(msg); //TODO: show error message
        });
    }

}

function sendMsg(hubConnection, text) {
    hubConnection?.invoke("SendMessage", getToken(), "1", text);
}

function listenScrollTop(setMsgList, divRef) {
    const divElement = divRef.current;
    const handleScroll = () => {
        if (divElement.scrollTop === 0) {
            loadMoreMessages(setMsgList, 10);
        }
    };
    divElement.addEventListener('scroll', handleScroll);
    return () => divElement.removeEventListener('scroll', handleScroll);
}

export function Chat() {
    const [text, setText] = useState("");
    const [msgList, setMsgList] = useState([]);
    const [hubConnection, setHubConnection] = useState(undefined);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        connectHubAsync(setHubConnection, setError);
    }, [setHubConnection, setError]);
    useEffect(() => listenHub(hubConnection, setMsgList), [hubConnection, setMsgList])

    if (error)
        return <ErrorComponent message={"Could not connected to the server."} error={error}/>
    if (!hubConnection)
        return <LoadingComponent message={"Connecting..."}/>
    const user = {name: {name: "Hamza", surname: "COŞKUN"}};
    return (
            <div>
                <div className="flex">
                    <ChatList setMsgList={setMsgList} />
                    <ChatBox msgList={msgList} user={user}/>
                </div>
                <div className="w-full text-center">
                    <InputBox text={text} setText={setText} hubConnection={hubConnection}/>
                    <SendButton text={text} setText={setText} hubConnection={hubConnection}/>
                </div>
            </div>
    );
}

function ChatList({setMsgList}) {
    const [currentChat, setCurrentChat] = useState("1"); //TODO: get from local storage
    const chatList = [
        {id: "1", name: "Hamza COŞKUN", messages: "Hello, how are you?"},
        {id: "2", name: "Çağatay EREM", messages: "test"},
        {id: "3", name: "Aziz AYDIN", messages: "i need my tea. i will not work until we have tea in the office."},
        {id: "4", name: "Enes YAPMAZ", messages: "i checked fast api. it is not related with it."},
        {id: "5", name: "Ahmet KESKIN", messages: "❤️"},
        {id: "6", name: "Sefa AKDAŞ", messages: "we have to fix the issue immediately. but let me finish my tea first."},
        {id: "7", name: "Test0", messages: "test"},
        {id: "8", name: "Test1", messages: "test"},
        {id: "9", name: "Test2", messages: "test"},
        {id: "10", name: "Test3", messages: "test"},
        {id: "11", name: "Test4", messages: "test"},
        {id: "12", name: "Test5", messages: "test"},
        {id: "13", name: "Test6", messages: "test"},
        {id: "14", name: "Test7", messages: "test"},
    ];

    return <div id="chat-list" style={{height: "65vh"}}
                 className="w-16 sm:w-1/4 border-b border-gray-100 hidden-scrollbar bg-white">
            <h2 className="font-bold text-sm sm:text-lg text-gray-600 text-center py-5">Chats</h2>
            <div className="flow-root overflow-x-hidden">
                <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-700">
                    {chatList.map((item, index) => {
                        return <ChatListNode item={item} setMsgList={setMsgList} currentChat={currentChat} setCurrentChat={setCurrentChat}/>
                    })}
                </ul>
            </div>
        </div>
}

function ChatListNode({item, setMsgList, currentChat, setCurrentChat}) {
    return <li
        onClick={() => {
            setCurrentChat(item.id);
            loadMoreMessages(setMsgList, 10);
        }}
        className={`py-2.5 hover:bg-purple-50 hover:cursor-pointer px-5 ` + (currentChat === item.id ? "bg-purple-100" : "")}>
        <div className="flex items-center">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
                <img className="w-5 h-5 sm:w-8 sm:h-8 rounded-full" src="/docs/images/people/profile.png" alt="Thomas image"/>
            </div>
            <div className="sm:block hidden flex-1 min-w-0 ms-4">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {item.name}
                </p>
                <div className="inline-flex truncate items-center text-sm font-normal text-gray-700 dark:text-white">
                    {shortString(item.messages, 30)}
                </div>
            </div>
        </div>
    </li>
}

function ChatBox({msgList, setMsgList, user}) {
    const divRef = useRef(null);
    useEffect(() => listenScrollTop(setMsgList, divRef), [setMsgList]);

    return (<div ref={divRef} id="chat-box" style={{height: "65vh"}}
                 className="w-full pb-4 mb-16 hidden-scrollbar
             bg-gray-100 border-b border-l border-gray-100">

        <h2 className="font-medium text-xl text-gray-400 text-center my-5">Loading...</h2>
        <h2 className="font-medium text-xl text-gray-400 text-center my-5">Start of the messages</h2>

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

function InputBox({text, setText, hubConnection}) {
    return (
        <textarea className="w-1/2 max-w-[760px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5
        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0
        focus:border-gray-300 resize-none" autoFocus={true}
                  value={text}
                  placeholder="write a message"
                  onChange={(e) => {
                      setText(e.target.value)
                  }}
                  onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && text.trim() !== "") {
                          e.preventDefault();
                          sendMsg(hubConnection, text);
                          setText("");
                      }
                  }}
        />)
}

function SendButton({text, setText, hubConnection}) {
    return (
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300
    font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700
    focus:outline-none dark:focus:ring-blue-800 m-2"
                onClick={() => {
                        if (text.trim() !== "") {
                            sendMsg(hubConnection, text);
                            setText("");
                        }}}>
            Send
        </button>
    )
}