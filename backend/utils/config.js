import dotenv from 'dotenv';
// One location to access all enviroment variables

dotenv.config();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

export default { PORT, MONGODB_URI, JWT_SECRET };
