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
  const [WishlistCountFirestore, setWishlistCountFirestore] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState55 = useSelector((state) => state.UserData["UserState"]);
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
        console.error(error);
      });
  };

  useEffect(() => {
    const authState = onAuthStateChanged(auth, (user) => {
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

    return () => authState();
  }, [dispatch]);

  useEffect(() => {
    if (userState55 && userState55.uid && userState55 !== "who know") {
      const docRef = doc(db, "users2", userState55.uid);

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
  }, [userState55]);

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
        <a className={`navbar-brand text-3xl fw-bold ${textColorClass}`} href="/">
          <img
            src={theme === "dark" ? "/Images/logo dark-mood.svg" : "/Images/logo light-mood.svg"}
            style={{ width: "80px", height: "50px" }}
            alt="Logo"
          />
          TastyBites
        </a>

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
            {["Home", "Menu", "Reservation", "Contact Us"].map((tab) => (
              <li className="nav-item" key={tab}>
                <Link
                  to={`/${tab === "Home" ? "" : tab.replace(" ", "").toLowerCase()}`}
                  className={`nav-link ${activeTab === tab ? "active" : ""} ${textColorClass}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Link>
              </li>
            ))}
            {userState55 !== "who know" && (
              <li className="nav-item">
                <Link
                  to="/orders"
                  className={`nav-link ${activeTab === "My Orders" ? "active" : ""} ${textColorClass}`}
                  onClick={() => setActiveTab("My Orders")}
                >
                  My Orders
                </Link>
              </li>
            )}
          </ul>

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

            <button onClick={changeLang} className="lang-switch-btn">
              {text.lang}
            </button>

            <div className="buttons d-flex gap-2">
              {userState55 === "who know" ? (
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
                      {text.signIn}
                    </button>
                  </Link>
                  <Link to="/Register">
                    <button
                      className={`btn btn-${theme === "dark" ? "light" : "dark"} btn-md`}
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      {text.register}
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="icons d-flex gap-3">
                    <Link
                      to="/Wishlist"
                      className={`fs-5 position-relative ${
                        WishlistCountFirestore > 0 ? "text-danger" : iconColorClass
                      }`}
                    >
                      <i className="fas fa-heart"></i>
                      {WishlistCountFirestore > 0 && (
                        <span className="wishlist-count">{WishlistCountFirestore}</span>
                      )}
                    </Link>
                    <Link to="/cart" className={`fs-5 ${iconColorClass}`}>
                      <i className="fas fa-shopping-cart"></i>
                    </Link>
                  </div>
                  <Link>
                    <button
                      onClick={logout}
                      className={`btn btn-${theme === "dark" ? "light" : "dark"} btn-md`}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      {text.logout}
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