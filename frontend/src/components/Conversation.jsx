import { useAuth } from './AuthContext';
import { Card, CardContent, CardActionArea, ListItem, Typography, ListItemAvatar } from '@mui/material';

const Conversation = ({ convoObj }) => {
  const { user } = useAuth();
  const { title, participants, lastMessage } = convoObj;
  const convoUsername = () => {
    return participants.find((u) => u.id !== user.id).name;
  };

  const generateTimePassed = () => {
    if (!lastMessage) {
      return null;
    }

    const date = new Date(lastMessage.createdAt);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }); // e.g. "14:45"
    }

    // Today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }); // e.g. "14:45"
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // Older
    return date.toLocaleDateString('en-GB');
    // e.g. "28/07/2026"
  };
  const generateTitle = () => (title ? title : convoUsername());
  return (
    <Card>
      <CardActionArea sx={{
        '&[data-active]': {
          backgroundColor: 'action.selected',
          '&:hover': {
            backgroundColor: 'action.selectedHover',
          },
        },
      }}>
        <CardContent sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gridTemplateRows: 'auto auto',
          width: '100%',
          padding: 2,
          columnGap: 2,
        }}>
          <Typography variant="h6">{generateTitle()}</Typography>

          <Typography variant='caption'>{generateTimePassed()}</Typography>

          {lastMessage && (
            <Typography variant="body2" color="text.secondary" sx={{ gridColumn: '1 / 2' }}>
              {lastMessage.content}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Conversation;
