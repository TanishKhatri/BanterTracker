import { Box, IconButton } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import MessageIcon from '@mui/icons-material/Message';

const OptionsBar = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      background: 'gray'
    }}>
      <IconButton>
        <MessageIcon />
      </IconButton>
      <IconButton>
        <PeopleIcon />
      </IconButton>
      <IconButton>
        <SettingsIcon />
      </IconButton>
    </Box>
  )
}

export default OptionsBar;