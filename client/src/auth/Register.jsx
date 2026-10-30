import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUser,
  faEnvelope,
  faLock,
  faArrowRight,
  faCircleExclamation,
  faSpinner,
  faGem,
  faTruckFast,
  faShieldHalved,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faFacebook,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate, Link } from "react-router-dom";

import axiosInstance from "../utils/axiosInstance";
import useGoogleSignIn from "../hooks/useGoogleSignIn";
import useFacebookSignIn from "../hooks/useFacebookSignIn";
import useGitHubSignIn from "../hooks/useGitHubSignIn";
import { LanguageContext } from "../context/LanguageContext";
import loginBg from "../assets/images/registerBg.jpg";

/* ---------------- Translation ---------------- */
const TEXT = {
  EN: {
    badge: "Premium Store",
    heroLine1: "Join us and",
    heroLine2: "start your journey",
    heroDesc:
      "Create a free account in less than a minute and unlock all features.",
    feat1Title: "Fast Delivery",
    feat1Desc: "Free shipping over ৳2000",
    feat2Title: "Secure Payment",
    feat2Desc: "Your information is 100% protected",
    feat3Title: "Wishlist & Orders",
    feat3Desc: "Track everything in one place",
    welcome: "Get Started",
    title: "Create Account",
    subtitle: "Fill in the details to register your new account",
    fullname: "Full Name",
    fullnamePh: "Enter your full name",
    email: "Email",
    emailPh: "Enter your email",
    password: "Password",
    passwordPh: "Enter your password",
    confirmPassword: "Confirm Password",
    confirmPasswordPh: "Confirm your password",
    showPw: "Show password",
    hidePw: "Hide password",
    strength: ["", "Weak", "Fair", "Good", "Strong"],
    agree: "I agree to the",
    terms: "Terms & Conditions",
    and: "and",
    privacy: "Privacy Policy",
    registerBtn: "Register",
    registering: "Creating account...",
    orContinue: "or continue with",
    haveAccount: "Already have an account?",
    login: "Login",
    errMismatch: "Password not matched",
    errTerms: "Please agree to the Terms & Conditions",
    errRegister: "Registration failed. Please try again.",
  },

  BN: {
    badge: "প্রিমিয়াম স্টোর",
    heroLine1: "আমাদের সাথে যোগ দিন",
    heroLine2: "যাত্রা শুরু করুন",
    heroDesc:
      "এক মিনিটেরও কম সময়ে ফ্রি অ্যাকাউন্ট খুলে সব সুবিধা উপভোগ করুন।",
    feat1Title: "দ্রুত ডেলিভারি",
    feat1Desc: "২০০০ টাকার উপরে ফ্রি শিপিং",
    feat2Title: "নিরাপদ পেমেন্ট",
    feat2Desc: "আপনার তথ্য ১০০% সুরক্ষিত",
    feat3Title: "উইশলিস্ট ও অর্ডার",
    feat3Desc: "সবকিছু এক জায়গায় ট্র্যাক করুন",
    welcome: "শুরু করুন",
    title: "অ্যাকাউন্ট খুলুন",
    subtitle: "নতুন অ্যাকাউন্টের তথ্য পূরণ করুন",
    fullname: "পুরো নাম",
    fullnamePh: "আপনার পুরো নাম লিখুন",
    email: "ইমেইল",
    emailPh: "আপনার ইমেইল লিখুন",
    password: "পাসওয়ার্ড",
    passwordPh: "আপনার পাসওয়ার্ড লিখুন",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    confirmPasswordPh: "পাসওয়ার্ডটি আবার লিখুন",
    showPw: "পাসওয়ার্ড দেখান",
    hidePw: "পাসওয়ার্ড লুকান",
    strength: ["", "দুর্বল", "মোটামুটি", "ভালো", "শক্তিশালী"],
    agree: "আমি সম্মত আছি",
    terms: "শর্তাবলী",
    and: "এবং",
    privacy: "গোপনীয়তা নীতি",
    registerBtn: "রেজিস্টার করুন",
    registering: "অ্যাকাউন্ট খোলা হচ্ছে...",
    orContinue: "অথবা এর মাধ্যমে চালিয়ে যান",
    haveAccount: "আগে থেকেই অ্যাকাউন্ট আছে?",
    login: "লগইন",
    errMismatch: "পাসওয়ার্ড মিলছে না",
    errTerms: "অনুগ্রহ করে শর্তাবলীতে সম্মত হোন",
    errRegister: "রেজিস্ট্রেশন করা যায়নি। আবার চেষ্টা করুন।",
  },
};

