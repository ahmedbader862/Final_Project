import React, { useState, useEffect } from "react";
import { Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  auth,
  db,
  storage,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  arrayUnion,
  getDoc,
  query,
  where,
  addDoc,
  setDoc,
  signOut, // Import signOut from Firebase
} from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Chat from '../../Components/Chat_Box/chat';
import './AdminDashboard.css';
import StatsSection from "../AdminOrder/StatsSection";
import ChartsSection from "../AdminOrder/ChartsSection";
import OrdersList from "../AdminOrder/OrdersList";
import RefundMessage from "../AdminOrder/RefundMessage";
import CategorySelector from "../AdminControl/CategorySelector";
import MenuItemCard from "../AdminControl/MenuItemCard";
import ItemModal from "../AdminControl/ItemModal";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// AdminOrdersPage, AdminPanel, AdminChat components remain unchanged
// [Insert AdminOrdersPage, AdminPanel, AdminChat code here as in your original file]

// Main Dashboard Component
const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email === "admin@gmail.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate("/signin");
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        navigate("/signin"); // Redirect to signin page if not logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/signin"); // Redirect to signin page after logout
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out: " + error.message);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar p-0">
          <div className="sidebar-content">
            <h3>Admin Dashboard</h3>
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink to="/admin/orders" className="nav-link">
                  Orders
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/menu" className="nav-link">
                  Menu
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/chat" className="nav-link">
                  Chat
                </NavLink>
              </li>
              {/* Add Logout Button */}
              <li className="nav-item mt-3">
                <Button variant="danger" onClick={handleLogout} className="w-100">
                  Logout
                </Button>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={10} className="main-content p-4">
          <Routes>
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="menu" element={<AdminPanel />} />
            <Route path="chat" element={<AdminChat />} />
            <Route path="/" element={<AdminOrdersPage />} />
            <Route path="*" element={<div>Route not found: {location.pathname}</div>} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

