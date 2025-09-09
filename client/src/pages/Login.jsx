import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password }) => {
    const res = await login(email, password);
    if (res.ok) navigate(from, { replace: true });
    else alert(res.error || "Invalid email or password");
  };

  return (
    <div className="card">
      <h2>Welcome back</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>Email</label>
        <input type="email" placeholder="you@example.com" {...register("email", { required: "Email is required" })}/>
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label>Password</label>
        <input type="password" placeholder="Your password" {...register("password", { required: "Password is required" })}/>
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </form>

      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
