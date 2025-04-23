import { useState } from "react";
import { auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, providerG, db, setDoc, doc, getDoc } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { faGoogle as faGoogleBrand, faFacebook as faFacebookBrand } from '@fortawesome/free-brands-svg-icons';
import './Signin.css';

function Signin() {
  const allDishes = useSelector((state) => state.wishlist);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const [userUpData, setUserUpData] = useState({
    email: "",
    password: ""
  });

  const [errorsMsgUp, setErrorsMsgUp] = useState({
    emailError: null,
    passwordError: null
  });

  // Validate fields on change
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
      case 'email':
        return !value ? "This Field Is Required" :
          !value.match(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/) && "Invalid Email Address";
      case 'password':
        return !value ? "This Field Is Required" : null;
      default:
        return null;
    }
  };

  const navigate = useNavigate();

  const handleSignin = () => {
    signInWithEmailAndPassword(auth, userUpData.email, userUpData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
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
        console.log(error);
        setErrorsMsgUp(prev => ({
          ...prev,
          emailError: error.code === "auth/user-not-found" ? "User not found" :
                      error.code === "auth/wrong-password" ? "Incorrect password" : error.message
        }));
      });
  };

  const logInGoogle = () => {
    console.log("Attempting Google Sign-In");
    signInWithPopup(auth, providerG)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log("Google Token:", token);
        const user = result.user;
        createUserGoogle(user, token);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error Message:", errorMessage);
        console.log("Error Code:", errorCode);
        const email = error.customData?.email;
        console.log("Error Email:", email);
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("Error Credential:", credential);
        setErrorsMsgUp(prev => ({
          ...prev,
          emailError: error.message
        }));
      });
  };

  const createUserGoogle = async (user, token) => {
    const userData = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      allDishes: allDishes.wishlist || [], // Fallback to empty array if undefined
      uid: user.uid,
      token: token
    };
    try {
      const userRef = doc(db, "users2", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, userData);
        console.log("Google user created successfully!");
      } else {
        console.log("Google user already exists, skipping creation");
      }
      if (user.email === "admin@gmail.com") {
        navigate("/admin/");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating Google user:", error);
      setErrorsMsgUp(prev => ({
        ...prev,
        emailError: error.message
      }));
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center my-5">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 mt-5">
            <div className="p-4 p-md-5 shadow-lg rounded-3 bg-white form-container">
              <h2 className="mb-4 text-center text-dark fw-bold">{text.signIn}</h2>

              {/* Email Field */}
              <div className="mb-3">
                <label className="form-label text-dark">{text.email}</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    type="email"
                    className={`form-control rounded-end ${errorsMsgUp.emailError ? "is-invalid" : ""}`}
                    name="email"
                    value={userUpData.email}
                    onChange={handleData}
                    placeholder="Enter your email"
                  />
                  {errorsMsgUp.emailError && (
                    <div className="invalid-feedback">{errorsMsgUp.emailError}</div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label className="form-label text-dark">{text.password}</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type="password"
                    className={`form-control rounded-end ${errorsMsgUp.passwordError ? "is-invalid" : ""}`}
                    name="password"
                    value={userUpData.password}
                    onChange={handleData}
                    placeholder="Enter your password"
                  />
                  {errorsMsgUp.passwordError && (
                    <div className="invalid-feedback">{errorsMsgUp.passwordError}</div>
                  )}
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                onClick={handleSignin}
                className="btn btn-primary w-100 mb-3 fw-semibold"
              >
                {text.signInButton}
              </button>

              {/* Divider */}
              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1" />
                <span className="px-2 text-muted">{text.or}</span>
                <hr className="flex-grow-1" />
              </div>

              {/* Social Login Buttons */}
              <div className="d-flex gap-2">
                <button
                  onClick={logInGoogle}
                  className="btn btn-outline-danger w-50 d-flex align-items-center justify-content-center gap-2"
                >
                  <FontAwesomeIcon icon={faGoogleBrand} /> {text.google}
                </button>
                <button
                  disabled
                  className="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center gap-2"
                >
                  <FontAwesomeIcon icon={faFacebookBrand} /> {text.facebook}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signin;