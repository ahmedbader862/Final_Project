import { useState, useEffect } from "react";
import { auth, providerG, providerF, signInWithPopup, createUserWithEmailAndPassword, signOut, db, setDoc, doc } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faAt, faLock } from '@fortawesome/free-solid-svg-icons';
import { faGoogle as faGoogleBrand, faFacebook as faFacebookBrand } from '@fortawesome/free-brands-svg-icons';
import './Register.css';

function Register() {
  const allDishes = useSelector((state) => state.wishlist);
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

  const navigate = useNavigate();

  useEffect(() => {
    // Validate password matching only if both fields are filled
    if (userUpData.password || userUpData.confPassword) {
      setErrorsMsgUp(prev => ({
        ...prev,
        passwordError: userUpData.password !== userUpData.confPassword
          ? "Passwords Do Not Match"
          : validateField('password', userUpData.password),
        confPasswordError: userUpData.password !== userUpData.confPassword
          ? "Passwords Do Not Match"
          : validateField('confPassword', userUpData.confPassword)
      }));
    }
  }, [userUpData.password, userUpData.confPassword]);

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
        return !value ? "This Field Is Required" :
          !value.match(/^[a-zA-Z0-9_-]{3,15}$/) ? "Invalid Name (3-15 characters, letters, numbers, _, -)" : null;
      case 'email':
        return !value ? "This Field Is Required" :
          !value.match(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/) ? "Invalid Email Address" : null;
      case 'usrName':
        return !value ? "This Field Is Required" :
          !value.match(/^[a-zA-Z0-9_-]{3,15}$/) ? "Invalid Username (3-15 characters, letters, numbers, _, -)" : null;
      case 'password':
        return !value ? "This Field Is Required" :
          !value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
            ? "Password must be 8+ characters with uppercase, lowercase, number, and special character"
            : null;
      case 'confPassword':
        return !value ? "This Field Is Required" : null;
      default:
        return null;
    }
  };

  const submitForm = () => {
    console.log("submitForm called with data:", userUpData);
    console.log("Current errors:", errorsMsgUp);

    // Revalidate all fields
    const updatedErrors = {
      nameError: validateField('name', userUpData.name),
      emailError: validateField('email', userUpData.email),
      usrNameError: validateField('usrName', userUpData.usrName),
      passwordError: validateField('password', userUpData.password),
      confPasswordError: validateField('confPassword', userUpData.confPassword)
    };

    // Check password match
    if (userUpData.password !== userUpData.confPassword) {
      updatedErrors.passwordError = "Passwords Do Not Match";
      updatedErrors.confPasswordError = "Passwords Do Not Match";
    }

    setErrorsMsgUp(updatedErrors);
    console.log("Updated errors:", updatedErrors);

    // Check for any errors
    const hasErrors = Object.values(updatedErrors).some(error => error !== null);
    if (hasErrors) {
      console.log("Form submission blocked due to validation errors");
      return;
    }

    console.log("Proceeding with registration");
    createUserWithEmailAndPassword(auth, userUpData.email, userUpData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created:", user);
        createUser(user.uid);
        // Sign out to prevent auto-login
        return signOut(auth);
      })
      .then(() => {
        console.log("Signed out after registration");
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setErrorsMsgUp(prev => ({
          ...prev,
          emailError: error.code === "auth/email-already-in-use" ? "Email already in use" :
                      error.code === "auth/invalid-email" ? "Invalid email" : error.message
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
    console.log("Saving user data:", userDetails);
    setDoc(doc(db, "users2", uid), userDetails)
      .then(() => {
        console.log("User data saved to Firestore");
      })
      .catch((error) => {
        console.error("Error saving user data:", error);
      });
  };

  const logInGoogle = () => {
    console.log("Attempting Google Sign-Up");
    signInWithPopup(auth, providerG)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log("Google user:", user);
        createUserGoogle(user, token);
        // Sign out to prevent auto-login
        return signOut(auth);
      })
      .then(() => {
        console.log("Signed out after Google sign-up");
        navigate("/signin");
      })
      .catch((error) => {
        console.log("Google Sign-Up Error:", {
          code: error.code,
          message: error.message,
          email: error.customData?.email
        });
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
    console.log("Saving Google user data:", userData);
    setDoc(doc(db, "users2", user.uid), userData)
      .then(() => {
        console.log("Google user data saved to Firestore");
      })
      .catch((error) => {
        console.error("Error saving Google user data:", error);
      });
  };

  const logInFacebook = () => {
    console.log("Attempting Facebook Sign-Up");
    signInWithPopup(auth, providerF)
      .then((result) => {
        const user = result.user;
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log("Facebook user:", user);
        createUserFacebook(user, token);
        // Sign out to prevent auto-login
        return signOut(auth);
      })
      .then(() => {
        console.log("Signed out after Facebook sign-up");
        navigate("/signin");
      })
      .catch((error) => {
        console.log("Facebook Sign-Up Error:", {
          code: error.code,
          message: error.message,
          email: error.customData?.email
        });
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
    console.log("Saving Facebook user data:", userData);
    setDoc(doc(db, "users2", user.uid), userData)
      .then(() => {
        console.log("Facebook user data saved to Firestore");
      })
      .catch((error) => {
        console.error("Error saving Facebook user data:", error);
      });
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center my-5">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 mt-5">
            <div className="p-4 p-md-5 shadow-lg rounded-3 bg-white form-container">
              <h2 className="mb-4 text-center text-dark fw-bold">Create Account</h2>

              {/* Name Field */}
              <div className="mb-3">
                <label className="form-label text-dark">Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    type="text"
                    className={`form-control rounded-end ${errorsMsgUp.nameError ? "is-invalid" : ""}`}
                    name="name"
                    value={userUpData.name}
                    onChange={handleData}
                    placeholder="Enter your name"
                  />
                  {errorsMsgUp.nameError && (
                    <div className="invalid-feedback">{errorsMsgUp.nameError}</div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-3">
                <label className="form-label text-dark">Email</label>
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

              {/* Username Field */}
              <div className="mb-3">
                <label className="form-label text-dark">Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FontAwesomeIcon icon={faAt} />
                  </span>
                  <input
                    type="text"
                    className={`form-control rounded-end ${errorsMsgUp.usrNameError ? "is-invalid" : ""}`}
                    name="usrName"
                    value={userUpData.usrName}
                    onChange={handleData}
                    placeholder="Choose a username"
                  />
                  {errorsMsgUp.usrNameError && (
                    <div className="invalid-feedback">{errorsMsgUp.usrNameError}</div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label className="form-label text-dark">Password</label>
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

              {/* Confirm Password Field */}
              <div className="mb-4">
                <label className="form-label text-dark">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type="password"
                    className={`form-control rounded-end ${errorsMsgUp.confPasswordError ? "is-invalid" : ""}`}
                    name="confPassword"
                    value={userUpData.confPassword}
                    onChange={handleData}
                    placeholder="Confirm your password"
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
                className="btn btn-primary w-100 mb-3 fw-semibold"
              >
                Register
              </button>

              {/* Divider */}
              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1" />
                <span className="px-2 text-muted">or</span>
                <hr className="flex-grow-1" />
              </div>

              {/* Social Login Buttons */}
              <div className="d-flex gap-2">
                <button
                  onClick={logInGoogle}
                  className="btn btn-outline-danger w-50 d-flex align-items-center justify-content-center gap-2"
                >
                  <FontAwesomeIcon icon={faGoogleBrand} /> Google
                </button>
                <button
                  onClick={logInFacebook}
                  className="btn btn-outline-primary w-50 d-flex align-items-center justify-content-center gap-2"
                >
                  <FontAwesomeIcon icon={faFacebookBrand} /> Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;