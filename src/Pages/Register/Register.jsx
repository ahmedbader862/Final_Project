import { useState, useEffect, useContext } from "react";
import { auth, providerG, providerF, createUserWithEmailAndPassword, signOut, db, setDoc, doc } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faAt, faLock } from '@fortawesome/free-solid-svg-icons';
import { faGoogle as faGoogleBrand, faFacebook as faFacebookBrand } from '@fortawesome/free-brands-svg-icons';
import { ThemeContext } from "../../Context/ThemeContext";
import './Register.css';

function Register() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const allDishes = useSelector((state) => state.wishlist);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  console.log("Redux wishlist:", allDishes); // Debug log for wishlist

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

  const submitForm = () => {
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

  const logInFacebook = () => {
    signInWithPopup(auth, providerF)
      .then((result) => {
        const user = result.user;
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        createUserFacebook(user, token);
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

  const createUserFacebook = (user, token) => {
    const userData = {
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      allDishes: allDishes.wishlist || [],
      uid: user.uid,
      token: token
    };
    setDoc(doc(db, "users2", user.uid), userData).catch((error) => {
      console.error("Error saving Facebook user data:", error);
    });
  };

  const bgColor = theme === "dark" ? "bg-custom-dark" : "bg-custom-light";
  const bgForm = theme === "dark" ? "bg-dark" : "bg-light";
  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const placeholderClass = theme === "dark" ? "placeholder-dark" : "placeholder-light";
  const iconColorClass = theme === "dark" ? "text-light" : "text-dark";
  const btnColor = theme === "dark" ? "btn-outline-light" : "btn-outline-dark";

  return (
    <div className={`mt-5 ${bgColor} min-vh-100`}>
      <div className="container">
        <div className="row justify-content-center my-5">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 mt-5">
            <div className={`p-4 p-md-5 shadow-lg rounded-3 ${bgForm}`}>
              <h2 className={`mb-4 text-center fw-bold ${textColor}`}>{text.createAccount || "Create Account"}</h2>

              {/* Name Field */}
              <div className="mb-3">
                <label className={` ${textColor}`}>{text.name || "Name"}</label>
                <div className="input-group">
                  <span className={`input-group-text ${bgColor} ${textColor}`}>
                    <FontAwesomeIcon icon={faUser} className={iconColorClass} />
                  </span>
                  <input
                    type="text"
                    className={`form-control rounded-end ${errorsMsgUp.nameError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
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
                <label className={` ${textColor}`}>{text.email || "Email"}</label>
                <div className="input-group">
                  <span className={`input-group-text ${bgColor} ${textColor}`}>
                    <FontAwesomeIcon icon={faEnvelope} className={iconColorClass} />
                  </span>
                  <input
                    type="email"
                    className={`form-control rounded-end ${errorsMsgUp.emailError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
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
                <label className={` ${textColor}`}>{text.username || "Username"}</label>
                <div className="input-group">
                  <span className={`input-group-text ${bgColor} ${textColor}`}>
                    <FontAwesomeIcon icon={faAt} className={iconColorClass} />
                  </span>
                  <input
                    type="text"
                    className={`form-control rounded-end ${errorsMsgUp.usrNameError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
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
                <label className={` ${textColor}`}>{text.password || "Password"}</label>
                <div className="input-group">
                  <span className={`input-group-text ${bgColor} ${textColor}`}>
                    <FontAwesomeIcon icon={faLock} className={iconColorClass} />
                  </span>
                  <input
                    type="password"
                    className={`form-control rounded-end ${errorsMsgUp.passwordError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
                    name="password"
                    value={userUpData.password}
                    onChange={handleData}
                    placeholder={text.enterPassword || "Enter your password"}
                  />
                  {errorsMsgUp.passwordError && (
                    <div className="invalid-feedback">{errorsMsgUp.passwordError}</div>
                  )}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4">
                <label className={` ${textColor}`}>{text.confirmPassword || "Confirm Password"}</label>
                <div className="input-group">
                  <span className={`input-group-text ${bgColor} ${textColor}`}>
                    <FontAwesomeIcon icon={faLock} className={iconColorClass} />
                  </span>
                  <input
                    type="password"
                    className={`form-control rounded-end ${errorsMsgUp.confPasswordError ? "is-invalid" : ""} ${theme === "dark" ? "input-dark" : "input-light"} ${placeholderClass}`}
                    name="confPassword"
                    value={userUpData.confPassword}
                    onChange={handleData}
                    placeholder={text.confirmPasswordPlaceholder || "Confirm your password"}
                  />
                  {errorsMsgUp.confPasswordError && (
                    <div className="invalid-feedback">{errorsMsgUp.confPasswordError}</div>
                  )}
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                onClick={submitForm}
                className={`btn ${btnColor} w-100 mb-3 fw-semibold`}
              >
                {text.registerButton || "Register"}
              </button>

              {/* Divider */}
              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1" />
                <span className={`px-2 ${textColor}`}>{text.or || "or"}</span>
                <hr className="flex-grow-1" />
              </div>

              {/* Social Login Buttons */}
              <div className="d-flex gap-2">
                <button
                  onClick={logInGoogle}
                  className="btn btn-outline-danger w-50 d-flex align-items-center justify-content-center gap-2"
                >
                  <FontAwesomeIcon icon={faGoogleBrand} className={iconColorClass} />
                  {text.google || "Google"}
                </button>
                <button
                  onClick={logInFacebook}
                  className="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center gap-2"
                >
                  <FontAwesomeIcon icon={faFacebookBrand} className={iconColorClass} />
                  {text.facebook || "Facebook"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;