import React from "react";
import styled from "styled-components";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRecipient } from "../hooks/useRecipient";
import { Conversation, IMessage } from "../types";
import {
  convertFirestoreTimestampToString,
  generateQueryGetMessage,
  transformMessage,
} from "../utils/getMessageInConversation";
import RecipientAvatar from "./RecipientAvatar";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const StyledRecipientHeader = styled.div`
  position: sticky;
  background-color: #ffffff;
  z-index: 100;
  top: 0;
  display: flex;
  align-items: center;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;
const StyleHeaderInfo = styled.div`
  flex-grow: 1;
  > h3 {
    margin-top: 0;
    margin-bottom: 3px;
  }
  > span {
    font-size: 14px;
    color: gray;
  }
`;
const StyledH3 = styled.h3`
  word-break: break-all;
`;
const StyledHeaderIcon = styled.div`
  display: flex;
`;

const StyledMessageContainer = styled.div`
  padding: 30px;
  background-color: #ffffff;
  min-height: 90vh;
`;
const StyledInputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
  border-top: 1px solid gray;
`;
const StyledInput = styled.input`
  flex-grow: 1;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 15px;
  margin-left: 15px;
  margin-right: 15px;
`;
const EndOfMessageForAutoScrool = styled.div`
  margin-bottom: 30px;
`;

const ConversationScreen = ({
  conversation,
  messages,
}: {
  conversation: Conversation;
  messages: IMessage[];
}) => {
  const [newMessage, setNewMessage] = React.useState("");
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const conversationUsers = conversation.users;
  const { recipientEmail, recipient } = useRecipient(conversationUsers);
  const router = useRouter();
  const conversationId = router.query.id; ///localhost:3000/conversation/:id
  //   console.log("conversationId", conversationId);

  const queryGetMessages = generateQueryGetMessage(conversationId as string);
  const [messagesSnapshot, messagesLoading, __error] =
    useCollection(queryGetMessages);
  //if frontend is loading messages
  const showMessages = () => {
    //if Frontend Loading
    if (messagesLoading) {
      return messages.map((message) => (
        <Message key={message.id} message={message} />
        // <p key={index}>{JSON.stringify(message)}</p>
      ));
    }
    //if Frontend Loading Success,so now we have messageSnapshot
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message key={message.id} message={transformMessage(message)}></Message>
        // <p key={index}>{JSON.stringify(transformMessage(message))}</p>
      ));
    }
    return null;
  };
  const addMessageToDbAndUpdateLastSeen = async () => {
    //update lassseen
    await setDoc(
      doc(db, "users", loggedInUser?.email as string),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    ); // chỉ update những gì đã thay đổi

    //add new message to "mesages" colection
    await addDoc(collection(db, "messages"), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: newMessage,
      user: loggedInUser?.email,
    });
    //reset inpiut field
    setNewMessage("");
    //scroll to bottom
    scroolToBottom();
  };
  const sendMessageOnEnter: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!newMessage) return;
      addMessageToDbAndUpdateLastSeen();
    }
  };
  const sendMessageOnClick: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    if (!newMessage) return;
    addMessageToDbAndUpdateLastSeen();
  };
  const endOfMessageRef = React.useRef<HTMLDivElement>(null);
  const scroolToBottom = () => {
    endOfMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <StyledRecipientHeader>
        <RecipientAvatar
          recipient={recipient}
          recipientEmail={recipientEmail}
        />
        <StyleHeaderInfo>
          <StyledH3>{recipientEmail}</StyledH3>
          {recipient && (
            <span>
              Last active :{" "}
              {convertFirestoreTimestampToString(recipient.lastSeen)}
            </span>
          )}
        </StyleHeaderInfo>
        <StyledHeaderIcon>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </StyledHeaderIcon>
      </StyledRecipientHeader>
      <StyledMessageContainer>
        {showMessages()}
        {/* auto scroll to the end message */}
        <EndOfMessageForAutoScrool ref={endOfMessageRef} />
      </StyledMessageContainer>
      {/* Enter new message */}
      <StyledInputContainer>
        <InsertEmoticonIcon />
        <StyledInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={sendMessageOnEnter}
        />
        <IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
          <SendIcon sx={{ color: "#325aff" }} />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  );
};

export default ConversationScreen;
