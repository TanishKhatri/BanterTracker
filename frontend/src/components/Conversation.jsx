import { useAuth } from "./AuthContext";

const Conversation = ({ convoObj }) => {
  const { user } = useAuth();
  const { title, participants, lastMessage } = convoObj;
  const convoUsername = () => {
    return participants.find((u) => u.id !== user.id).name;
  }
  return (
    <div>
      {title && <div>{title}</div>}
      {!title && convoUsername()}
      <div>{lastMessage.content}</div>
    </div>
  )
}

export default Conversation;