/* ---------------- Shared styles ---------------- */
const inputWrap =
  "flex items-center rounded-xl border bg-[#FAF6EF]/60 transition focus-within:bg-white focus-within:ring-4";

const inputOk =
  "border-[#E4DDCE] focus-within:border-[#B08946] focus-within:ring-[#B08946]/15";

const inputErr =
  "border-red-400 focus-within:border-red-500 focus-within:ring-red-100";

const labelCls =
  "mb-1.5 block text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-[#16241F]/70";

const inputCls =
  "w-full bg-transparent px-3 py-3 text-sm sm:text-base text-[#16241F] outline-none placeholder:text-[#16241F]/30";

const socialBtn =
  "w-full flex items-center justify-center gap-2.5 rounded-xl border border-[#E4DDCE] bg-white py-2.5 text-sm font-semibold text-[#16241F] transition hover:border-[#B08946] hover:bg-[#FAF6EF] active:scale-[0.99]";

/* ---------------- Reusable Field ---------------- */
const Field = ({
  label,
  icon,
  error,
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  autoComplete,
  isPassword = false,
  showLabel,
  hideLabel,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className={labelCls}>{label}</label>

      <div className={`${inputWrap} ${error ? inputErr : inputOk}`}>
        <span className="pl-4 text-[#B08946]">
          <FontAwesomeIcon icon={icon} className="text-sm" />
        </span>

        <input
          type={isPassword ? (show ? "text" : "password") : type}
          name={name}
          value={value}
          required
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={inputCls}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? hideLabel : showLabel}
            className="mr-2 flex h-8 w-8 items-center justify-center rounded-full text-[#16241F]/45 transition hover:bg-[#16241F] hover:text-[#B08946]"
          >
            <FontAwesomeIcon
              icon={show ? faEye : faEyeSlash}
              className="text-sm"
            />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
          <FontAwesomeIcon icon={faCircleExclamation} className="text-[11px]" />
          {error}
        </p>
      )}
    </div>
  );
};

/* ---------------- Password Strength ---------------- */
const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0 - 4
};

const strengthColors = [
  "bg-[#E4DDCE]",
  "bg-red-500",
  "bg-orange-400",
  "bg-[#B08946]",
  "bg-green-600",
];

