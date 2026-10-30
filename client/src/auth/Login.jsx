
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faLock,
  faArrowRight,
  faCircleExclamation,
  faSpinner,
  faTruckFast,
  faShieldHalved,
  faGem,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faFacebook,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

import axiosInstance from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import useGoogleSignIn from "../hooks/useGoogleSignIn";
import useFacebookSignIn from "../hooks/useFacebookSignIn";
import useGitHubSignIn from "../hooks/useGitHubSignIn";
import { AuthContext } from "../context/AuthContext";
import { LanguageContext } from "../context/LanguageContext";
import loginBg from "../assets/images/login_bg.jpg";

/* ---------------- Translation ---------------- */
const TEXT = {
  EN: {
    badge: "Premium Store",
    heroLine1: "Welcome back,",
    heroLine2: "start shopping",
    heroDesc:
      "Log in to see your orders, wishlist and cart from one place.",
    feat1Title: "Fast Delivery",
    feat1Desc: "Free shipping over ৳2000",
    feat2Title: "Secure Payment",
    feat2Desc: "Your information is 100% protected",
    welcome: "Welcome Back",
    title: "Login",
    subtitle: "Sign in to your account",
    email: "Email",
    emailPh: "Enter your email",
    password: "Password",
    passwordPh: "Enter your password",
    showPw: "Show password",
    hidePw: "Hide password",
    remember: "Remember me",
    forgot: "Forgot Password?",
    agree: "I agree to the",
    terms: "Terms & Conditions",
    and: "and",
    privacy: "Privacy Policy",
    loginBtn: "Login",
    loggingIn: "Logging in...",
    orContinue: "or continue with",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    errEmailFirst: "Please enter your email first",
    errSomething: "Something went wrong",
    errTerms: "Please agree to the Terms & Conditions",
    errLogin: "Login failed",
  },

  BN: {
    badge: "প্রিমিয়াম স্টোর",
    heroLine1: "আবার স্বাগতম,",
    heroLine2: "শপিং শুরু করুন",
    heroDesc:
      "লগইন করে আপনার অর্ডার, উইশলিস্ট আর কার্ট এক জায়গা থেকে দেখুন।",
    feat1Title: "দ্রুত ডেলিভারি",
    feat1Desc: "২০০০ টাকার উপরে ফ্রি শিপিং",
    feat2Title: "নিরাপদ পেমেন্ট",
    feat2Desc: "আপনার তথ্য ১০০% সুরক্ষিত",
    welcome: "আবার স্বাগতম",
    title: "লগইন",
    subtitle: "আপনার অ্যাকাউন্টে প্রবেশ করুন",
    email: "ইমেইল",
    emailPh: "আপনার ইমেইল লিখুন",
    password: "পাসওয়ার্ড",
    passwordPh: "আপনার পাসওয়ার্ড লিখুন",
    showPw: "পাসওয়ার্ড দেখান",
    hidePw: "পাসওয়ার্ড লুকান",
    remember: "আমাকে মনে রাখুন",
    forgot: "পাসওয়ার্ড ভুলে গেছেন?",
    agree: "আমি সম্মত আছি",
    terms: "শর্তাবলী",
    and: "এবং",
    privacy: "গোপনীয়তা নীতি",
    loginBtn: "লগইন করুন",
    loggingIn: "লগইন হচ্ছে...",
    orContinue: "অথবা এর মাধ্যমে চালিয়ে যান",
    noAccount: "অ্যাকাউন্ট নেই?",
    signUp: "সাইন আপ",
    errEmailFirst: "আগে আপনার ইমেইল লিখুন",
    errSomething: "কিছু একটা ভুল হয়েছে",
    errTerms: "অনুগ্রহ করে শর্তাবলীতে সম্মত হোন",
    errLogin: "লগইন করা যায়নি",
  },
};

const inputWrap =
  "flex items-center rounded-xl border border-[#E4DDCE] bg-[#FAF6EF]/60 transition focus-within:border-[#B08946] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#B08946]/15";

const socialBtn =
  "w-full flex items-center justify-center gap-2.5 rounded-xl border border-[#E4DDCE] bg-white py-2.5 text-sm font-semibold text-[#16241F] transition hover:border-[#B08946] hover:bg-[#FAF6EF] active:scale-[0.99]";

