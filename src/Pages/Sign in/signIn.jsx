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
import {
  faGoogle as faGoogleBrand,
  faFacebook as faFacebookBrand,
} from "@fortawesome/free-brands-svg-icons";
import { ThemeContext } from "../../Context/ThemeContext";
import "./Signin.css";

function Signin() {
  const allDishes = useSelector((state) => state.wishlist);
  const { theme } = useContext(ThemeContext);

  const [userUpData, setUserUpData] = useState({
    email: "",
    password: "",
  });

  const [errorsMsgUp, setErrorsMsgUp] = useState({
    emailError: null,
    passwordError: null,
  });

  const navigate = useNavigate();

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
          ? "This Field Is Required"
          : !value.match(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/)
          ? "Invalid Email Address"
          : null;
      case "password":
        return !value ? "This Field Is Required" : null;
      default:
        return null;
    }
  };

  const handleSignin = () => {
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
              ? "User not found"
              : error.code === "auth/wrong-password"
              ? "Incorrect password"
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

  const bgColor = theme === "dark" ? "bg-custom-dark" : "bg-custom-light";
  const Color = theme === "dark" ? "color-light" : "color-dark";
  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const bgForm = theme === "dark" ? "bg-dark" : "bg-light";
  const btnColor = theme === "dark" ? "btn-outline-light" : "btn-outline-dark";


  const placeholderClass =
    theme === "dark" ? "placeholder-dark" : "placeholder-light";

  return (
    <div className={` py-5 ${bgColor} sign-in min-vh-100`}>
      <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className={`p-4 rounded shadow-lg ${bgForm}`}>
            <h2 className={`mb-4 text-center fw-bold ${textColor}`}>Sign In</h2>

            {/* Email */}
            <div className="mb-3">
              <label className={` ${textColor}`}>Email</label>
              <div className="input-group">
                <span className={`input-group-text bg-secondary bg-opacity-25 ${textColor}`}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={userUpData.email}
                  onChange={handleData}
                  placeholder="Enter your email"
                  className={`form-control ${errorsMsgUp.emailError ? "is-invalid" : ""}  ${textColor} ${placeholderClass}`}
                />
                {errorsMsgUp.emailError && (
                  <div className="invalid-feedback">{errorsMsgUp.emailError}</div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className={` ${textColor}`}>Password</label>
              <div className="input-group">
                <span className={`input-group-text bg-secondary bg-opacity-25 ${textColor}`}>
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  name="password"
                  value={userUpData.password}
                  onChange={handleData}
                  placeholder="Enter your password"
                  className={`form-control ${errorsMsgUp.passwordError ? "is-invalid" : ""}  ${placeholderClass}`}
                />
                {errorsMsgUp.passwordError && (
                  <div className="invalid-feedback">{errorsMsgUp.passwordError}</div>
                )}
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignin}
              className={`btn ${btnColor} w-100 fw-semibold mb-3`}
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="d-flex align-items-center my-4">
              <hr className={`flex-grow-1 ${Color}`} />
              <span className={`px-2 ${textColor}`}>or</span>
              <hr className="flex-grow-1" />
            </div>

            {/* Social Login */}
            <div className="d-flex gap-2">
              <button
                onClick={logInGoogle}
                className="btn btn-outline-danger w-50 d-flex align-items-center justify-content-center gap-2"
              >
                <FontAwesomeIcon icon={faGoogleBrand} /> Google
              </button>
              <button
                disabled
                className="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center gap-2"
              >
                <FontAwesomeIcon icon={faFacebookBrand} /> Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Signin;
