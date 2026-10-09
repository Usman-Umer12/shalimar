import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  // ------------------------------------------------------------
  // CHECK EXISTING SESSION
  // ------------------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        if (session) {
          navigate("/admin", { replace: true });
        }

        setCheckingSession(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // ------------------------------------------------------------
  // LOGIN
  // ------------------------------------------------------------

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (loginError) {
        setError(
          loginError.message === "Invalid login credentials"
            ? "Invalid email or password."
            : loginError.message
        );

        return;
      }

      navigate("/admin", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // LOADING SESSION
  // ------------------------------------------------------------

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F1EA]">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={28}
            className="animate-spin text-[#641F2A]"
          />

          <p className="text-sm text-black/45">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // LOGIN UI
  // ------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F5F1EA]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ======================================================
            LEFT BRAND SECTION
        ====================================================== */}

        <section className="relative hidden overflow-hidden bg-[#4A151F] lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-white/[0.04]" />

            <div className="absolute -bottom-48 -left-40 h-[600px] w-[600px] rounded-full bg-black/10" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* BRAND */}

            <div>
              <div className="text-2xl font-semibold tracking-[0.25em] text-white">
                SHALIMAR
              </div>

              <div className="mt-2 text-[10px] font-medium tracking-[0.35em] text-white/50">
                INTERIORS
              </div>
            </div>

            {/* CENTER */}

            <div className="max-w-xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                Administration
              </p>

              <h1 className="text-4xl font-medium leading-[1.15] text-white xl:text-6xl">
                Your catalogue.
                <br />
                Your control.
              </h1>

              <p className="mt-7 max-w-md text-sm leading-7 text-white/60">
                Manage your Shalimar products, pricing and website
                content from one secure administration panel.
              </p>
            </div>

            {/* FOOTER */}

            <div className="text-xs text-white/35">
              © {new Date().getFullYear()} Shalimar Interiors
            </div>
          </div>
        </section>

        {/* ======================================================
            RIGHT LOGIN SECTION
        ====================================================== */}

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

          <div className="w-full max-w-md">

            {/* MOBILE BRAND */}

            <div className="mb-9 text-center lg:hidden">
              <div className="text-2xl font-semibold tracking-[0.22em] text-[#4A151F]">
                SHALIMAR
              </div>

              <div className="mt-1 text-[10px] font-medium tracking-[0.35em] text-black/40">
                INTERIORS
              </div>
            </div>

            {/* LOGIN CARD */}

            <div className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_20px_70px_rgba(74,21,31,0.08)] sm:p-9">

              <div className="mb-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#641F2A]">
                  Admin Portal
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-black/45">
                  Sign in to manage your Shalimar website.
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#171717]">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      strokeWidth={1.8}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="admin@shalimar.com"
                      autoComplete="email"
                      className="h-12 w-full rounded-xl border border-black/10 bg-[#FAFAF9] pl-11 pr-4 text-sm text-[#171717] outline-none transition placeholder:text-black/25 focus:border-[#641F2A] focus:ring-4 focus:ring-[#641F2A]/[0.07]"
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#171717]">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      strokeWidth={1.8}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-12 w-full rounded-xl border border-black/10 bg-[#FAFAF9] pl-11 pr-12 text-sm text-[#171717] outline-none transition placeholder:text-black/25 focus:border-[#641F2A] focus:ring-4 focus:ring-[#641F2A]/[0.07]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-black/30 transition hover:text-[#641F2A]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* ERROR */}

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                    {error}
                  </div>
                )}

                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#641F2A] px-5 text-sm font-semibold text-white transition hover:bg-[#4A151F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* SECURITY */}

              <div className="mt-7 flex items-center justify-center gap-2 text-xs text-black/35">
                <Lock size={13} />
                Secure administrator access
              </div>
            </div>

            {/* BACK WEBSITE */}

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-black/40 transition hover:text-[#641F2A]"
              >
                ← Back to website
              </a>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;