import { useState } from "react";
import { useRegister } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    registerMutation.mutate({ name, email, password, role });
  };

  const handleGoogleLogin = () => {
    alert("Google Registration is not implemented in this demo.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#21486b]">
      <div className="w-full max-w-100 p-8 space-y-6 bg-[#1f2937] rounded-xl shadow-2xl text-white font-sans my-8">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back to home</span>
        </button>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-wide">Create Account</h2>
          <p className="text-sm text-gray-400">
            Join and start managing appointments
          </p>
        </div>

        {registerMutation.isError && (
          <div className="p-3 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded-md">
            {registerMutation.error.response?.data?.message ||
              "An error occurred"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[13px] text-gray-300">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 bg-[#111827] border border-gray-700 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm text-gray-200 placeholder-gray-500 transition-colors"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 bg-[#111827] border border-gray-700 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm text-gray-200 placeholder-gray-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] text-gray-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-2.5 bg-[#111827] border border-gray-700 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm text-gray-200 placeholder-gray-500 transition-colors"
                placeholder="Create a password"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                name="confirm-password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                type={showConfirmPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-2.5 bg-[#111827] border border-gray-700 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm text-gray-200 placeholder-gray-500 transition-colors"
                placeholder="Confirm your password"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] text-gray-300">
              Account Type
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm text-gray-200 transition-colors appearance-none"
              >
                <option value="customer">Customer</option>
                <option value="admin">Business / Admin</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center text-[13px] pt-1 pb-2">
            <label className="flex items-center space-x-2 cursor-pointer text-gray-300">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
                className="w-3.5 h-3.5 rounded border-gray-600 bg-[#111827] text-green-500 focus:ring-green-500 focus:ring-offset-gray-800"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="text-[#3b82f6] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#3b82f6] hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-2.5 font-bold tracking-wide text-white bg-[#10b981] rounded-md hover:bg-[#059669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1f2937] focus:ring-green-500 disabled:opacity-50 transition-colors"
          >
            {registerMutation.isPending ? "REGISTERING..." : "REGISTER"}
          </button>
        </form>

        <div className="relative flex items-center py-2">
          <div className="grow border-t border-gray-700"></div>
          <span className="shrink-0 mx-4 text-xs text-gray-500">OR</span>
          <div className="grow border-t border-gray-700"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 bg-[#111827] border border-gray-700 rounded-md hover:bg-gray-800 active:bg-gray-900 transition-all text-sm font-medium text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-700"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-[13px] text-center text-gray-400 pt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#3b82f6] hover:text-blue-400 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
