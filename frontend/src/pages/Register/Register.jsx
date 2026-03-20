import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../Login/Login.css";

const Register = () => {
	const { register } = useAuth();
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const handleRegister = async (e) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			await register({ name, email, password });
			navigate("/", { replace: true });
		} catch (authError) {
			setError(authError?.response?.data?.msg || authError.message || "Registration failed");
		}
	};

	return (
		<section className="login-page">
			<form className="login-shell login-form" onSubmit={handleRegister}>
				<h1 className="auth-title">Register</h1>
				{error && <p className="auth-error">{error}</p>}

				<label htmlFor="name">Name</label>
				<input
					id="name"
					type="text"
					placeholder="Your name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>

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
					placeholder="Create password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					minLength={6}
				/>

				<label htmlFor="confirmPassword">Confirm Password</label>
				<input
					id="confirmPassword"
					type="password"
					placeholder="Confirm password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
					minLength={6}
				/>

				<button type="submit">REGISTER</button>
				<p className="auth-alt-action">
					Already have an account? <Link to="/login">Sign in</Link>
				</p>
			</form>
		</section>
	);
};

export default Register;
