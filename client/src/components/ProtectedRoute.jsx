import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const currencyOptions = ["CAD", "USD", "EUR", "GBP"];

export default function Register() {
  const { register: registerUser, loading } = useAuth();
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { currency: "CAD" }
  });
  const password = watch("password");

  const onSubmit = async ({ name, email, password, currency }) => {
    const res = await registerUser({ name, email, password, currency });
    if (res.ok) {
      
      nav("/dashboard");
    } else {
      alert(res.error || "Registration failed");
    }
  };

  return (
    <div className="card">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>Name</label>
        <input type="text" placeholder="Your name" {...register("name", { required: "Name is required" })}/>
        {errors.name && <p className="error">{errors.name.message}</p>}

        <label>Email</label>
        <input type="email" placeholder="you@example.com" {...register("email", { required: "Email is required" })}/>
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label>Password</label>
        <input type="password" placeholder="Min 6 characters" {...register("password", {
          required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" }
        })}/>
        {errors.password && <p className="error">{errors.password.message}</p>}

        <label>Confirm Password</label>
        <input type="password" placeholder="Repeat password" {...register("passwordConfirm", {
          required: "Please confirm your password",
          validate: (val) => val === password || "Passwords do not match"
        })}/>
        {errors.passwordConfirm && <p className="error">{errors.passwordConfirm.message}</p>}

        <label>Currency</label>
        <select {...register("currency", { required: "Currency is required" })}>
          {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.currency && <p className="error">{errors.currency.message}</p>}

        <button type="submit" disabled={loading}>{loading ? "Please wait..." : "Register"}</button>
      </form>

      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
