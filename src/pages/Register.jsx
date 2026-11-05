
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { api, errorMessage } from "../api/client";
import { REGISTER_ROLES, ROLE_LABELS } from "../config/nav";
import { FIELD, BTN } from "../components/ui/styles";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    user_type: "",
    phone: "",
    address: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      await api("/api/register/", {
        method: "POST",
        auth: false,
        body: {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          user_type: form.user_type,
          phone: form.phone.trim(),
          address: form.address.trim(),
        },
      });

      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Choose the role that matches what you do. You can report prices as a citizen or log stock as part of the supply chain."
      footer={
        <>
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-jade underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
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
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
              className={`${FIELD} mt-1`}
            />
          </label>
        </div>

        <label className="block text-sm font-medium">
          I am a
          <select
            required
            value={form.user_type}
            onChange={set("user_type")}
            className={`${FIELD} mt-1`}
          >
            {REGISTER_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Phone
            <input
              required
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={set("phone")}
              className={`${FIELD} mt-1`}
            />
          </label>

          <label className="block text-sm font-medium">
            Address
            <input
              required
              autoComplete="street-address"
              value={form.address}
              onChange={set("address")}
              className={`${FIELD} mt-1`}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Password
            <input
              required
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={form.password}
              onChange={set("password")}
              className={`${FIELD} mt-1`}
            />
          </label>

          <label className="block text-sm font-medium">
            Confirm password
            <input
              required
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={set("confirm")}
              className={`${FIELD} mt-1`}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={busy}
          className={`${BTN} w-full py-3`}
        >
          {busy ? "Creating account..." : "Create account"}
        </button>

        <p role="alert" className="min-h-5 text-sm text-signal">
          {error}
        </p>
      </form>
    </AuthLayout>
  );
}
