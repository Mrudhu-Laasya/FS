import { useState } from "react";
import createAccount from "../api/userApi";
import { loginUser } from "../api/authApi";
import useEdit from "../context/useEdit";

export default function LoginForm({ onUpdate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const { setIsEditValid } = useEdit();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      console.log(data.message);
      setIsEditValid(true);
      onUpdate();
    } catch (error) {
    alert("Username or password invalid");
      console.error(error.message);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const data = await createAccount(signupUsername, signupPassword);

      console.log(data.message);

      // Switch back to login
      setIsSignup(false);
    } catch (error) {
alert(error.message);
      console.error(error.message);
    }
  };

  return (
    <div className="login-page">
      {isSignup ? (
        <div className="login-card">
          <div className="login-header">
            <h2>CREATE ACCOUNT</h2>
            <p>Create an account to edit and update your resume</p>
          </div>
          <form className="login-form" onSubmit={handleSignUp}>
            <div className="form-field">
              <label htmlFor="signup-username">Username</label>
              <input
                type="text"
                id="signup-username"
                name="username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="signup-password">Password</label>
              <input
                type="password"
                id="signup-password"
                name="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Create account
            </button>
          </form>
          <div className="login-footer">
            <span>Already have an account?</span>
            <button
              type="button"
              className="signup-button"
              onClick={() => setIsSignup(false)}
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="login-card">
          <div className="login-header">
            <h2>SIGN IN</h2>
            <p>Sign in to edit and update your resume</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
          <div className="login-footer">
            <span>Don't have an account?</span>
            <button
              type="button"
              className="signup-button"
              onClick={() => setIsSignup(true)}
            >
              Create account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
