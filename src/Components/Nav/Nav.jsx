import React, { useEffect, useState } from "react";
import "./Nav.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth, signOut, onAuthStateChanged, collection, query, db, where, getDocs } from "../../firebase/firebase";
import { setUserState } from "../../redux/reduxtoolkit";

function Nav() {
    const [activeTab, setActiveTab] = useState("Home");
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const userState55 = useSelector((state) => state.UserData['UserState']);

    const logout = () => {
        signOut(auth).then(() => {
            console.log("%%%%%%%%%% user log out ");
            dispatch(setUserState("who know"));
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        const authState = onAuthStateChanged(auth, (user) => {
            if (user?.displayName == null) {
                getCurrentUserDataFireStore(user);
            }

            if (user) {
                dispatch(setUserState({
                    name: user.displayName,
                    uid: user.uid,
                    email: user.email,
                }));
            } else {
                dispatch(setUserState("who know"));
            }
        });

        const getCurrentUserDataFireStore = async (user) => {
            const q = query(collection(db, "users2"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
    
            querySnapshot.forEach((doc) => {
                dispatch(setUserState({
                    name: doc.data().name,
                    uid: user.uid,
                    email: user.email,
                }));
            });     
        };

        return () => authState();
    }, [dispatch]);

    return (
        <nav className="navbar h-10 navbar-expand-lg fixed-top">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* Brand Logo */}
                <a className="navbar-brand text-3xl text-white fw-bold" href="/">
                    TastyBites
                </a>

                {/* Toggle Button for Mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links */}
                <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNavDropdown">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link 
                                to={"/"} 
                                className={`nav-link ${activeTab === "Home" ? "active" : ""}`} 
                                onClick={() => setActiveTab("Home")}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${activeTab === "Menu" ? "active" : ""}`} 
                                to="/menu" 
                                onClick={() => setActiveTab("Menu")}
                            >
                                Menu
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${activeTab === "Reservation" ? "active" : ""}`} 
                                to="/reservation" 
                                onClick={() => setActiveTab("Reservation")}
                            >
                                Reservation
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${activeTab === "Contact Us" ? "active" : ""}`} 
                                to="/contactus" 
                                onClick={() => setActiveTab("Contact Us")}
                            >
                                Contact Us
                            </Link>
                        </li>
                        {userState55 !== "who know" && (
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${activeTab === "Track Order" ? "active" : ""}`} 
                                    to="/track-order" 
                                    onClick={() => setActiveTab("Track Order")}
                                >
                                    Track Order
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex align-items-center gap-4">
                        <div className="buttons d-flex gap-2">
                            {userState55 === "who know" ? (
                                <>
                                    <Link to={"/Wishlist"} className="text-white fs-5">
                                        <i className="fas fa-heart"></i>
                                    </Link>
                                    <Link to={"/Signin"}>
                                        <button className="btn btn-outline-light btn-md">
                                            <i className="fas fa-user me-2"></i>Sign In
                                        </button>
                                    </Link>
                                    <Link to={"/Register"}>
                                        <button className="btn btn-light btn-md">
                                            <i className="fas fa-user-plus me-2"></i>Register
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="icons d-flex gap-3">
                                        <Link to={"/Wishlist"} className="text-white fs-5">
                                            <i className="fas fa-heart"></i>
                                        </Link>
                                        <Link to={"/cart"} className="text-white fs-5">
                                            <i className="fas fa-shopping-cart"></i>
                                        </Link>
                                    </div>
                                    <Link>
                                        <button 
                                            onClick={logout} 
                                            className="btn btn-light btn-md"
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
