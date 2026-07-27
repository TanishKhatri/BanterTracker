import { BrowserRouter } from 'react-router';
import { AuthProvider } from './components/AuthContext.jsx';
import ThemeProvider from './theme/ThemeProvider.jsx';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
