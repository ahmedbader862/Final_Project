import { useState, useEffect } from "react";
import { auth, signInWithEmailAndPassword } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";


function Signin() {

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


  //   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  const navigate = useNavigate();
  const handleSignin = () => {
    signInWithEmailAndPassword(auth, userUpData.email, userUpData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);

        if (
          userUpData.email == "admin@gmail.com" &&
          userUpData.password == "aaaAAA111!!!" 

        ) {
          navigate(`/admin/${user.uid}`);
        }
       else{
        navigate("/");
       }
      })
      .catch((error) => {
        console.log(error);
      });
  };















  //   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  //   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  return (
    <>
<div className="container mt-5">
  <div className="row justify-content-center my-5">
    <div className="col-12 col-sm-8 col-md-6">
      <div className="p-4 shadow-lg rounded ">
        <h2 className="mb-4 text-center text-white mt-3">Sign Up Form</h2>

        {/* Email Field */}
        <div className="mb-3">
          <label className="form-label text-white">Email</label>
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

        {/* Password Field */}
        <div className="mb-3">
          <label className="form-label text-white">Password</label>
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

        {/* Sign In Button */}
        <button
          type="submit"
          onClick={handleSignin}
          className="btn btn-primary w-100 mt-3"
        >
          Sign In
        </button>
      </div>
    </div>
  </div>
</div>



    </>
  );
}

export default Signin;