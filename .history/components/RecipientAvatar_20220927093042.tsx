import { useRecipient } from "../hooks/useRecipient";
import Avatar from "@mui/material/Avatar";
import styled from "styled-components";

type Props = ReturnType<typeof useRecipient>;

const StyleAvatar = styled(Avatar)``;
const RecipientAvatar = ({ recipient, recipientEmail }: Props) => {
  return recipient?.photoURL ? (
    <StyleAvatar src={recipient.photoURL} />
  ) : (
    <StyleAvatar>
      {recipientEmail && recipientEmail[0].toUpperCase()}
    </StyleAvatar>
  );
};

export default RecipientAvatar;