const Login = () => {
  const navigate = useNavigate();
  const signInWithGoogle = useGoogleSignIn();
  const signInWithFacebook = useFacebookSignIn();
  const signInWithGitHub = useGitHubSignIn();

  const { login, loading } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);

  const t = TEXT[language] || TEXT.EN;

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  /* ---------------- Google Login ---------------- */
  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  /* ---------------- Facebook Login ---------------- */
  const handleFacebookLogin = async () => {
    await signInWithFacebook();
  };

  /* ---------------- GitHub Login ---------------- */
  const handleGitHubLogin = async () => {
    await signInWithGitHub();
  };

  /* ---------------- Input Change ---------------- */
  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  };

  /* ---------------- Forgot Password ---------------- */
  const forgetPasswordHandler = async () => {
    const email = user.email;

    if (!email) {
      setMessage(t.errEmailFirst);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/auth/user/forgot-password",
        { email }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || t.errSomething
      );
    }
  };

  /* ---------------- Login Handler ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setMessage(t.errTerms);
      return;
    }

    try {
      setSubmitting(true);

      await login(
        user.email,
        user.password,
        user.rememberMe,
        agreedToTerms
      );

      navigate("/userDashboard", {
        replace: true,
      });
    } catch (error) {
      console.log("Login error:", error);

      setMessage(
        error.response?.data?.message || t.errLogin
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-3 py-6 sm:px-6 sm:py-10 bg-[#FAF6EF]/50">

      <div className="w-full max-w-5xl mt-8 sm:mt-0 overflow-hidden rounded-3xl border border-[#E4DDCE] bg-white shadow-2xl lg:grid lg:grid-cols-2">

        {/* ============ LEFT: Brand Panel ============ */}

        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-10 text-[#FAF6EF]">

          {/* Background Image */}
          <img
            src={loginBg}
            alt="Login Background"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#16241F]/75" />

          {/* Decorative Circles */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#B08946]/15" />

          <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#B08946]/10" />

          <div className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#B08946]/20" />

          {/* Brand Content */}
          <div className="relative z-10">

            <span className="inline-flex items-center gap-2 rounded-full border border-[#B08946]/40 bg-[#B08946]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B08946]">

              <FontAwesomeIcon
                icon={faGem}
                className="text-[10px]"
              />

              {t.badge}

            </span>

            <h2 className="mt-6 text-4xl font-bold leading-tight">

              {t.heroLine1}

              <span className="block text-[#B08946]">
                {t.heroLine2}
              </span>

            </h2>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#FAF6EF]/80">
              {t.heroDesc}
            </p>

          </div>

          {/* Features */}
          <ul className="relative z-10 space-y-4">

            {[
              {
                icon: faTruckFast,
                title: t.feat1Title,
                desc: t.feat1Desc,
              },
              {
                icon: faShieldHalved,
                title: t.feat2Title,
                desc: t.feat2Desc,
              },
            ].map((f) => (

              <li
                key={f.title}
                className="flex items-center gap-3.5"
              >

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#B08946]/40 bg-white/10 text-[#B08946]">

                  <FontAwesomeIcon icon={f.icon} />

                </span>

                <div>

                  <p className="text-sm font-semibold">
                    {f.title}
                  </p>

                  <p className="text-xs text-[#FAF6EF]/70">
                    {f.desc}
                  </p>

                </div>

              </li>

            ))}

          </ul>

        </div>

        {/* ============ RIGHT: Login Form ============ */}

        <div className="p-5 sm:p-9 lg:p-10">

          {/* Skeleton Loader */}
          {loading ? (

            <div className="animate-pulse space-y-4">

              <div className="mb-6 space-y-2">
                <div className="h-3 w-24 rounded bg-[#E4DDCE]/70" />
                <div className="h-8 w-1/2 rounded-md bg-[#E4DDCE]/70" />
                <div className="h-4 w-1/3 rounded-md bg-[#E4DDCE]/50" />
              </div>

              <div className="space-y-4">

                <div className="space-y-1.5">
                  <div className="h-3 w-16 rounded bg-[#E4DDCE]/60" />
                  <div className="h-12 w-full rounded-xl bg-[#E4DDCE]/50" />
                </div>

                <div className="space-y-1.5">
                  <div className="h-3 w-20 rounded bg-[#E4DDCE]/60" />
                  <div className="h-12 w-full rounded-xl bg-[#E4DDCE]/50" />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="h-4 w-28 rounded bg-[#E4DDCE]/50" />
                  <div className="h-4 w-24 rounded bg-[#E4DDCE]/50" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-[#E4DDCE]/50" />
                  <div className="h-4 w-3/4 rounded bg-[#E4DDCE]/50" />
                </div>

                <div className="mt-2 h-12 w-full rounded-xl bg-[#16241F]/20" />

              </div>

              <div className="my-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-[#E4DDCE]" />
                <div className="h-3 w-6 rounded bg-[#E4DDCE]/60" />
                <div className="h-px flex-1 bg-[#E4DDCE]" />
              </div>

              <div className="space-y-2.5">
                <div className="h-11 w-full rounded-xl bg-[#E4DDCE]/50" />
                <div className="h-11 w-full rounded-xl bg-[#E4DDCE]/50" />
                <div className="h-11 w-full rounded-xl bg-[#E4DDCE]/50" />
              </div>

              <div className="mx-auto mt-4 h-4 w-1/2 rounded bg-[#E4DDCE]/50" />

            </div>

          ) : (

            <>

              {/* Heading */}
              <div className="mb-5 sm:mb-7">

                <div className="flex items-center gap-3">

                  <span className="h-8 w-1 rounded-full bg-[#B08946]" />

                  <div>

                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B08946]">
                      {t.welcome}
                    </p>

                    <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-[#16241F]">
                      {t.title}
                    </h1>

                  </div>

                </div>

                <p className="mt-2 text-sm text-[#16241F]/55">
                  {t.subtitle}
                </p>

              </div>

              {/* Form */}
              <form
                className="space-y-4"
                onSubmit={handleLogin}
              >

                {/* Email */}
                <div>

                  <label className="mb-1.5 block text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-[#16241F]/70">
                    {t.email}
                  </label>

                  <div className={inputWrap}>

                    <span className="pl-4 text-[#B08946]">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-sm"
                      />
                    </span>

                    <input
                      type="email"
                      value={user.email}
                      name="email"
                      required
                      onChange={changeHandler}
                      autoComplete="email"
                      placeholder={t.emailPh}
                      className="w-full bg-transparent px-3 py-3 text-sm sm:text-base text-[#16241F] outline-none placeholder:text-[#16241F]/30"
                    />

                  </div>

                </div>

                {/* Password */}
                <div>

                  <label className="mb-1.5 block text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-[#16241F]/70">
                    {t.password}
                  </label>

                  <div className={inputWrap}>

                    <span className="pl-4 text-[#B08946]">
                      <FontAwesomeIcon
                        icon={faLock}
                        className="text-sm"
                      />
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      value={user.password}
                      name="password"
                      required
                      onChange={changeHandler}
                      autoComplete="current-password"
                      placeholder={t.passwordPh}
                      className="w-full bg-transparent px-3 py-3 text-sm sm:text-base text-[#16241F] outline-none placeholder:text-[#16241F]/30"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? t.hidePw : t.showPw}
                      className="mr-2 flex h-8 w-8 items-center justify-center rounded-full text-[#16241F]/45 transition hover:bg-[#16241F] hover:text-[#B08946]"
                    >

                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className="text-sm"
                      />

                    </button>

                  </div>

                </div>

                {/* Message */}
                {message && (

                  <div className="flex items-start gap-2 rounded-xl border-l-4 border-red-500 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600">

                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      className="mt-0.5 text-sm"
                    />

                    <span>{message}</span>

                  </div>

                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between gap-2 text-sm">

                  <label className="flex cursor-pointer items-center gap-2 text-[#16241F]/70">

                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded accent-[#B08946]"
                      checked={user.rememberMe}
                      onChange={changeHandler}
                      name="rememberMe"
                    />

                    {t.remember}

                  </label>

                  <button
                    type="button"
                    onClick={forgetPasswordHandler}
                    className="cursor-pointer border-none bg-transparent p-0 font-semibold text-[#B08946] transition hover:text-[#16241F] hover:underline"
                  >
                    {t.forgot}
                  </button>

                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 text-sm text-[#16241F]/70">

                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-[#B08946]"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      setMessage("");
                    }}
                  />

                  <p className="leading-snug">

                    {t.agree}{" "}

                    <span className="cursor-pointer font-semibold text-[#B08946] hover:underline">
                      {t.terms}
                    </span>{" "}

                    {t.and}{" "}

                    <span className="cursor-pointer font-semibold text-[#B08946] hover:underline">
                      {t.privacy}
                    </span>

                  </p>

                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group mt-1 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#16241F] py-3 text-sm font-bold text-[#FAF6EF] shadow-md transition duration-200 hover:bg-[#B08946] hover:text-[#16241F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                >

                  {submitting ? (

                    <>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin"
                      />

                      {t.loggingIn}
                    </>

                  ) : (

                    <>
                      {t.loginBtn}

                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-xs transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>

                  )}

                </button>

              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#E4DDCE]" />

                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#16241F]/35">
                  {t.orContinue}
                </p>

                <div className="h-px flex-1 bg-[#E4DDCE]" />

              </div>

              {/* Social Login */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">

                {/* Google */}
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className={socialBtn}
                >
                  <FontAwesomeIcon
                    icon={faGoogle}
                    className="text-lg text-red-500"
                  />

                  <span className="sm:hidden xl:inline">
                    Google
                  </span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleFacebookLogin}
                  type="button"
                  className={socialBtn}
                >
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className="text-lg text-blue-600"
                  />

                  <span className="sm:hidden xl:inline">
                    Facebook
                  </span>
                </button>

                {/* GitHub */}
                <button
                  onClick={handleGitHubLogin}
                  type="button"
                  className={socialBtn}
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="text-lg text-[#16241F]"
                  />

                  <span className="sm:hidden xl:inline">
                    GitHub
                  </span>
                </button>

              </div>

              {/* Bottom Link */}
              <p className="mt-6 text-center text-sm text-[#16241F]/60">

                {t.noAccount}{" "}

                <Link
                  to="/register"
                  className="font-bold text-[#B08946] transition hover:text-[#16241F] hover:underline"
                >
                  {t.signUp}
                </Link>

              </p>

            </>

          )}

        </div>

      </div>

    </div>
  );
};

export default Login;