/* ---------------- Register Page ---------------- */
const Register = () => {
  const navigate = useNavigate();
  const signInWithGoogle = useGoogleSignIn();
  const signInWithFacebook = useFacebookSignIn();
  const signInWithGitHub = useGitHubSignIn();

  const { language } = useContext(LanguageContext);
  const t = TEXT[language] || TEXT.EN;

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const emptyFields = {
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [error, setError] = useState(emptyFields);
  const [user, setUser] = useState(emptyFields);

  const strength = getStrength(user.password);

  /* ---------------- Social Login ---------------- */
  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const handleFacebookLogin = async () => {
    await signInWithFacebook();
  };

  const handleGitHubLogin = async () => {
    await signInWithGitHub();
  };

  /* ---------------- Input Change ---------------- */
  const changeHandler = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
  };

  /* ---------------- Register Handler ---------------- */
  const formHandler = async (e) => {
    e.preventDefault();
    setMessage("");

    if (user.password !== user.confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: t.errMismatch,
      }));
      return;
    }

    if (!agreedToTerms) {
      setMessage(t.errTerms);
      return;
    }

    setError(emptyFields);

    try {
      setSubmitting(true);
      await axiosInstance.post("/api/auth/user/register", user);
      navigate("/login");
    } catch (err) {
      const serverError = err.response?.data?.error;

      if (serverError) {
        setError((prev) => ({ ...prev, ...serverError }));
      }

      setMessage(err.response?.data?.message || t.errRegister);
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
            alt="Register Background"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#16241F]/75" />

          {/* Decorative Circles */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#B08946]/15" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#B08946]/10" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#B08946]/20" />

          {/* Brand Content */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#B08946]/40 bg-[#B08946]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B08946]">
              <FontAwesomeIcon icon={faGem} className="text-[10px]" />
              {t.badge}
            </span>

            <h2 className="mt-6 text-4xl font-bold leading-tight">
              {t.heroLine1}
              <span className="block text-[#B08946]">{t.heroLine2}</span>
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#FAF6EF]/80">
              {t.heroDesc}
            </p>
          </div>

          {/* Features */}
          <ul className="relative z-10 space-y-4">
            {[
              { icon: faTruckFast, title: t.feat1Title, desc: t.feat1Desc },
              { icon: faShieldHalved, title: t.feat2Title, desc: t.feat2Desc },
              { icon: faHeart, title: t.feat3Title, desc: t.feat3Desc },
            ].map((f) => (
              <li key={f.title} className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#B08946]/40 bg-white/10 text-[#B08946]">
                  <FontAwesomeIcon icon={f.icon} />
                </span>

                <div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs text-[#FAF6EF]/70">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ============ RIGHT: Register Form ============ */}
        <div className="p-5 sm:p-9 lg:p-10">
          {/* Heading */}
          <div className="mb-5 sm:mb-6">
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

            <p className="mt-2 text-sm text-[#16241F]/55">{t.subtitle}</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={formHandler}>
            <Field
              label={t.fullname}
              icon={faUser}
              name="fullname"
              value={user.fullname}
              placeholder={t.fullnamePh}
              autoComplete="name"
              onChange={changeHandler}
              error={error.fullname}
            />

            <Field
              label={t.email}
              icon={faEnvelope}
              type="email"
              name="email"
              value={user.email}
              placeholder={t.emailPh}
              autoComplete="email"
              onChange={changeHandler}
              error={error.email}
            />

            {/* Password + Strength */}
            <div>
              <Field
                label={t.password}
                icon={faLock}
                name="password"
                value={user.password}
                placeholder={t.passwordPh}
                autoComplete="new-password"
                onChange={changeHandler}
                error={error.password}
                isPassword
                showLabel={t.showPw}
                hideLabel={t.hidePw}
              />

              {user.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength
                            ? strengthColors[strength]
                            : "bg-[#E4DDCE]"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-1 text-right text-[11px] font-semibold text-[#16241F]/55">
                    {t.strength[strength]}
                  </p>
                </div>
              )}
            </div>

            <Field
              label={t.confirmPassword}
              icon={faLock}
              name="confirmPassword"
              value={user.confirmPassword}
              placeholder={t.confirmPasswordPh}
              autoComplete="new-password"
              onChange={changeHandler}
              error={error.confirmPassword}
              isPassword
              showLabel={t.showPw}
              hideLabel={t.hidePw}
            />

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

            {/* Register Button */}
            <button
              type="submit"
              disabled={submitting}
              className="group mt-1 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#16241F] py-3 text-sm font-bold text-[#FAF6EF] shadow-md transition duration-200 hover:bg-[#B08946] hover:text-[#16241F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              {submitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  {t.registering}
                </>
              ) : (
                <>
                  {t.registerBtn}
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
            <button
              onClick={handleGoogleLogin}
              type="button"
              className={socialBtn}
            >
              <FontAwesomeIcon icon={faGoogle} className="text-lg text-red-500" />
              <span className="sm:hidden xl:inline">Google</span>
            </button>

            <button
              onClick={handleFacebookLogin}
              type="button"
              className={socialBtn}
            >
              <FontAwesomeIcon
                icon={faFacebook}
                className="text-lg text-blue-600"
              />
              <span className="sm:hidden xl:inline">Facebook</span>
            </button>

            <button
              onClick={handleGitHubLogin}
              type="button"
              className={socialBtn}
            >
              <FontAwesomeIcon
                icon={faGithub}
                className="text-lg text-[#16241F]"
              />
              <span className="sm:hidden xl:inline">GitHub</span>
            </button>
          </div>

          {/* Bottom Link */}
          <p className="mt-6 text-center text-sm text-[#16241F]/60">
            {t.haveAccount}{" "}
            <Link
              to="/login"
              className="font-bold text-[#B08946] transition hover:text-[#16241F] hover:underline"
            >
              {t.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;