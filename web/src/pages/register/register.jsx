import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../../services/api-service";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
  <div className="container mt-5">
    <h1>Register</h1>
    <form onSubmit={handleRegister}>
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          className="form-control"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          className="form-control"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          className="form-control"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>
        {error && <div className="alert alert-danger">{error}
      </div>}  {/* Show the error message */}
      <button className="btn btn-success" type="submit">
        Register
      </button>
      <button
        className="btn btn-link"
        onClick={() => navigate("/login")}
      >
        Back to Login
      </button>
    </form>
  </div>
  );
}
