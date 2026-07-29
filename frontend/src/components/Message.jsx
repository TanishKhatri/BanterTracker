import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useAuth } from "./AuthContext";

const Message = ({ messageObj }) => {
  const { user } = useAuth()

  const displayTime = () => {
    const date = new Date(messageObj.createdAt);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  const alignment = () => {
    if (messageObj.sender.id === user.id) {
      return 'flex-end';
    } else {
      return 'flex-start';
    }
  };

  return (
    <Card sx={{ alignSelf: alignment(), flexShrink: 0 }}>
        <CardContent sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Typography variant="h6">{messageObj.sender.name}</Typography>
          <Typography variant="body1">{messageObj.content}</Typography>
          <Typography variant="caption" sx={{ mt: 'auto', alignSelf: 'flex-end' }}>{displayTime()}</Typography>
        </CardContent>
    </Card>
  )
}

export default Message;