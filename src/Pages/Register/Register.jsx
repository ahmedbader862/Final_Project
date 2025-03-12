import { useState, useEffect } from "react";
import { auth, createUserWithEmailAndPassword, db, setDoc, doc } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";


function Register() {



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

  // تحقق من تطابق الباسوورد عند التغيير
  useEffect(() => {
    if (userUpData.password && userUpData.confPassword) {
      setErrorsMsgUp(prev => ({
        ...prev,
        passwordError: userUpData.password !== userUpData.confPassword
          ? "Password Not Matched"
          : null,
        confPasswordError: userUpData.password !== userUpData.confPassword
          ? "Password Not Matched"
          : null
      }));
    }
  }, [userUpData.password, userUpData.confPassword]);

  const handleData = (e) => {
    const { name, value } = e.target;

    // تحديث البيانات
    setUserUpData(prev => ({
      ...prev,
      [name]: value
    }));

    // التحقق من الأخطاء
    setErrorsMsgUp(prev => ({
      ...prev,
      [`${name}Error`]: validateField(name, value)
    }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value ? "This Field Is Required" :
          !value.match(/^[a-zA-Z0-9_-]{3,15}$/) && "Invalid Name";

      case 'email':
        return !value ? "This Field Is Required" :
          !value.match(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/) && "Invalid Email Address";

      case 'usrName':
        return !value ? "This Field Is Required" :
          !value.match(/^[a-zA-Z0-9_-]{3,15}$/) && "Invalid User Name";

      case 'password':
        return !value ? "This Field Is Required" :
          !value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
            ? "Weak Password"
            : null;

      case 'confPassword':
        return !value ? "This Field Is Required" : null;

      default:
        return null;
    }
  };

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  const navigate = useNavigate();
  const submitForm = () => {
    console.log("Form Data:", userUpData.name);
  
    createUserWithEmailAndPassword(auth, userUpData.email, userUpData.password)
      .then((userCredential) => {
        
        var user = userCredential.user;
        console.log("User created:", user);
  
        createUser(user.uid);  // كلام كبار
  
      
        navigate("/Signin");  
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  const createUser = (uid) => {



    setDoc(doc(db, "users2", uid), userUpData)

      .then(() => {
        console.log("User created successfully!");
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });



  }



























  //   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center my-5">
          <div className="col-12 col-sm-8 col-md-6">
            <div className="p-4 shadow-lg rounded  text-white">
              <h2 className="mb-4 text-center">Sign Up Form</h2>

              {/* Name Field */}
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${errorsMsgUp.nameError ? "is-invalid" : ""}`}
                  name="name"
                  value={userUpData.name}
                  onChange={handleData}
                />
                {errorsMsgUp.nameError && (
                  <div className="invalid-feedback">{errorsMsgUp.nameError}</div>
                )}
              </div>

              {/* Email Field */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errorsMsgUp.emailError ? "is-invalid" : ""}`}
                  name="email"
                  value={userUpData.email}
                  onChange={handleData}
                />
                {errorsMsgUp.emailError && (
                  <div className="invalid-feedback">{errorsMsgUp.emailError}</div>
                )}
              </div>

              {/* Username Field */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className={`form-control ${errorsMsgUp.usrNameError ? "is-invalid" : ""}`}
                  name="usrName"
                  value={userUpData.usrName}
                  onChange={handleData}
                />
                {errorsMsgUp.usrNameError && (
                  <div className="invalid-feedback">{errorsMsgUp.usrNameError}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${errorsMsgUp.passwordError ? "is-invalid" : ""}`}
                  name="password"
                  value={userUpData.password}
                  onChange={handleData}
                />
                {errorsMsgUp.passwordError && (
                  <div className="invalid-feedback">{errorsMsgUp.passwordError}</div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className={`form-control ${errorsMsgUp.confPasswordError ? "is-invalid" : ""}`}
                  name="confPassword"
                  value={userUpData.confPassword}
                  onChange={handleData}
                />
                {errorsMsgUp.confPasswordError && (
                  <div className="invalid-feedback">{errorsMsgUp.confPasswordError}</div>
                )}
              </div>

              <button
                type="submit"
                onClick={submitForm}
                className="btn btn-primary w-100 mt-3"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Register;