// [Insert AdminOrdersPage, AdminPanel, AdminChat code here as in your original file]
const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [refundMessage, setRefundMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (error) => console.error("Error fetching orders:", error)
    );
    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderData = (await getDoc(orderRef)).data();
      await updateDoc(orderRef, { status: newStatus });

      if (newStatus === "accepted" && orderData.userId) {
        await updateDoc(doc(db, "users2", orderData.userId), {
          acceptedOrders: arrayUnion({
            orderId,
            ...orderData,
            trackingStatus: orderData.trackingStatus || "Order Placed",
          }),
        });
        Swal.fire("Success!", `Order ${orderId} accepted`, "success");
      } else if (newStatus === "rejected") {
        setRefundMessage(`Order #${orderId}: Refunding soon (if PayPal).`);
        setTimeout(() => setRefundMessage(null), 5000);
      }
    } catch (error) {
      Swal.fire("Error!", `Failed to update order: ${error.message}`, "error");
    }
  };

  const updateTrackingStatus = (orderId, newTrackingStatus) =>
    updateDoc(doc(db, "orders", orderId), { trackingStatus: newTrackingStatus });

  const deleteOrder = (orderId) =>
    Swal.fire({
      title: "Are you sure?",
      text: `Delete Order #${orderId}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "orders", orderId));
        Swal.fire("Deleted!", `Order #${orderId} deleted`, "success");
      }
    });

  const clearAllOrders = () =>
    Swal.fire({
      title: "Delete all orders?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete all!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const snapshot = await getDocs(collection(db, "orders"));
        await Promise.all(snapshot.docs.map((doc) => deleteDoc(doc.ref)));
        Swal.fire("Deleted!", "All orders cleared", "success");
      }
    });

  const getChartData = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .reduce((sum, order) => sum + parseFloat(order.total.replace(" LE", "")), 0)
      .toFixed(2);
    const statusBreakdown = {
      pending: orders.filter((o) => o.status === "pending").length,
      accepted: orders.filter((o) => o.status === "accepted").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
    };
    const paymentBreakdown = {
      cod: orders.filter((o) => o.paymentMethod === "cash_on_delivery").length,
      paid: orders.filter((o) => o.paymentMethod === "paypal").length,
    };
    const ordersByDate = orders.reduce((acc, o) => {
      const date = new Date(o.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
      pendingOrders: statusBreakdown.pending,
      lineChartData: {
        labels: Object.keys(ordersByDate),
        datasets: [
          { label: "Orders Over Time", data: Object.values(ordersByDate), borderColor: "#4A919E", tension: 0.1 },
        ],
      },
      statusPieChartData: {
        labels: ["Pending", "Accepted", "Rejected"],
        datasets: [
          {
            data: [statusBreakdown.pending, statusBreakdown.accepted, statusBreakdown.rejected],
            backgroundColor: ["#D4A017", "#4A919E", "#B73E3E"],
            borderColor: ["#E0B02A", "#5AA5B2", "#C94E4E"],
            borderWidth: 1,
          },
        ],
      },
      paymentPieChartData: {
        labels: ["Cash on Delivery", "Paid (PayPal)"],
        datasets: [
          {
            data: [paymentBreakdown.cod, paymentBreakdown.paid],
            backgroundColor: ["#4A919E", "#3A6D8C"],
            borderColor: ["#5AA5B2", "#4A7D9C"],
            borderWidth: 1,
          },
        ],
      },
    };
  };

  const { totalOrders, totalRevenue, avgOrderValue, pendingOrders, lineChartData, statusPieChartData, paymentPieChartData } = getChartData();

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="text-white">Orders Management</h2>
        {orders.length > 0 && (
          <Button className="btn btn-danger btn-sm" onClick={clearAllOrders}>
            Clear All Orders
          </Button>
        )}
      </div>
      <RefundMessage message={refundMessage} />
      <StatsSection totalOrders={totalOrders} totalRevenue={totalRevenue} avgOrderValue={avgOrderValue} pendingOrders={pendingOrders} />
      {orders.length > 0 && (
        <>
          <ChartsSection lineChartData={lineChartData} statusPieChartData={statusPieChartData} paymentPieChartData={paymentPieChartData} />
          <OrdersList orders={orders} updateStatus={updateStatus} updateTrackingStatus={updateTrackingStatus} deleteOrder={deleteOrder} />
        </>
      )}
      {orders.length === 0 && <p>No orders found.</p>}
    </div>
  );
};

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ id: "", title: "", description: "", price: "", image: "", imageFile: null });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    getDocs(collection(db, "menu"))
      .then((snapshot) => {
        const loadedCategories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCategories(loadedCategories);
        setSelectedCategory(loadedCategories[0]?.id);
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
        toast.error("Failed to load categories");
      });
  }, [user]);

  useEffect(() => {
    if (!selectedCategory) return;
    const unsubscribe = onSnapshot(
      collection(db, `menu/${selectedCategory}/items`),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
        setMenuItems(items);
      },
      (error) => {
        console.error("Error fetching menu items:", error);
        toast.error("Failed to load menu items");
      }
    );
    return unsubscribe;
  }, [selectedCategory]);

  const uploadImageToStorage = async (file) => {
    if (!file) return null;
    try {
      const sanitizedFileName = file.name.replace(/\s+/g, "_");
      const storageRef = ref(storage, `menu/${selectedCategory}/items/image/${Date.now()}_${sanitizedFileName}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Failed to upload image: ${error.message}`);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.image;
    try {
      if (formData.imageFile) imageUrl = await uploadImageToStorage(formData.imageFile);
      const itemData = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        image: imageUrl || "",
      };
      if (showModal === "add") {
        await addDoc(collection(db, `menu/${selectedCategory}/items`), itemData);
        toast.success("Item added!");
      } else if (showModal === "edit") {
        const docRef = doc(db, `menu/${selectedCategory}/items`, selectedItem.docId);
        await updateDoc(docRef, itemData);
        toast.success("Item updated!");
      }
      setShowModal(null);
      setFormData({ id: "", title: "", description: "", price: "", image: "", imageFile: null });
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error(`Error saving item: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, `menu/${selectedCategory}/items`, selectedItem.docId);
      await deleteDoc(docRef);
      toast.success("Item deleted!");
      setShowModal(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(`Error deleting item: ${error.message}`);
    }
  };

  const handleAddCategory = async () => {
    const newCategory = formData.title;
    if (!newCategory) return;
    try {
      await setDoc(doc(db, "menu", newCategory), { name: newCategory });
      toast.success("Category added!");
      setShowModal(null);
      setFormData({ id: "", title: "", description: "", price: "", image: "", imageFile: null });
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category");
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      id: item.id || "",
      title: item.title || "",
      description: item.description || "",
      price: item.price || "",
      image: item.image || "",
      imageFile: null,
    });
    setShowModal("edit");
  };

  if (!user) return <p>Please log in.</p>;

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col md={12} className="p-4">
          <CategorySelector categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          <Button
            onClick={() => {
              setFormData({ id: "", title: "", description: "", price: "", image: "", imageFile: null });
              setShowModal("add");
            }}
            className="mb-4"
          >
            Add Item
          </Button>
          <Row>
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.docId}
                item={item}
                openEditModal={openEditModal}
                setSelectedItem={setSelectedItem}
                setShowModal={setShowModal}
              />
            ))}
          </Row>
        </Col>
      </Row>
      <ItemModal
        showModal={showModal}
        setShowModal={setShowModal}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        handleAddCategory={handleAddCategory}
        selectedItem={selectedItem}
      />
    </Container>
  );
};

const AdminChat = () => {
  const userState55 = useSelector((state) => state.UserData["UserState"]);
  const [alluser, setAllUser] = useState([]);
  const [userName, setUserName] = useState("");
  const [userUID, setUserUID] = useState("");
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const getAllUsers = async () => {
      const q = query(collection(db, "users2"), where("uid", "!=", userState55.uid));
      const querySnapshot = await getDocs(q);
      const docsData = [];
      querySnapshot.forEach((doc) => {
        docsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setAllUser(docsData);
    };
    getAllUsers();
  }, [userState55.uid]);

  const handleUserData = (user) => {
    setUserName(user.name);
    setUserUID(user.uid);
    setShowChat(true);
  };

  return (
    <div className="row mt-4">
      <div className="col-md-3 sidebar w-20 ">
        {alluser.map((user) => (
          <div className="user-card" key={user.id} onClick={() => handleUserData(user)}>
            <h2>{user.name}</h2>
          </div>
        ))}
      </div>
      {showChat ? (
        <Chat userName={userName} uidChats={userUID} showChat={showChat} />
      ) : (
        <p>Please select a user to start chatting.</p>
      )}
    </div>
  );
};

export default AdminDashboard;