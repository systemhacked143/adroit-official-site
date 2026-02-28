import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error', 'expired'
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          setStatus("error");
          setMessage("Invalid verification link. No token provided.");
          return;
        }

        // Call the email verification endpoint
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error === "Token expired") {
            setStatus("expired");
            setMessage("Your verification link has expired. Please sign up again.");
          } else {
            setStatus("error");
            setMessage(data.message || "Failed to verify email. Please try again.");
          }
          return;
        }

        setStatus("success");
        setMessage(
          "Email verified successfully! Redirecting to login page..."
        );

        // Redirect to login or dashboard after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred. Please try again later.");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white font-sans overflow-hidden flex items-center justify-center">
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/2 via-purple-500/2 to-pink-500/2 rounded-full blur-[150px]"></div>

        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(34,211,238,0.03)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* ===== MAIN CONTAINER ===== */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="relative group">
          {/* Animated border glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>

          {/* Card */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-purple-500/30 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-pink-500/30 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-500/30 rounded-br-3xl"></div>

            {/* ===== HEADER ===== */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl border border-white/10 mb-4 backdrop-blur-sm">
                {status === "verifying" && (
                  <svg
                    className="w-10 h-10 text-cyan-400 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}

                {status === "success" && (
                  <svg
                    className="w-10 h-10 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}

                {(status === "error" || status === "expired") && (
                  <svg
                    className="w-10 h-10 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                {status === "verifying" && "Verifying Email"}
                {status === "success" && "Email Verified!"}
                {status === "error" && "Verification Failed"}
                {status === "expired" && "Link Expired"}
              </h1>
              <p className="text-gray-400 mt-2">{message}</p>
            </div>

            {/* ===== ACTIONS ===== */}
            <div className="space-y-3">
              {status === "success" && (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Go to Login
                  </button>
                </>
              )}

              {(status === "error" || status === "expired") && (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Back to Sign Up
                  </button>
                  {status === "expired" && (
                    <p className="text-center text-sm text-gray-400 mt-4">
                      Please create a new account or{" "}
                      <button
                        onClick={() =>
                          (window.location.href = "mailto:adroit.rnsit@gmail.com")
                        }
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        contact support
                      </button>
                    </p>
                  )}
                </>
              )}

              {status === "verifying" && (
                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    Please wait while we verify your email address...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== GLOBAL STYLES ===== */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
        .animate-float-particle {
          animation: float-particle 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
