import React, { useEffect, useState, useContext } from "react";
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
import { setUserState, setLange } from "../../redux/reduxtoolkit";
import { ThemeContext } from "../../Context/ThemeContext";
import "./Nav.css";

function Nav() {
  const [activeTab, setActiveTab] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [wishlistCountFirestore, setWishlistCountFirestore] = useState(0);
  const [cartCount, setCartCount] = useState(0); // حالة لتخزين عدد العناصر في الكارت

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.UserData["UserState"]);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const wishlistRedux = useSelector((state) => state.wishlist.wishlist);
  const wishlistCount = wishlistRedux.length;

  const { theme, toggleTheme } = useContext(ThemeContext);
  const textColorClass = theme === "dark" ? "text-white" : "text-dark";
  const iconColorClass = theme === "dark" ? "text-white" : "text-dark";

  const changeLang = () => {
    dispatch(setLange(currentLange === "En" ? "Ar" : "En"));
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        dispatch(setUserState("who know"));
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.displayName) {
          getCurrentUserDataFireStore(user);
        } else {
          dispatch(
            setUserState({
              name: user.displayName,
              uid: user.uid,
              email: user.email,
            })
          );
        }
      } else {
        dispatch(setUserState("who know"));
      }
    });

    const getCurrentUserDataFireStore = async (user) => {
      if (!user) return;
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

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (userState && userState.uid && userState !== "who know") {
      const docRef = doc(db, "users2", userState.uid);

      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const allDishes = docSnap.data().allDishes || [];
            setWishlistCountFirestore(allDishes.length);
          } else {
            setWishlistCountFirestore(0);
          }
        },
        (error) => {
          console.error("Error fetching wishlist count from Firestore:", error);
        }
      );

      return () => unsubscribe();
    }
  }, [userState]);

  useEffect(() => {
    if (!userState?.uid) return;

    const docRef = doc(db, "users2", userState.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const cartItems = docSnap.data().cartItems || [];
          const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0); // حساب العدد الإجمالي
          setCartCount(totalItems);
        } else {
          setCartCount(0);
        }
      },
      (error) => {
        console.error("Error fetching cart count:", error);
      }
    );

    return () => unsubscribe();
  }, [userState]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`);
      setSearchTerm("");
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav
      className={`navbar h-10 navbar-expand-lg fixed-top ${
        theme === "dark" ? "bg-custom-dark navbar-dark" : "bg-light navbar-light"
      }`}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className={`navbar-brand text-3xl fw-bold ${textColorClass}`} to="/">
          <img
            src={theme === "dark" ? "/Images/logo dark-mood.svg" : "/Images/logo light-mood.svg"}
            style={{ width: "80px", height: "50px" }}
            alt="Logo"
          />
          TastyBites
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNavDropdown">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${activeTab === "Home" ? "active" : ""} ${textColorClass}`}
                onClick={() => setActiveTab("Home")}
              >
                {text?.home || (currentLange === "Ar" ? "الرئيسية" : "Home")}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/menu"
                className={`nav-link ${activeTab === "Menu" ? "active" : ""} ${textColorClass}`}
                onClick={() => setActiveTab("Menu")}
              >
                {text?.menu || (currentLange === "Ar" ? "القائمة" : "Menu")}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/reservation"
                className={`nav-link ${activeTab === "Reservation" ? "active" : ""} ${textColorClass}`}
                onClick={() => setActiveTab("Reservation")}
              >
                {text?.reservation || (currentLange === "Ar" ? "الحجز" : "Reservation")}
              </Link>
            </li>
            {userState !== "who know" && (
              <li className="nav-item">
                <Link
                  to="/my-reservations"
                  className={`nav-link ${activeTab === "My Reservations" ? "active" : ""} ${textColorClass}`}
                  onClick={() => setActiveTab("My Reservations")}
                >
                  {text?.myReservations || (currentLange === "Ar" ? "حجوزاتي" : "My Reservations")}
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link
                to="/ContactUs"
                className={`nav-link ${activeTab === "Contact Us" ? "active" : ""} ${textColorClass}`}
                onClick={() => setActiveTab("Contact Us")}
              >
                {text?.contactUs || (currentLange === "Ar" ? "اتصل بنا" : "Contact Us")}
              </Link>
            </li>
            {userState !== "who know" && (
              <li className="nav-item">
                <Link
                  to="/orders"
                  className={`nav-link ${activeTab === "My Orders" ? "active" : ""} ${textColorClass}`}
                  onClick={() => setActiveTab("My Orders")}
                >
                  {text?.myOrders || (currentLange === "Ar" ? "طلباتي" : "My Orders")}
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-4 ms-3">
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
                    placeholder={text?.search || (currentLange === "Ar" ? "بحث" : "Search")}
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </form>
              </div>
            )}

            <div className={`form-check form-switch ${textColorClass}`}>
              <input
                className="form-check-input"
                type="checkbox"
                id="themeSwitch"
                onChange={toggleTheme}
                checked={theme === "dark"}
              />
              <label className="form-check-label" htmlFor="themeSwitch">
                {theme === "dark"
                  ? text?.darkMode || (currentLange === "Ar" ? "الوضع المظلم" : "Dark")
                  : text?.lightMode || (currentLange === "Ar" ? "الوضع الفاتح" : "Light")}
              </label>
            </div>

            <button onClick={changeLang} className="lang-switch-btn">
              {text?.lang || (currentLange === "Ar" ? "English" : "العربية")}
            </button>

            <div className="buttons d-flex gap-2">
              {userState === "who know" ? (
                <>
                  <Link
                    to="/Wishlist"
                    className={`fs-5 position-relative ${
                      wishlistCount > 0 ? "text-danger" : iconColorClass
                    }`}
                  >
                    <i className="fas fa-heart"></i>
                    {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
                  </Link>
                  <Link to="/Signin">
                    <button
                      className={`btn btn-outline-${theme === "dark" ? "light" : "dark"} btn-md`}
                    >
                      <i className="fas fa-user me-2"></i>
                      {text?.signIn || (currentLange === "Ar" ? "تسجيل الدخول" : "Sign In")}
                    </button>
                  </Link>
                  <Link to="/Register">
                    <button className={`btn btn-${theme === "dark" ? "light" : "dark"} btn-md`}>
                      <i className="fas fa-user-plus me-2"></i>
                      {text?.register || (currentLange === "Ar" ? "التسجيل" : "Register")}
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="icons d-flex gap-3">
                    <Link
                      to="/Wishlist"
                      className={`fs-5 position-relative ${
                        wishlistCountFirestore > 0 ? "text-danger" : iconColorClass
                      }`}
                    >
                      <i className="fas fa-heart"></i>
                      {wishlistCountFirestore > 0 && (
                        <span className="wishlist-count">{wishlistCountFirestore}</span>
                      )}
                    </Link>
                    <Link to="/cart" className={`fs-5 position-relative ${iconColorClass}`}>
                      <i className="fas fa-shopping-cart"></i>
                      {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>
                  </div>
                  <button
                    onClick={logout}
                    className={`btn btn-${theme === "dark" ? "light" : "dark"} btn-md`}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    {text?.logout || (currentLange === "Ar" ? "تسجيل الخروج" : "Logout")}
                  </button>
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