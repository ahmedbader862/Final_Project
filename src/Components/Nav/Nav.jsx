    import React, { useEffect, useState, useContext } from "react";
    import "./Nav.css";
    import { Link, useNavigate } from "react-router-dom";
    import { useDispatch, useSelector } from "react-redux";
    import {
    auth,
    signOut,
    onAuthStateChanged,
    collection,
    query,
    db,
    where,
    getDocs,
    onSnapshot,
    doc,
    } from "../../firebase/firebase";
    import { setUserState ,setLange} from "../../redux/reduxtoolkit";
    import { ThemeContext } from "../../Context/ThemeContext";

    function Nav() {
    const [activeTab, setActiveTab] = useState("Home");
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

    const dispatch = useDispatch();
    const userState55 = useSelector((state) => state.UserData["UserState"]);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);


    const currentLange = useSelector((state) => state.lange.langue);
const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

const wishlistRedux = useSelector((state) => state.wishlist.wishlist); 
const wishlistCount = wishlistRedux.length; 

const [WishlistCountFirestore, setWishlistCountFirestore] = useState([]);

const changeLang = () => {
   dispatch(setLange(currentLange === "En" ? "Ar" : "En"));
};
    const logout = () => {
        signOut(auth)
        .then(() => {
            console.log("%%%%%%%%%% user log out ");
            dispatch(setUserState("who know"));
            navigate("/signin");
        })
        .catch((error) => {
            console.log(error);
        });
    };

    const { theme, toggleTheme } = useContext(ThemeContext);

    const textColorClass = theme === "dark" ? "text-white" : "text-dark";
    const iconColorClass = theme === "dark" ? "text-white" : "text-dark";

    useEffect(() => {
      const authState = onAuthStateChanged(auth, (user) => {
      if (user?.displayName == null) {
          getCurrentUserDataFireStore(user);
      }
  
      if (user) {
          dispatch(
          setUserState({
              name: user.displayName,
              uid: user.uid,
              email: user.email,
          })
          );
      } else {
          dispatch(setUserState("who know"));
      }
      });

        const getCurrentUserDataFireStore = async (user) => {
        const q = query(collection(db, "users2"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            dispatch(
            setUserState({
                name: doc.data().name,
                uid: user.uid,
                email: user.email,
            })
            );
        });
        };

        return () => authState();
    }, [dispatch]);

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        navigate(`/search/${searchTerm.trim()}`);
        setSearchTerm("");
        setIsSearchOpen(false); // Close search after submission
      }
    };
  
    const toggleSearch = () => {
      setIsSearchOpen(!isSearchOpen);
    };

    
    
    useEffect(() => {
      if (userState55 && userState55.uid && userState55 !== "who know") {
        const docRef = doc(db, "users2", userState55.uid);
  
        // الاشتراك في التغييرات باستخدام onSnapshot
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const allDishes = docSnap.data().allDishes || [];
            setWishlistCountFirestore(allDishes.length);
          } else {
            setWishlistCountFirestore(0);
          }
        }, (error) => {
          console.error("Error fetching wishlist count from Firestore:", error);
        });
  
        return () => unsubscribe();
      }
    }, [userState55, setWishlistCountFirestore ]);
    return (
      <nav
      className={`navbar h-10 navbar-expand-lg fixed-top ${
        theme === "dark" ? "bg-custom-dark navbar-dark" : "bg-light navbar-light"
      }`}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="logo">
          <a className={`navbar-brand text-3xl fw-bold ${textColorClass}`} href="/">
            <img
              src={theme === "dark" ? "/Images/logo dark-mood.svg" : "/Images/logo light-mood.svg"}
              style={{ width: "80px", height: "50px" }}
              alt="Logo"
            />
            TastyBites
          </a>
        </div>
            <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            >
            <span className="navbar-toggler-icon"></span>
            </button>

            <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="navbarNavDropdown"
            >
            <ul className="navbar-nav mx-auto">
            <li className="nav-item">
                <Link
                to="/"
                className={`nav-link ${activeTab === "Home" ? "active" : ""} ${textColorClass}`}
                onClick={() => setActiveTab("Home")}
                >
                {text.home}
                </Link>
            </li>
            <li className="nav-item">
                <Link
                to="/menu"
                className={`nav-link ${activeTab === "Menu" ? "active" : ""} ${textColorClass}`}
                onClick={() => setActiveTab("Menu")}
                >
                {text.menu}
                </Link>
            </li>
            <li className="nav-item">
                <Link
                to="/reservation"
                className={`nav-link ${activeTab === "Reservation" ? "active" : ""} ${textColorClass}`}
                onClick={() => setActiveTab("Reservation")}
                >
                {text.reservation}
                </Link>
            </li>
            <li className="nav-item">
                <Link
                to="/ContactUs"
                className={`nav-link ${activeTab === "Contact Us" ? "active" : ""} ${textColorClass}`}
                onClick={() => setActiveTab("Contact Us")}
                >
                {text.contactUs}
                </Link>
            </li>
            {userState55 !== "who know" && (
            <li className="nav-item">
                <Link
                to="/orders"
                className={`nav-link ${activeTab === "My Orders" ? "active" : ""} ${textColorClass}`}
                onClick={() => setActiveTab("My Orders")}
                >
                {text.myOrders}
                </Link>
            </li>
            )}
        </ul>

            <div className="d-flex align-items-center gap-4">
                {/* Theme Switch */}
                <div className={`form-check form-switch me-3 ${textColorClass}`}>
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="themeSwitch"
                    onChange={toggleTheme}
                    checked={theme === "dark"}
                />
                <label className="form-check-label" htmlFor="themeSwitch">
                    {theme === "dark" ? "Dark" : "Light"}
                </label>
                </div>

                
                {/* Search Section */}
          <div className="d-flex align-items-center">
            <button
              className={`btn ${iconColorClass} p-2`}
              onClick={toggleSearch}
              aria-label="Toggle search"
            >
              <i className="fas fa-search"></i>
            </button>
            {isSearchOpen && (
              <div className="search-container">
                <form onSubmit={handleSearch}>
                  <input
                    className={`form-control search-input ${
                      theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
                    }`}
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </form>
              </div>
            )}
          </div>

          <div className="d-flex align-items-center gap-4 ms-3">
            <div className={`form-check form-switch ${textColorClass}`}>
              <input
                className="form-check-input"
                type="checkbox"
                id="themeSwitch"
                onChange={toggleTheme}
                checked={theme === "dark"}
              />
              <label className="form-check-label" htmlFor="themeSwitch">
                {theme === "dark" ? "Dark" : "Light"}
              </label>
            </div>
            <button
            onClick={changeLang}
            className="lang-switch-btn"
            >
            {text.lang}
            </button>
            {/* Auth Buttons */}
                <div className="buttons d-flex gap-2">
                {userState55 === "who know" ? (
                    <>
                    <Link to={"/Wishlist"} className={`fs-5 ${iconColorClass}`}>
                        <i className="fas fa-heart"></i>
                    </Link>
                    <Link to={"/Signin"}>
                        <button className={`btn btn-outline-${theme === "dark" ? "light" : "dark"} btn-md`}>
                        <i className="fas fa-user me-2"></i>Sign In
                        </button>
                    </Link>
                    <Link to={"/Register"}>
                        <button className={`btn btn-${theme === "dark" ? "light" : "dark"} btn-md`}>
                        <i className="fas fa-user-plus me-2"></i>Register
                        </button>
                    </Link>
                    </>
                ) : (
                    <>
                    <div className="icons d-flex gap-3">
                        <Link to={"/Wishlist"} className={`fs-5 ${iconColorClass}`}>
                        <i className="fas fa-heart"></i>
                        </Link>
                        <Link to={"/cart"} className={`fs-5 ${iconColorClass}`}>
                        <i className="fas fa-shopping-cart"></i>
                        </Link>
                    </div>
                    <Link>
                        <button
                        onClick={logout}
                        className={`btn btn-${theme === "dark" ? "light" : "dark"} btn-md`}
                        >
                        <i className="fas fa-sign-out-alt me-2"></i>Log out
                        </button>
                    </Link>
                    </>
                )}
                </div>
            </div>
            </div>
        </div>
        </nav>
    );
    }

export default Nav;