import React, {useEffect, useRef, useState} from 'react';
import {HubConnectionBuilder} from "@microsoft/signalr";
import {ChatBubble} from "./ChatsPage";
import "../../App.css";
import {shortString} from "../issue/IssuePage";
import {ErrorComponent, LoadingComponent} from "../../auth/FetchStates";
import {authorizedFetch, getToken, getUserId} from "../../auth/AuthHandler";

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

function loadMoreMessages(setMsgList, currentChatId, count) {
    console.log("currentChatId", currentChatId);
    authorizedFetch(`http://localhost:5229/chat/${currentChatId}/messages?count=${count}`)
        .then(async res => {
            if (!res.ok) {
                console.error("Could not fetch messages");
                return;
            }
            const data = await res.json();
            setMsgList((prevState) => data.messages.concat(prevState));
        });
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

function sendMsg(hubConnection, currentChatId, text) {
    hubConnection?.invoke("SendMessage", getToken(), currentChatId, text);
}

function listenScrollTop(setMsgList, currentChatId, divRef) { //make them global
    const divElement = divRef.current;
    const handleScroll = () => {
        if (divElement.scrollTop === 0) {
            loadMoreMessages(setMsgList, currentChatId, 10);
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
    const [currentChatId, setCurrentChatId] = useState(undefined); //TODO: get from local storage

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
                    <ChatList setMsgList={setMsgList} currentChatId={currentChatId} setCurrentChatId={setCurrentChatId}/>
                    <ChatBox msgList={msgList} currentChatId={currentChatId} user={user}/>
                </div>
                <div className="w-full text-center">
                    <InputBox text={text} setText={setText} hubConnection={hubConnection} currentChatId={currentChatId}/>
                    <SendButton text={text} setText={setText} hubConnection={hubConnection} currentChatId={currentChatId}/>
                </div>
            </div>
    );
}

function ChatListArea({setMsgList, currentChatId, setCurrentChatId}) {
    const [chatList, setChatList] = useState(undefined);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        const userId = getUserId();
        if (userId == null || userId == "undefined") {
            setError("You are not logged in");
            return;
        }

        authorizedFetch(`http://localhost:5229/chat?userId=${userId}`)
            .then(async res => {
                if (!res.ok) {
                    setError("Chat list could not be fetched");
                    return;
                }
                const data = await res.json();
                let list = [];
                data.chatRooms.forEach(room => {
                    list.push({id: room.id, name: room.name, messages: "..."});
                });
                setChatList(list);
            });
    }, []);

    if (error)
        return <div className="text-sm text-red-700 text-center font-medium m-2">{error}</div>;

    if (chatList == null)
        return <h2 className="font-bold text-sm sm:text-lg text-gray-600 text-center py-5">Loading...</h2>

    if (chatList.length === 0)
        return <div className="py-5">
            <h2 className="font-medium text-md text-gray-500 text-center">No chat found</h2>
            <p className="font-medium italic text-sm text-gray-400 text-center py-2">"You look lonely but I can't fix that."</p>
        </div>

    return <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-700">
            {chatList.map((item, index) => {
                return <div key={index}>
                    <ChatListNode item={item} setMsgList={setMsgList} currentChatId={currentChatId}
                                  setCurrentChatId={setCurrentChatId}/>
                </div>
            })}
        </ul>

}

function ChatList({setMsgList, currentChatId, setCurrentChatId})
{
    return <div id="chat-list" style={{height: "65vh"}}
                className="w-16 sm:w-1/4 border-b border-gray-100 hidden-scrollbar bg-white">
        <h2 className="font-bold text-sm sm:text-lg text-gray-600 text-center py-5">Chats</h2>
        <div className="flow-root overflow-x-hidden">
            <ChatListArea setMsgList={setMsgList} currentChatId={currentChatId} setCurrentChatId={setCurrentChatId}/>
        </div>
    </div>
}

function ChatListNode({item, setMsgList, currentChatId, setCurrentChatId}) {
    return <li
        onClick={() => {
            console.log("itemid: ", item.id);
            setCurrentChatId(item.id);
            setMsgList([]);
            loadMoreMessages(setMsgList, item.id, 10);
        }}
        className={`py-2.5 hover:bg-purple-50 hover:cursor-pointer px-5 ` + (currentChatId === item.id ? "bg-purple-100" : "")}>
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

function ChatBox({msgList, setMsgList, currentChatId, user}) {
    const divRef = useRef(null);
    useEffect(() => listenScrollTop(setMsgList, currentChatId, divRef), [setMsgList, currentChatId]);

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

function InputBox({text, setText, hubConnection, currentChatId}) {
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
                          sendMsg(hubConnection, currentChatId, text);
                          setText("");
                      }
                  }}
        />)
}

function SendButton({text, setText, hubConnection, currentChatId}) {
    return (
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300
    font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700
    focus:outline-none dark:focus:ring-blue-800 m-2"
                onClick={() => {
                        if (text.trim() !== "") {
                            sendMsg(hubConnection, currentChatId, text);
                            setText("");
                        }}}>
            Send
        </button>
    )
}