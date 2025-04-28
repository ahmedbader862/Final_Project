import { useState, useContext } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  providerG,
  db,
  setDoc,
  doc,
  getDoc,
} from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faGoogle as faGoogleBrand } from "@fortawesome/free-brands-svg-icons";
import { ThemeContext } from "../../Context/ThemeContext";
import "./Signin.css";
import clsx from "clsx";

function Signin() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const allDishes = useSelector((state) => state.wishlist);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  const [userUpData, setUserUpData] = useState({
    email: "",
    password: "",
  });

  const [errorsMsgUp, setErrorsMsgUp] = useState({
    emailError: null,
    passwordError: null,
  });

  const handleData = (e) => {
    const { name, value } = e.target;
    setUserUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorsMsgUp((prev) => ({
      ...prev,
      [`${name}Error`]: validateField(name, value),
    }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return !value
          ? text.requiredField || "This Field Is Required"
          : !value.match(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/)
          ? text.invalidEmail || "Invalid Email Address"
          : null;
      case "password":
        return !value ? text.requiredField || "This Field Is Required" : null;
      default:
        return null;
    }
  };

  const handleSignin = () => {
    const updatedErrors = {
      emailError: validateField("email", userUpData.email),
      passwordError: validateField("password", userUpData.password),
    };

    setErrorsMsgUp(updatedErrors);

    if (Object.values(updatedErrors).some((error) => error !== null)) {
      return;
    }

    signInWithEmailAndPassword(auth, userUpData.email, userUpData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (
          userUpData.email === "admin@gmail.com" &&
          userUpData.password === "aaaAAA111!!!"
        ) {
          navigate(`/admin/`);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        setErrorsMsgUp((prev) => ({
          ...prev,
          emailError:
            error.code === "auth/user-not-found"
              ? text.userNotFound || "User not found"
              : error.code === "auth/wrong-password"
              ? text.incorrectPassword || "Incorrect password"
              : error.message,
        }));
      });
  };

  const logInGoogle = () => {
    signInWithPopup(auth, providerG)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        createUserGoogle(user, token);
      })
      .catch((error) => {
        setErrorsMsgUp((prev) => ({
          ...prev,
          emailError: error.message,
        }));
      });
  };

  const createUserGoogle = async (user, token) => {
    const userData = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      allDishes: allDishes.wishlist || [],
      uid: user.uid,
      token: token,
    };
    try {
      const userRef = doc(db, "users2", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, userData);
      }
      if (user.email === "admin@gmail.com") {
        navigate("/admin/");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrorsMsgUp((prev) => ({
        ...prev,
        emailError: error.message,
      }));
    }
  };

  const bgColor = theme === "dark" ? "bg-dark-custom" : "bg-light-custom";
  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const bgForm = theme === "dark" ? "bg-dark" : "bg-light";
  const placeholderClass = theme === "dark" ? "placeholder-dark" : "placeholder-light";
  const iconColorClass = theme === "dark" ? "text-light" : "text-dark";

  return (
    <div className={clsx(`py-5 ${bgColor} sign-in min-vh-100`, { "rtl-text": currentLange === "Ar" })}>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-lg-10">
            <div className={`row mt-5 shadow-lg rounded overflow-hidden ${bgForm}`}>
              {/* Left Side - Form */}
              <div className="col-12 col-md-6 p-4">
                <h2 className={`mb-4 text-center fw-bold ${textColor}`}>
                  {text.signIn || "Sign In"}
                </h2>

                {/* Email */}
                <div className="mb-3">
                  <label className={`mb-2 ${textColor}`}>
                    {text.email || "Email"}
                  </label>
                  <div className={clsx("input-group", { "flex-row-reverse": currentLange === "Ar" })}>
                    <span className={`input-group-text ${bgColor} ${textColor}`}>
                      <FontAwesomeIcon icon={faEnvelope} className={iconColorClass} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={userUpData.email}
                      onChange={handleData}
                      placeholder={text.enterEmail || "Enter your email"}
                      className={`form-control ${errorsMsgUp.emailError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
                    />
                    {errorsMsgUp.emailError && (
                      <div className="invalid-feedback">{errorsMsgUp.emailError}</div>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className={`mb-2 ${textColor}`}>
                    {text.password || "Password"}
                  </label>
                  <div className={clsx("input-group", { "flex-row-reverse": currentLange === "Ar" })}>
                    <span className={`input-group-text ${bgColor} ${textColor}`}>
                      <FontAwesomeIcon icon={faLock} className={iconColorClass} />
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={userUpData.password}
                      onChange={handleData}
                      placeholder={text.enterPassword || "Enter your password"}
                      className={`form-control ${errorsMsgUp.passwordError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
                    />
                    {errorsMsgUp.passwordError && (
                      <div className="invalid-feedback">{errorsMsgUp.passwordError}</div>
                    )}
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  onClick={handleSignin}
                  className={clsx(`btn btn-outline-danger w-100 `,)}
                >
                  {text.signInButton || "Sign in"}
                </button>

                {/* Divider */}
                <div className="d-flex align-items-center my-4">
                  <hr className={`flex-grow-1 ${theme === "dark" ? "border-light" : "border-dark"}`} />
                  <span className={`px-2 ${textColor}`}>{text.or || "or"}</span>
                  <hr className={`flex-grow-1 ${theme === "dark" ? "border-light" : "border-dark"}`} />
                </div>

                {/* Google Login */}
                <button
                  onClick={logInGoogle}
                  className={clsx("btn btn-outline-danger w-100 text-center d-flex justify-content-center align-items-center gap-2", {
                    "flex-row-reverse": currentLange === "Ar",
                    "justify-content-center": currentLange !== "Ar",
                    "justify-content-center-reverse": currentLange === "Ar"
                  })}
                >
                  <FontAwesomeIcon icon={faGoogleBrand} className={iconColorClass} />
                  {text.google || "Google"}
                </button>
              </div>

              {/* Right Side - Image with Overlay */}
              <div className="col-12 col-md-6 p-0">
                <div className="position-relative h-100">
                  <img
                    src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt={text.foodImageAlt || "Food"}
                    className="w-100 h-100 object-fit-cover"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
                  <div className={clsx("position-absolute top-50 start-50 translate-middle text-center text-white p-4", { "rtl-text": currentLange === "Ar" })}>
                    <h2 className="fw-bold mb-3">{text.signIn || "Sign In"}</h2>
                    <p className="lead">{text.welcomeBack || "Welcome back! Please login to continue."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;