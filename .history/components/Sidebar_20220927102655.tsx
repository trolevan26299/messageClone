import { Avatar, IconButton, Button, Dialog } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import styled from "styled-components";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import * as EmailValidator from "email-validator";
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Conversation } from "../types";
import ConversationSelect from "./ConversationSelect";

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 1px solid whitesmoke;
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  font-size: 13px;
`;
const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  padding: 15px;
`;
const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 2px;
`;
const StyledSidebarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
`;
const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;
const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const Sidebar = () => {
  const [loggedInuser, _loading, _error] = useAuthState(auth);
  //handle dialog
  const [open, setOpen] = React.useState(false);
  const [recipientEmail, setRecipientEmail] = React.useState("");
  const toggleNewConversationDialog = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setRecipientEmail("");
  };
  const closeNewConverSationDialog = () => {
    toggleNewConversationDialog(false);
  };
  //Lấy ra tất cả Conversation
  const queryGetConversationsForCurrentUser = query(
    collection(db, "conversation"),
    where("users", "array-contains", loggedInuser?.email)
  );
  const [conversationsSnapshot, __loading, __error] = useCollection(
    queryGetConversationsForCurrentUser
  );
  //check xem đoạn hội thoại đã tồn tại chưa
  const isConversationAlreadyExists = (recipientEmail: string) => {
    return conversationsSnapshot?.docs.find((conversation) =>
      (conversation.data() as Conversation).users.includes(recipientEmail)
    );
  };
  //check có tự mời chính mình hay không
  const isInvitingSelf = recipientEmail === loggedInuser?.email;

  const createConversation = async () => {
    if (!recipientEmail) return;
    if (
      EmailValidator.validate(recipientEmail) &&
      !isInvitingSelf &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      //Add conversation user to db "conversations" collection
      // A conversation is between the currently logged in user and the user invited
      await addDoc(collection(db, "conversation"), {
        users: [loggedInuser?.email, recipientEmail],
      });
    }

    closeNewConverSationDialog();
  };
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("ERROR LOGOUT", error);
    }
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip title={loggedInuser?.email as string} placement="right">
          <StyledUserAvatar src={loggedInuser?.photoURL || ""} />
        </Tooltip>
        <div>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <IconButton onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </StyledHeader>
      <StyledSearch>
        <SearchIcon />
        <StyledSearchInput placeholder="Search in Conversations" />
      </StyledSearch>
      <StyledSidebarButton
        onClick={() => {
          toggleNewConversationDialog(true);
        }}
      >
        Start new conversation
      </StyledSidebarButton>
      {conversationsSnapshot?.docs.map((conversation) => (
        <ConversationSelect
          key={conversation.id}
          id={conversation.id}
          conversationUser={(conversation.data() as Conversation).users}
        />
      ))}
      <Dialog
        open={open}
        onClose={() => {
          closeNewConverSationDialog;
        }}
      >
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Plese enter a Google email address for the user you wish to chat
            with
          </DialogContentText>
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={(e) => {
              setRecipientEmail(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewConverSationDialog}>Cancel</Button>
          <Button disabled={!recipientEmail} onClick={createConversation}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      {/* List of conversation */}
    </StyledContainer>
  );
};

export default Sidebar;
