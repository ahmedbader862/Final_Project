import { useState, useEffect } from "react";
import { auth , providerG  ,providerF , signInWithPopup , createUserWithEmailAndPassword , db , setDoc , doc} from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { GoogleAuthProvider , FacebookAuthProvider} from "firebase/auth";
// import { useNavigate } from "react-router-dom";


function Register() {



  const  allDishes = useSelector((state) => state.wishlist);
  console.log(allDishes);


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
 const submitForm = () => {
  console.log("Form Data:", userUpData.name);

  createUserWithEmailAndPassword(auth, userUpData.email, userUpData.password)
    .then((userCredential) => {
      // User created successfully
      var user = userCredential.user;
      console.log("User created:", user);
    
    createUser(user.uid);  // كلام كبار


    })
    .catch((error) => {
      console.error("Error creating user:", error);
    });


}; 
 
const  createUser =(uid) => {
    
  const userDeatails = {
      name: userUpData.name,
      email: userUpData.email,
      usrName: userUpData.usrName,
      password: userUpData.password,
      confPassword: userUpData.confPassword,
      allDishes: allDishes.wishlist,
      uid : uid
    };
  
    setDoc(doc(db, "users2", uid), userDeatails)
  
      .then(() => {
        console.log("User created successfully!");
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });

  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%55
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%55
  const logInGoogle = ()=>{
   
    console.log("Ssssssssssssssssssssss");
    

    // providerG.addScope('https://www.googleapis.com/auth/contacts.readonly');

    signInWithPopup(auth, providerG)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log(token);
      
      // The signed-in user info.
      const user = result.user;

      createUserGoogle(user , token)
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      console.log(errorCode);
      
      // The email of the user's account used.
      const email = error.customData.email;
      console.log(email);

      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(credential);
      
      // ...
    });
  }    

  const  createUserGoogle =(user , token) => {
    
    const userData = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        allDishes: allDishes.wishlist,
        uid : user.uid,
        token : token
      };
    
      setDoc(doc(db, "users2", user.uid), userData)
    
        .then(() => {
          console.log("User created successfully!");
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
  
    }

    // ((((((((((((((((((((((((((9))))))))))))))))))))))))))

    const logInFacebook = ()=>{
     
      signInWithPopup(auth, providerF)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;
    console.log(user);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    console.log(accessToken);

    // IdP data available using getAdditionalUserInfo(result)
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    console.log(errorCode);
    
    const errorMessage = error.message;
    console.log(errorMessage);

    // The email of the user's account used.
    const email = error.customData.email;
    console.log(email);
    
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);
    console.log(credential);

    // ...
  });
      
    }
  


  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


























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
 
 <br/>
 <br/>

            <button  
            onClick={logInGoogle}
            className="btn bg-body-secondary">
              goole</button>

              <button  
            onClick={logInFacebook}
            className="btn bg-body-secondary">
              facebook</button>

            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Register;