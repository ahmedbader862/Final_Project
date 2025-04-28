import { useState, useEffect, useContext } from "react";
import { auth, providerG, createUserWithEmailAndPassword, signOut, db, setDoc, doc } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faAt, faLock } from '@fortawesome/free-solid-svg-icons';
import { faGoogle as faGoogleBrand } from '@fortawesome/free-brands-svg-icons';
import { ThemeContext } from "../../Context/ThemeContext";
import './Register.css';
import clsx from "clsx";

function Register() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const allDishes = useSelector((state) => state.wishlist);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  const [userUpData, setUserUpData] = useState({
    name: "",
    email: "",
    usrName: "",
    password: "",
    confPassword: ""
  });

  const [errorsMsgUp, setErrorsMsgUp] = useState({
    nameError: null,
    emailError: null,
    usrNameError: null,
    passwordError: null,
    confPasswordError: null
  });

  useEffect(() => {
    if (userUpData.password || userUpData.confPassword) {
      setErrorsMsgUp(prev => ({
        ...prev,
        passwordError: userUpData.password !== userUpData.confPassword
          ? text.passwordsDoNotMatch || "Passwords Do Not Match"
          : validateField('password', userUpData.password),
        confPasswordError: userUpData.password !== userUpData.confPassword
          ? text.passwordsDoNotMatch || "Passwords Do Not Match"
          : validateField('confPassword', userUpData.confPassword)
      }));
    }
  }, [userUpData.password, userUpData.confPassword, text]);

  const handleData = (e) => {
    const { name, value } = e.target;
    setUserUpData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorsMsgUp(prev => ({
      ...prev,
      [`${name}Error`]: validateField(name, value)
    }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value ? text.requiredField || "This Field Is Required" :
          !value.match(/^[a-zA-Z0-9_-]{3,15}$/) ? text.invalidName || "Invalid Name (3-15 characters, letters, numbers, _, -)" : null;
      case 'email':
        return !value ? text.requiredField || "This Field Is Required" :
          !value.match(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/) ? text.invalidEmail || "Invalid Email Address" : null;
      case 'usrName':
        return !value ? text.requiredField || "This Field Is Required" :
          !value.match(/^[a-zA-Z0-9_-]{3,15}$/) ? text.invalidUsername || "Invalid Username (3-15 characters, letters, numbers, _, -)" : null;
      case 'password':
        return !value ? text.requiredField || "This Field Is Required" :
          !value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
            ? text.invalidPassword || "Password must be 8+ characters with uppercase, lowercase, number, and special character"
            : null;
      case 'confPassword':
        return !value ? text.requiredField || "This Field Is Required" : null;
      default:
        return null;
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const updatedErrors = {
      nameError: validateField('name', userUpData.name),
      emailError: validateField('email', userUpData.email),
      usrNameError: validateField('usrName', userUpData.usrName),
      passwordError: validateField('password', userUpData.password),
      confPasswordError: validateField('confPassword', userUpData.confPassword)
    };

    if (userUpData.password !== userUpData.confPassword) {
      updatedErrors.passwordError = text.passwordsDoNotMatch || "Passwords Do Not Match";
      updatedErrors.confPasswordError = text.passwordsDoNotMatch || "Passwords Do Not Match";
    }

    setErrorsMsgUp(updatedErrors);

    if (Object.values(updatedErrors).some(error => error !== null)) {
      return;
    }

    createUserWithEmailAndPassword(auth, userUpData.email, userUpData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        createUser(user.uid);
        return signOut(auth);
      })
      .then(() => {
        navigate("/signin");
      })
      .catch((error) => {
        setErrorsMsgUp(prev => ({
          ...prev,
          emailError: error.code === "auth/email-already-in-use" ? text.emailInUse || "Email already in use" :
                      error.code === "auth/invalid-email" ? text.invalidEmail || "Invalid email" : error.message
        }));
      });
  };

  const createUser = (uid) => {
    const userDetails = {
      name: userUpData.name || "",
      email: userUpData.email || "",
      usrName: userUpData.usrName || "",
      allDishes: allDishes.wishlist || [],
      uid: uid
    };
    setDoc(doc(db, "users2", uid), userDetails).catch((error) => {
      console.error("Error saving user data:", error);
    });
  };

  const logInGoogle = () => {
    signInWithPopup(auth, providerG)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        createUserGoogle(user, token);
        return signOut(auth);
      })
      .then(() => {
        navigate("/signin");
      })
      .catch((error) => {
        setErrorsMsgUp(prev => ({
          ...prev,
          emailError: error.message
        }));
      });
  };

  const createUserGoogle = (user, token) => {
    const userData = {
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      allDishes: allDishes.wishlist || [],
      uid: user.uid,
      token: token
    };
    setDoc(doc(db, "users2", user.uid), userData).catch((error) => {
      console.error("Error saving Google user data:", error);
    });
  };

  const bgColor = theme === "dark" ? "bg-dark-custom" : "bg-light-custom";
  const bgForm = theme === "dark" ? "bg-dark" : "bg-light";
  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const placeholderClass = theme === "dark" ? "placeholder-dark" : "placeholder-light";
  const iconColorClass = theme === "dark" ? "text-light" : "text-dark";

  return (
    <div className={clsx(`min-vh-100 ${bgColor}`, { "rtl-text": currentLange === "Ar" })}>
      <div className="container py-5">
        <div className="row my-4 g-0 align-items-center justify-content-center">
          {/* Left Side - Image with Overlay */}
          <div className="col-12 col-md-6 d-none d-md-block">
            <div className="position-relative h-100" style={{ minHeight: '500px' }}>
              <img
                src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt={text.foodImageAlt || "Food"}
                className="w-100 rounded-3 vh-100 overflow-hidden object-fit-cover"
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
              <div className={clsx("position-absolute top-50 start-50 translate-middle text-center text-white px-4", { "rtl-text": currentLange === "Ar" })}>
                <h2 className="fw-bold mb-3">{text.createAccount || "Create Account"}</h2>
                <p className="lead">{text.joinUs || "Join us! Create your account to get started."}</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-12 col-md-6 col-lg-5">
            <div className={`p-4 p-md-5 shadow-lg rounded-3 ${bgForm}`}>
              <form onSubmit={submitForm}>
                <h2 className={`mb-4 text-center fw-bold ${textColor}`}>
                  {text.createAccount || "Create Account"}
                </h2>

                {/* Name Field */}
                <div className="mb-3">
                  <label className={`mb-2 ${textColor}`}>
                    {text.name || "Name"}
                  </label>
                  <div className={clsx("input-group", { "flex-row-reverse": currentLange === "Ar" })}>
                    <span className={`input-group-text ${bgColor} ${textColor}`}>
                      <FontAwesomeIcon icon={faUser} className={iconColorClass} />
                    </span>
                    <input
                      type="text"
                      className={`form-control ${errorsMsgUp.nameError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
                      name="name"
                      value={userUpData.name}
                      onChange={handleData}
                      placeholder={text.enterName || "Enter your name"}
                    />
                    {errorsMsgUp.nameError && (
                      <div className="invalid-feedback">{errorsMsgUp.nameError}</div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
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
                      className={`form-control ${errorsMsgUp.emailError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
                      name="email"
                      value={userUpData.email}
                      onChange={handleData}
                      placeholder={text.enterEmail || "Enter your email"}
                    />
                    {errorsMsgUp.emailError && (
                      <div className="invalid-feedback">{errorsMsgUp.emailError}</div>
                    )}
                  </div>
                </div>

                {/* Username Field */}
                <div className="mb-3">
                  <label className={`mb-2 ${textColor}`}>
                    {text.username || "Username"}
                  </label>
                  <div className={clsx("input-group", { "flex-row-reverse": currentLange === "Ar" })}>
                    <span className={`input-group-text ${bgColor} ${textColor}`}>
                      <FontAwesomeIcon icon={faAt} className={iconColorClass} />
                    </span>
                    <input
                      type="text"
                      className={`form-control ${errorsMsgUp.usrNameError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
                      name="usrName"
                      value={userUpData.usrName}
                      onChange={handleData}
                      placeholder={text.chooseUsername || "Choose a username"}
                    />
                    {errorsMsgUp.usrNameError && (
                      <div className="invalid-feedback">{errorsMsgUp.usrNameError}</div>
                    )}
                  </div>
                </div>

                {/* Password Field */}
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
                      className={`form-control ${errorsMsgUp.passwordError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
                      name="password"
                      value={userUpData.password}
                      onChange={handleData}
                      placeholder={text.createPassword || "Create a password"}
                    />
                    {errorsMsgUp.passwordError && (
                      <div className="invalid-feedback">{errorsMsgUp.passwordError}</div>
                    )}
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="mb-3">
                  <label className={`mb-2 ${textColor}`}>
                    {text.confirmPassword || "Confirm Password"}
                  </label>
                  <div className={clsx("input-group", { "flex-row-reverse": currentLange === "Ar" })}>
                    <span className={`input-group-text ${bgColor} ${textColor}`}>
                      <FontAwesomeIcon icon={faLock} className={iconColorClass} />
                    </span>
                    <input
                      type="password"
                      className={`form-control ${errorsMsgUp.confPasswordError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
                      name="confPassword"
                      value={userUpData.confPassword}
                      onChange={handleData}
                      placeholder={text.confirmPassword || "Confirm your password"}
                    />
                    {errorsMsgUp.confPasswordError && (
                      <div className="invalid-feedback">{errorsMsgUp.confPasswordError}</div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className={clsx(`btn btn-outline-danger w-100`, )}
                    disabled={Object.values(errorsMsgUp).some(error => error !== null)}
                  >
                    {text.signUp || "Sign Up"}
                  </button>
                </div>

                {/* Divider */}
                <div className="d-flex align-items-center my-4">
                  <hr className={`flex-grow-1 ${theme === "dark" ? "border-light" : "border-dark"}`} />
                  <span className={`px-2 ${textColor}`}>{text.or || "or"}</span>
                  <hr className={`flex-grow-1 ${theme === "dark" ? "border-light" : "border-dark"}`} />
                </div>

                {/* Google Sign-Up */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={logInGoogle}
                    className={clsx("btn btn-outline-danger w-100 d-flex align-items-center gap-2", {
                      "flex-row-reverse": currentLange === "Ar",
                      "justify-content-center": currentLange !== "Ar",
                      "justify-content-center-reverse": currentLange === "Ar"
                    })}
                  >
                    <FontAwesomeIcon icon={faGoogleBrand} className={iconColorClass} />
                    {text.signUpWithGoogle || "Sign Up with Google"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;