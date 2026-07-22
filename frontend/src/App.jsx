import LoginForm from "./components/LoginForm";
import services from "./services/services";

const App = () => {
  const handleLogin = async (credentials) => {
    try {
      const res = await services.login(credentials);
      services.setToken(res.token);
      console.log(`Token set: ${res.token}`);
    } catch {
      console.log('error occured');
    }
  }

  return (
    <div>
      <h1>Login Form</h1>
      <LoginForm handleLogin={handleLogin} />
    </div>
  );
};

export default App;
