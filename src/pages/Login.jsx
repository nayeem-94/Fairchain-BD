
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api/client";
import { FIELD, BTN } from "../components/ui/styles";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      await login(form.username.trim(), form.password);

      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(
        err.status === 400 || err.status === 401
          ? "The username or password is incorrect."
          : err.status
          ? errorMessage(err)
          : err.message
      );

      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Log in"
      subtitle={
        location.state?.registered
          ? "Your account is ready. Log in to continue."
          : "Use the account you registered with."
      }
      footer={
        <>
          New to FairChain?{" "}
          <Link
            to="/register"
            className="font-semibold text-jade underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">

        <label className="block text-sm font-medium">
          Username

          <input
            required
            autoComplete="username"
            value={form.username}
            onChange={set("username")}
            className={`${FIELD} mt-1`}
          />
        </label>

        <label className="block text-sm font-medium">
          Password

          <div className="relative mt-1">
            <input
              required
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={set("password")}
              className={`${FIELD} w-full pr-12`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-jade"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword
                ? <EyeOff size={20} />
                : <Eye size={20} />
              }
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={busy}
          className={`${BTN} w-full py-3`}
        >
          {busy
            ? "Logging in. The server may be waking up."
            : "Log in"
          }
        </button>

        <p role="alert" className="min-h-5 text-sm text-signal">
          {error}
        </p>

      </form>
    </AuthLayout>
  );
}
