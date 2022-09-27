import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../config/firebase";
import { IMessage } from "../types";

const StyledMessage = styled.p`
  width: fit-content;
  word-break: break-all;
  max-width: 50%;
  min-width: 30%;
  padding: 15px 10px 15px 10px;
  color: #ffffff;
  border-radius: 8px;
  margin: 30px;
  position: relative;
  font-size: 15px;
`;
const StyledSendMessage = styled(StyledMessage)`
  margin-left: auto; //đẩy sang hết bên tay phải
  background-color: #325aff;
`;
const StyleReceiverMessage = styled(StyledMessage)`
  background-color: #f1f1f1;
  color: black;
`;
const StyledTimestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: small;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
  color: black;
  padding: 25px 15px 5px 15px;
  margin-top: 10px;
  font-style: italic;
`;

const Message = ({ message }: { message: IMessage }) => {
  const [loggedInuser, _loading, _error] = useAuthState(auth);
  const MessageType =
    loggedInuser?.email === message.user
      ? StyledSendMessage
      : StyleReceiverMessage;
  return (
    <MessageType>
      {message.text}
      <StyledTimestamp>{message.sent_at}</StyledTimestamp>
    </MessageType>
  );
};

export default Message;
