import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await login({ email, password });
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    } catch (authError) {
      setError(authError?.response?.data?.msg || authError.message || "Login failed");
    }
  };

  return (
    <section className="login-page">
      <form className="login-shell login-form" onSubmit={handleLogin}>
        <h1 className="auth-title">Login</h1>
        {error && <p className="auth-error">{error}</p>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">LOGIN</button>
        <p className="auth-alt-action">
          New here? <Link to="/register">CREATE ACCOUNT</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;