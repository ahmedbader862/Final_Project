import React, { useState, useEffect, useContext } from "react";
import { Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Dropdown } from "react-bootstrap";
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
  signOut,
} from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
setLange
import Chat from '../../Components/Chat_Box/chat';
import './AdminDashboard.css';
import StatsSection from "../AdminOrder/StatsSection";
import ChartsSection from "../AdminOrder/ChartsSection";
import OrdersList from "../AdminOrder/OrdersList";
import RefundMessage from "../AdminOrder/RefundMessage";
import MenuItemCard from "../AdminControl/MenuItemCard";
import ItemModal from "../AdminControl/ItemModal";
import { ThemeContext } from "../../Context/ThemeContext";
import { setLange } from "../../redux/reduxtoolkit";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// CategorySelector Component
const CategorySelector = ({ categories, selectedCategory, setSelectedCategory, setShowModal, setFormData }) => {
  const { theme } = useContext(ThemeContext);
  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div className="d-flex align-items-center gap-3">
        <h2 className={`d-inline me-3 ${textColor}`}>
          {text?.menuManagement || (currentLange === "Ar" ? "إدارة القائمة" : "Menu Management")}
        </h2>
        <Dropdown>
          <Dropdown.Toggle variant="outline-light" id="categoryDropdown">
            {categories.find(cat => cat.id === selectedCategory)?.name || 
             text?.selectCategory || (currentLange === "Ar" ? "اختر فئة" : "Select Category")}
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-dark">
            {categories.map(cat => (
              <Dropdown.Item key={cat.id} onClick={() => setSelectedCategory(cat.id)}>
                {(currentLange === "Ar" && cat.category_ar) ? cat.category_ar : cat.name || cat.id}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {/* Commented out Add Category button as per provided code */}
      {/* <Button
        variant="success"
        onClick={() => {
          setFormData({ title: "", description: "", desc_ar: "", category: "", category_ar: "", price: "", image: "", imageFile: null });
          setShowModal("addCategory");
        }}
      >
        {text?.addCategory || (currentLange === "Ar" ? "إضافة فئة" : "Add Category")}
      </Button> */}
    </div>
  );
};

// AdminDashboard Component
const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const bgColor = theme === "dark" ? "bg-dark" : "bg-light";
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

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
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success(text?.logoutSuccess || (currentLange === "Ar" ? "تم تسجيل الخروج بنجاح!" : "Logged out successfully!"));
      navigate("/signin");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(
        text?.logoutFailed?.replace("{error}", error.message) ||
        (currentLange === "Ar" ? `فشل في تسجيل الخروج: ${error.message}` : `Failed to log out: ${error.message}`)
      );
    }
  };

  const handleToggleLanguage = () => {
    dispatch(setLange(currentLange === "En" ? "Ar" : "En"));
  };

  if (!user) {
    return <p className={textColor}>{text?.loading || (currentLange === "Ar" ? "جارٍ التحميل..." : "Loading...")}</p>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Container fluid className={bgColor}>
      <Row>
        <Col md={2} className="sidebar p-0">
          <div className="sidebar-content">
            <h3 className={textColor}>
              {text?.adminDashboard || (currentLange === "Ar" ? "لوحة تحكم الإدارة" : "Admin Dashboard")}
            </h3>
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink to="/admin/orders" className="nav-link">
                  {text?.orders || (currentLange === "Ar" ? "الطلبات" : "Orders")}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/reservations" className="nav-link">
                  {text?.reservations || (currentLange === "Ar" ? "الحجوزات" : "Reservations")}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/menu" className="nav-link">
                  {text?.menu || (currentLange === "Ar" ? "القائمة" : "Menu")}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/chat" className="nav-link">
                  {text?.chat || (currentLange === "Ar" ? "الدردشة" : "Chat")}
                </NavLink>
              </li>
              <li className="nav-item mt-3">
                <Button variant="danger" onClick={handleLogout} className="w-100">
                  {text?.logout || (currentLange === "Ar" ? "تسجيل الخروج" : "Logout")}
                </Button>
              </li>
              <li className="nav-item mt-2">
                <Button
                  variant="secondary"
                  onClick={handleToggleLanguage}
                  className="w-100"
                >
                  {text?.toggleLanguage || (currentLange === "Ar" ? "الإنجليزية" : "Arabic")}
                </Button>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={10} className="main-content p-4">
          <Routes>
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="reservations" element={<AdminReservationsPage />} />
            <Route path="menu" element={<AdminPanel />} />
            <Route path="chat" element={<AdminChat />} />
            <Route path="/" element={<AdminOrdersPage />} />
            <Route path="*" element={
              <div className={textColor}>
                {text?.routeNotFound?.replace("{pathname}", location.pathname) ||
                (currentLange === "Ar" ? `المسار غير موجود: ${location.pathname}` : `Route not found: ${location.pathname}`)}
              </div>
            } />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

// AdminOrdersPage Component
const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [refundMessage, setRefundMessage] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const { theme } = useContext(ThemeContext);
  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(fetchedOrders);
        applyFilters(fetchedOrders, sortOrder, statusFilter, paymentFilter);
      },
      (error) => console.error("Error fetching orders:", error)
    );
    return () => unsubscribe();
  }, []);

  const applyFilters = (ordersToFilter, sort, status, payment) => {
    let filtered = [...ordersToFilter];

    if (status !== "all") {
      filtered = filtered.filter(order => order.status === status);
    }

    if (payment !== "all") {
      filtered = filtered.filter(order => order.paymentMethod === payment);
    }

    filtered.sort((a, b) => {
      const dateA = a.timestamp?.seconds ? a.timestamp.toDate() : new Date(a.timestamp);
      const dateB = b.timestamp?.seconds ? b.timestamp.toDate() : new Date(b.timestamp);
      return sort === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(filtered);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    applyFilters(orders, newSortOrder, statusFilter, paymentFilter);
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    applyFilters(orders, sortOrder, newStatus, paymentFilter);
  };

  const handlePaymentFilterChange = (newPayment) => {
    setPaymentFilter(newPayment);
    applyFilters(orders, sortOrder, statusFilter, newPayment);
  };

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
        Swal.fire(
          text?.success || (currentLange === "Ar" ? "نجاح!" : "Success!"),
          text?.orderAccepted?.replace("{orderId}", orderId) ||
          (currentLange === "Ar" ? `تم قبول الطلب #${orderId}` : `Order #${orderId} accepted`),
          "success"
        );
      } else if (newStatus === "rejected") {
        setRefundMessage(
          text?.refundMessage?.replace("{orderId}", orderId) ||
          (currentLange === "Ar" ? `الطلب #${orderId}: سيتم الاسترداد قريبًا (إذا كان باي بال).` : `Order #${orderId}: Refunding soon (if PayPal).`)
        );
        setTimeout(() => setRefundMessage(null), 5000);
      }
    } catch (error) {
      Swal.fire(
        text?.error || (currentLange === "Ar" ? "خطأ!" : "Error!"),
        text?.orderUpdateFailed?.replace("{error}", error.message) ||
        (currentLange === "Ar" ? `فشل في تحديث الطلب: ${error.message}` : `Failed to update order: ${error.message}`),
        "error"
      );
    }
  };

  const updateTrackingStatus = (orderId, newTrackingStatus) =>
    updateDoc(doc(db, "orders", orderId), { trackingStatus: newTrackingStatus });

  const deleteOrder = (orderId) =>
    Swal.fire({
      title: text?.deleteOrderConfirmTitle || (currentLange === "Ar" ? "هل أنت متأكد؟" : "Are you sure?"),
      text: text?.deleteOrderConfirmText?.replace("{orderId}", orderId) ||
            (currentLange === "Ar" ? `حذف الطلب #${orderId}؟` : `Delete Order #${orderId}?`),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: text?.deleteOrderConfirmButton || (currentLange === "Ar" ? "نعم، احذف!" : "Yes, delete!"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "orders", orderId));
        Swal.fire(
          text?.deleteOrderSuccessTitle || (currentLange === "Ar" ? "تم الحذف!" : "Deleted!"),
          text?.deleteOrderSuccessMessage?.replace("{orderId}", orderId) ||
          (currentLange === "Ar" ? `تم حذف الطلب #${orderId}` : `Order #${orderId} deleted`),
          "success"
        );
      }
    });

  const clearAllOrders = () =>
    Swal.fire({
      title: text?.clearAllOrdersConfirmTitle || (currentLange === "Ar" ? "حذف جميع الطلبات؟" : "Delete all orders?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: text?.clearAllOrdersConfirmButton || (currentLange === "Ar" ? "نعم، احذف الكل!" : "Yes, delete all!"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        const snapshot = await getDocs(collection(db, "orders"));
        await Promise.all(snapshot.docs.map((doc) => deleteDoc(doc.ref)));
        Swal.fire(
          text?.clearAllOrdersSuccessTitle || (currentLange === "Ar" ? "تم الحذف!" : "Deleted!"),
          text?.clearAllOrdersSuccessMessage || (currentLange === "Ar" ? "تم مسح جميع الطلبات" : "All orders cleared"),
          "success"
        );
      }
    });

  const getChartData = (ordersData) => {
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData
      .reduce((sum, order) => {
        if (typeof order.total !== 'number') {
          console.warn(`Invalid total for order ${order.id}:`, order.total);
          return sum;
        }
        return sum + order.total;
      }, 0)
      .toFixed(2);

    const statusBreakdown = {
      pending: ordersData.filter((o) => o.status === "pending").length,
      accepted: ordersData.filter((o) => o.status === "accepted").length,
      rejected: ordersData.filter((o) => o.status === "rejected").length,
    };
    const paymentBreakdown = {
      cod: ordersData.filter((o) => o.paymentMethod === "cash_on_delivery").length,
      paid: ordersData.filter((o) => o.paymentMethod === "paypal").length,
    };
    const ordersByDate = ordersData.reduce((acc, o) => {
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
          { label: text?.ordersOverTime || (currentLange === "Ar" ? "الطلبات بمرور الوقت" : "Orders Over Time"), data: Object.values(ordersByDate), borderColor: "#4A919E", tension: 0.1 },
        ],
      },
      statusPieChartData: {
        labels: [
          text?.statusPending || (currentLange === "Ar" ? "معلق" : "Pending"),
          text?.statusAccepted || (currentLange === "Ar" ? "مقبول" : "Accepted"),
          text?.statusRejected || (currentLange === "Ar" ? "مرفوض" : "Rejected")
        ],
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
        labels: [
          text?.paymentCod || (currentLange === "Ar" ? "الدفع عند الاستلام" : "Cash on Delivery"),
          text?.paymentPaypal || (currentLange === "Ar" ? "باي بال" : "Paid (PayPal)")
        ],
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

  const { totalOrders, totalRevenue, avgOrderValue, pendingOrders, lineChartData, statusPieChartData, paymentPieChartData } = getChartData(filteredOrders);

  const filterKey = `${sortOrder}-${statusFilter}-${paymentFilter}`;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4 align-items-center flex-wrap">
        <h2 className={textColor}>
          {text?.ordersManagement || (currentLange === "Ar" ? "إدارة الطلبات" : "Orders Management")}
        </h2>
        {/* Clear All Orders button commented out as per original code */}
      </div>
      <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
        <div className="dropdown">
          <button
            className="btn btn-outline-light dropdown-toggle"
            type="button"
            id="sortDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {text?.sort || (currentLange === "Ar" ? "ترتيب:" : "Sort:")}{" "}
            {sortOrder === "newest"
              ? text?.sortNewest || (currentLange === "Ar" ? "الأحدث أولاً" : "Newest First")
              : text?.sortOldest || (currentLange === "Ar" ? "الأقدم أولاً" : "Oldest First")}
          </button>
          <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="sortDropdown">
            <li>
              <button className="dropdown-item" onClick={() => handleSortChange("newest")}>
                {text?.sortNewest || (currentLange === "Ar" ? "الأحدث أولاً" : "Newest First")}
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => handleSortChange("oldest")}>
                {text?.sortOldest || (currentLange === "Ar" ? "الأقدم أولاً" : "Oldest First")}
              </button>
            </li>
          </ul>
        </div>

        <div className="dropdown">
          <button
            className="btn btn-outline-light dropdown-toggle"
            type="button"
            id="statusDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {text?.status || (currentLange === "Ar" ? "الحالة:" : "Status:")}{" "}
            {statusFilter === "all"
              ? text?.statusAll || (currentLange === "Ar" ? "الكل" : "All")
              : text?.[`status${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`] ||
                (currentLange === "Ar"
                  ? statusFilter === "pending" ? "معلق" : statusFilter === "accepted" ? "مقبول" : "مرفوض"
                  : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1))}
          </button>
          <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="statusDropdown">
            <li>
              <button className="dropdown-item" onClick={() => handleStatusFilterChange("all")}>
                {text?.statusAll || (currentLange === "Ar" ? "الكل" : "All")}
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => handleStatusFilterChange("pending")}>
                {text?.statusPending || (currentLange === "Ar" ? "معلق" : "Pending")}
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => handleStatusFilterChange("accepted")}>
                {text?.statusAccepted || (currentLange === "Ar" ? "مقبول" : "Accepted")}
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => handleStatusFilterChange("rejected")}>
                {text?.statusRejected || (currentLange === "Ar" ? "مرفوض" : "Rejected")}
              </button>
            </li>
          </ul>
        </div>

        <div className="dropdown">
          <button
            className="btn btn-outline-light dropdown-toggle"
            type="button"
            id="paymentDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {text?.payment || (currentLange === "Ar" ? "الدفع:" : "Payment:")}{" "}
            {paymentFilter === "all"
              ? text?.paymentAll || (currentLange === "Ar" ? "الكل" : "All")
              : paymentFilter === "cash_on_delivery"
              ? text?.paymentCod || (currentLange === "Ar" ? "الدفع عند الاستلام" : "Cash on Delivery")
              : text?.paymentPaypal || (currentLange === "Ar" ? "باي بال" : "PayPal")}
          </button>
          <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="paymentDropdown">
            <li>
              <button className="dropdown-item" onClick={() => handlePaymentFilterChange("all")}>
                {text?.paymentAll || (currentLange === "Ar" ? "الكل" : "All")}
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => handlePaymentFilterChange("cash_on_delivery")}>
                {text?.paymentCod || (currentLange === "Ar" ? "الدفع عند الاستلام" : "Cash on Delivery")}
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => handlePaymentFilterChange("paypal")}>
                {text?.paymentPaypal || (currentLange === "Ar" ? "باي بال" : "PayPal")}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <RefundMessage message={refundMessage} />
      <StatsSection totalOrders={totalOrders} totalRevenue={totalRevenue} avgOrderValue={avgOrderValue} pendingOrders={pendingOrders} />
      {filteredOrders.length > 0 && (
        <>
          <ChartsSection lineChartData={lineChartData} statusPieChartData={statusPieChartData} paymentPieChartData={paymentPieChartData} />
          <OrdersList 
            key={filterKey}
            orders={filteredOrders} 
            updateStatus={updateStatus} 
            updateTrackingStatus={updateTrackingStatus} 
            deleteOrder={deleteOrder} 
          />
        </>
      )}
      {filteredOrders.length === 0 && (
        <p className={textColor}>
          {text?.noOrdersFiltered || (currentLange === "Ar" ? "لا توجد طلبات تطابق الفلاتر المحددة." : "No orders match the selected filters.")}
        </p>
      )}
    </div>
  );
};

// AdminReservationsPage Component
const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 6;
  const { theme } = useContext(ThemeContext);
  const textColor = theme === "dark" ? "text-white" : "text-dark";
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "reservations"),
      (snapshot) => {
        const fetchedReservations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReservations(fetchedReservations);
        setCurrentPage(1);
      },
      (error) => {
        console.error("Error fetching reservations:", error);
        Swal.fire(
          text?.refreshErrorTitle || (currentLange === "Ar" ? "خطأ!" : "Error!"),
          text?.refreshErrorMessage?.replace("{error}", error.message) ||
          (currentLange === "Ar" ? `فشل في جلب الحجوزات: ${error.message}` : `Failed to fetch reservations: ${error.message}`),
          "error"
        );
      }
    );
    return () => unsubscribe();
  }, [text, currentLange]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#D4A017";
      case "accepted":
        return "#4A919E";
      case "rejected":
        return "#B73E3E";
      default:
        return "#ffffff";
    }
  };

  const updateStatus = async (reservationId, newStatus) => {
    try {
      const docId = String(reservationId);
      if (!docId) {
        throw new Error("Invalid reservation ID");
      }

      const reservationRef = doc(db, "reservations", docId);
      const docSnap = await getDoc(reservationRef);
      if (!docSnap.exists()) {
        setReservations((prevReservations) =>
          prevReservations.filter((res) => res.id !== docId)
        );
        throw new Error(`Reservation with ID ${docId} does not exist. It may have been deleted.`);
      }

      await updateDoc(reservationRef, { status: newStatus });
      Swal.fire(
        text?.refreshSuccessTitle || (currentLange === "Ar" ? "نجاح!" : "Success!"),
        text?.reservationStatusSuccess
          ?.replace("{reservationId}", docId)
          ?.replace("{status}", newStatus) ||
        (currentLange === "Ar" ? `تم تحديث الحجز #${docId} إلى ${newStatus}` : `Reservation #${docId} ${newStatus}`),
        "success"
      );
    } catch (error) {
      Swal.fire(
        text?.refreshErrorTitle || (currentLange === "Ar" ? "خطأ!" : "Error!"),
        text?.reservationStatusError?.replace("{error}", error.message) ||
        (currentLange === "Ar" ? `فشل في تحديث الحجز: ${error.message}` : `Failed to update reservation: ${error.message}`),
        "error"
      );
    }
  };

  const deleteReservation = (reservationId) =>
    Swal.fire({
      title: text?.deleteReservationConfirmTitle || (currentLange === "Ar" ? "هل أنت متأكد؟" : "Are you sure?"),
      text: text?.deleteReservationConfirmText?.replace("{reservationId}", reservationId) ||
            (currentLange === "Ar" ? `حذف الحجز #${reservationId}؟` : `Delete Reservation #${reservationId}?`),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: text?.deleteReservationConfirmButton || (currentLange === "Ar" ? "نعم، احذف!" : "Yes, delete!"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "reservations", reservationId));
        Swal.fire(
          text?.deleteReservationSuccessTitle || (currentLange === "Ar" ? "تم الحذف!" : "Deleted!"),
          text?.deleteReservationSuccessMessage?.replace("{reservationId}", reservationId) ||
          (currentLange === "Ar" ? `تم حذف الحجز #${reservationId}` : `Reservation #${reservationId} deleted`),
          "success"
        );
      }
    });

  const handleRefresh = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reservations"));
      const fetchedReservations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReservations(fetchedReservations);
      setCurrentPage(1);
      Swal.fire(
        text?.refreshSuccessTitle || (currentLange === "Ar" ? "نجاح!" : "Success!"),
        text?.refreshSuccessMessage || (currentLange === "Ar" ? "تم تحديث الحجوزات بنجاح" : "Reservations refreshed successfully"),
        "success"
      );
    } catch (error) {
      console.error("Error refreshing reservations:", error);
      Swal.fire(
        text?.refreshErrorTitle || (currentLange === "Ar" ? "خطأ!" : "Error!"),
        text?.refreshErrorMessage?.replace("{error}", error.message) ||
        (currentLange === "Ar" ? `فشل في جلب الحجوزات: ${error.message}` : `Failed to fetch reservations: ${error.message}`),
        "error"
      );
    }
  };

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);
  const totalPages = Math.ceil(reservations.length / reservationsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4 align-items-center flex-wrap">
        <h2 className={textColor}>
          {text?.reservationsManagement || (currentLange === "Ar" ? "إدارة الحجوزات" : "Reservations Management")}
        </h2>
        <Button variant="primary" onClick={handleRefresh}>
          {text?.refreshReservations || (currentLange === "Ar" ? "تحديث الحجوزات" : "Refresh Reservations")}
        </Button>
      </div>

      {reservations.length > 0 ? (
        <>
          <Row>
            {currentReservations.map((reservation) => (
              <Col md={6} lg={4} className="mb-4" key={reservation.id}>
                <Card className="bg-dark text-white border-0 shadow">
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      <span>
                        {text?.reservationTitle?.replace("{reservationId}", reservation.reservationId || reservation.id || "Unknown") ||
                        (currentLange === "Ar" ? `الحجز #${reservation.reservationId || reservation.id || "غير معروف"}` : `Reservation #${reservation.reservationId || reservation.id || "Unknown"}`)}
                      </span>
                      <span
                        style={{
                          color: getStatusColor(reservation.status),
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {reservation.status || "pending"}
                      </span>
                    </Card.Title>
                    <Card.Text>
                      <strong>{text?.tableId || (currentLange === "Ar" ? "معرف الطاولة:" : "Table ID:")}</strong> {reservation.tableId || "N/A"} <br />
                      <strong>{text?.name || (currentLange === "Ar" ? "الاسم:" : "Name:")}</strong> {reservation.name || "N/A"} <br />
                      <strong>{text?.date || (currentLange === "Ar" ? "التاريخ:" : "Date:")}</strong>{" "}
                      {reservation.date
                        ? new Date(reservation.date).toLocaleString()
                        : "N/A"}{" "}
                      <br />
                      <strong>{text?.numPersons || (currentLange === "Ar" ? "عدد الأشخاص:" : "Number of Persons:")}</strong>{" "}
                      {reservation.numPersons || "N/A"} <br />
                      <strong>{text?.timeArriving || (currentLange === "Ar" ? "وقت الوصول:" : "Time Arriving:")}</strong> {reservation.timeArriving || "N/A"} <br />
                      <strong>{text?.timeLeaving || (currentLange === "Ar" ? "وقت المغادرة:" : "Time Leaving:")}</strong> {reservation.timeLeaving || "N/A"} <br />
                      <strong>{text?.phone || (currentLange === "Ar" ? "الهاتف:" : "Phone:")}</strong> {reservation.phone || "N/A"} <br />
                    </Card.Text>
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => updateStatus(reservation.id, "accepted")}
                        disabled={reservation.status === "accepted"}
                      >
                        {text?.accept || (currentLange === "Ar" ? "قبول" : "Accept")}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => updateStatus(reservation.id, "rejected")}
                        disabled={reservation.status === "rejected"}
                      >
                        {text?.reject || (currentLange === "Ar" ? "رفض" : "Reject")}
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => deleteReservation(reservation.id)}
                      >
                        {text?.delete || (currentLange === "Ar" ? "حذف" : "Delete")}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center mt-5">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link bg-dark text-white" 
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    style={{ borderRadius: '50px', margin: '0 5px' }}
                  >
                    {text?.previous || (currentLange === "Ar" ? "السابق" : "Previous")}
                  </button>
                </li>
                {getPageNumbers().map(number => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button 
                      className="page-link bg-dark text-white" 
                      onClick={() => handlePageChange(number)}
                      style={{ 
                        borderRadius: '50px', 
                        margin: '0 5px',
                        backgroundColor: currentPage === number ? '#555' : '',
                        border: 'none'
                      }}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link bg-dark text-white" 
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    style={{ borderRadius: '50px', margin: '0 5px' }}
                  >
                    {text?.next || (currentLange === "Ar" ? "التالي" : "Next")}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      ) : (
        <p className={textColor}>
          {text?.noReservations || (currentLange === "Ar" ? "لا توجد حجوزات." : "No reservations found.")}
        </p>
      )}
    </div>
  );
};

// AdminPanel Component
const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    name_en: '',
    name_ar: '',
    description: '',
    desc_ar: '',
    category: '',
    category_ar: '',
    price: '',
    image: '',
    imageFile: null,
  });
  const { theme } = useContext(ThemeContext);
  const textColor = theme === 'dark' ? 'text-white' : 'text-dark';
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user ? user.email : 'No user');
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    getDocs(collection(db, 'menu'))
      .then((snapshot) => {
        const loadedCategories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log('Loaded categories:', loadedCategories);
        setCategories(loadedCategories);
        setSelectedCategory(loadedCategories[0]?.id || null);
      })
      .catch((error) => {
        console.error('Error loading categories:', error);
        toast.error(
          text?.failedLoadCategories || (currentLange === 'Ar' ? 'فشل في تحميل الفئات' : 'Failed to load categories')
        );
      });
  }, [user, text, currentLange]);

  useEffect(() => {
    if (!selectedCategory) return;
    const unsubscribe = onSnapshot(
      collection(db, `menu/${selectedCategory}/items`),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
        console.log(`Menu items updated for category ${selectedCategory}:`, items);
        setMenuItems(items);
      },
      (error) => {
        console.error('Error fetching menu items:', error);
        toast.error(
          text?.failedLoadMenuItems || (currentLange === 'Ar' ? 'فشل في تحميل عناصر القائمة' : 'Failed to load menu items')
        );
      }
    );
    return unsubscribe;
  }, [selectedCategory, text, currentLange]);

  const uploadImageToStorage = async (file) => {
    if (!file) return null;
    try {
      const sanitizedFileName = file.name.replace(/\s+/g, '_');
      const storageRef = ref(storage, `menu/${selectedCategory}/items/image/${Date.now()}_${sanitizedFileName}`);
      console.log('Uploading image to:', storageRef.fullPath);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      console.log('Image uploaded, URL:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(
        text?.failedUploadImage?.replace('{error}', error.message) ||
        (currentLange === 'Ar' ? `فشل في رفع الصورة: ${error.message}` : `Failed to upload image: ${error.message}`)
      );
      throw error;
    }
  };

  const handleSubmit = async (values) => {
    if (!selectedCategory) {
      toast.error('Please select a category first');
      return;
    }
    console.log('handleSubmit called with values:', values, 'selectedCategory:', selectedCategory);
    let imageUrl = formData.image;
    try {
      if (values.imageFile) imageUrl = await uploadImageToStorage(values.imageFile);
      const itemData = {
        title: values.title || '',
        title_ar: values.title_ar || '',
        name_en: values.name_en || '',
        name_ar: values.name_ar || '',
        description: values.description || '',
        desc_ar: values.desc_ar || '',
        category: selectedCategory,
        category_ar: categories.find(cat => cat.id === selectedCategory)?.category_ar || values.category_ar || '',
        price: parseFloat(values.price) || 0,
        image: imageUrl || '',
      };
      console.log('Saving item to:', `menu/${selectedCategory}/items`, 'Data:', itemData);
      if (showModal === 'add') {
        const docRef = await addDoc(collection(db, `menu/${selectedCategory}/items`), itemData);
        console.log('Item added with ID:', docRef.id);
        toast.success(text?.itemAdded || (currentLange === 'Ar' ? 'تم إضافة العنصر!' : 'Item added!'));
      } else if (showModal === 'edit') {
        const docRef = doc(db, `menu/${selectedCategory}/items`, selectedItem.docId);
        await updateDoc(docRef, itemData);
        console.log('Item updated with ID:', selectedItem.docId);
        toast.success(text?.itemUpdated || (currentLange === 'Ar' ? 'تم تحديث العنصر!' : 'Item updated!'));
      }
      setShowModal(null);
      setFormData({
        title: '',
        title_ar: '',
        name_en: '',
        name_ar: '',
        description: '',
        desc_ar: '',
        category: '',
        category_ar: '',
        price: '',
        image: '',
        imageFile: null,
      });
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(
        text?.errorSavingItem?.replace('{error}', error.message) ||
        (currentLange === 'Ar' ? `خطأ في حفظ العنصر: ${error.message}` : `Error saving item: ${error.message}`)
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedItem || !selectedCategory) return;
    console.log('Deleting item:', selectedItem.docId, 'from category:', selectedCategory);
    try {
      const docRef = doc(db, `menu/${selectedCategory}/items`, selectedItem.docId);
      await deleteDoc(docRef);
      console.log('Item deleted:', selectedItem.docId);
      toast.success(text?.itemDeleted || (currentLange === 'Ar' ? 'تم حذف العنصر!' : 'Item deleted!'));
      setShowModal(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(
        text?.errorSavingItem?.replace('{error}', error.message) ||
        (currentLange === 'Ar' ? `خطأ في حذف العنصر: ${error.message}` : `Error deleting item: ${error.message}`)
      );
    }
  };

  const handleAddCategory = async () => {
    const newCategory = formData.title;
    if (!newCategory) {
      toast.error(text?.categoryNameRequired || (currentLange === 'Ar' ? 'اسم الفئة مطلوب' : 'Category name is required'));
      return;
    }
    console.log('Adding category:', newCategory);
    try {
      await setDoc(doc(db, 'menu', newCategory), {
        name: newCategory,
        category_ar: formData.category_ar || newCategory,
      });
      console.log('Category added:', newCategory);
      toast.success(text?.categoryAdded || (currentLange === 'Ar' ? 'تم إضافة الفئة!' : 'Category added!'));
      setShowModal(null);
      setFormData({
        title: '',
        title_ar: '',
        name_en: '',
        name_ar: '',
        description: '',
        desc_ar: '',
        category: '',
        category_ar: '',
        price: '',
        image: '',
        imageFile: null,
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(
        text?.errorAddingCategory || (currentLange === 'Ar' ? 'خطأ في إضافة الفئة' : 'Error adding category')
      );
    }
  };

  const openEditModal = (item) => {
    console.log('Opening edit modal for item:', item);
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      title_ar: item.title_ar || '',
      name_en: item.name_en || '',
      name_ar: item.name_ar || '',
      description: item.description || '',
      desc_ar: item.desc_ar || '',
      category: item.category || selectedCategory,
      category_ar: item.category_ar || categories.find(cat => cat.id === selectedCategory)?.category_ar || '',
      price: item.price || '',
      image: item.image || '',
      imageFile: null,
    });
    setShowModal('edit');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(menuItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!user) {
    return (
      <p className={`${textColor} text-center mt-5`}>
        {text?.pleaseLogIn || (currentLange === 'Ar' ? 'يرجى تسجيل الدخول.' : 'Please log in.')}
      </p>
    );
  }

  if (!categories.length) {
    return (
      <p className={`${textColor} text-center mt-5`}>
        {text?.loadingCategories || (currentLange === 'Ar' ? 'جارٍ تحميل الفئات...' : 'Loading categories...')}
      </p>
    );
  }

  return (
    <Container fluid className="mt-5">
      <Row className="mb-4">
        <Col>
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setShowModal={setShowModal}
            setFormData={setFormData}
          />
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <Button
              variant="primary"
              onClick={() => {
                if (!selectedCategory) {
                  toast.error('Please select a category first');
                  return;
                }
                const selectedCat = categories.find(cat => cat.id === selectedCategory);
                console.log('Opening add item modal for category:', selectedCategory);
                setFormData({
                  title: '',
                  title_ar: '',
                  name_en: '',
                  name_ar: '',
                  description: '',
                  desc_ar: '',
                  category: selectedCategory || '',
                  category_ar: selectedCat?.category_ar || '',
                  price: '',
                  image: '',
                  imageFile: null,
                });
                setShowModal('add');
              }}
            >
              {text?.addItem || (currentLange === 'Ar' ? 'إضافة عنصر' : 'Add Item')}
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <MenuItemCard
              key={item.docId}
              item={item}
              openEditModal={openEditModal}
              setSelectedItem={setSelectedItem}
              setShowModal={setShowModal}
            />
          ))
        ) : (
          <Col>
            <p className={`${textColor} text-center`}>
              {text?.noItemsInCategory || (currentLange === 'Ar' ? 'لا توجد عناصر في هذه الفئة.' : 'No items found in this category.')}
            </p>
          </Col>
        )}
      </Row>
      {menuItems.length > itemsPerPage && (
        <div className="d-flex justify-content-between mt-4">
          <Button
            variant="primary"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
      <ItemModal
        showModal={showModal}
        setShowModal={setShowModal}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        handleAddCategory={handleAddCategory}
        selectedItem={selectedItem}
        categories={categories}
        selectedCategory={selectedCategory}
      />
    </Container>
  );
};

// AdminChat Component
const AdminChat = () => {
  const userState55 = useSelector((state) => state.UserData["UserState"]);
  const currentLange = useSelector((state) => state.lange.langue);
  const text = useSelector((state) => state.lange[currentLange.toLowerCase()]);
  const [allUsers, setAllUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [userUID, setUserUID] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);
  const textColor = theme === "dark" ? "text-white" : "text-dark";

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userState55 || !userState55.uid) {
        setError(text?.failedLoadUsers || (currentLange === "Ar" ? "بيانات المستخدم غير متاحة. حاول تسجيل الدخول مرة أخرى." : "User data not available. Please try logging in again."));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const q = query(collection(db, "users2"), where("uid", "!=", userState55.uid));
        const querySnapshot = await getDocs(q);
        const docsData = [];
        querySnapshot.forEach((doc) => {
          docsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setAllUsers(docsData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(text?.failedLoadUsers || (currentLange === "Ar" ? "فشل في تحميل المستخدمين. حاول مرة أخرى." : "Failed to load users. Please try again."));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userState55, text, currentLange]);

  const handleUserData = (user) => {
    setUserName(user.name);
    setUserUID(user.uid);
    setShowChat(true);
  };

  return (
    <div className="admin-chat-container">
      <Row>
        <Col md={3} className="chat-sidebar">
          <h4 className={`sidebar-title ${textColor}`}>
            {text?.users || (currentLange === "Ar" ? "المستخدمون" : "Users")}
          </h4>
          {loading ? (
            <p className="text-muted">
              {text?.loadingUsers || (currentLange === "Ar" ? "جارٍ تحميل المستخدمين..." : "Loading users...")}
            </p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : allUsers.length > 0 ? (
            allUsers.map((user) => (
              <div
                key={user.id}
                className={`user-card ${userUID === user.uid ? "active" : ""}`}
                onClick={() => handleUserData(user)}
              >
                <span>{user.name}</span>
              </div>
            ))
          ) : (
            <p className="text-muted">
              {text?.noUsersFound || (currentLange === "Ar" ? "لم يتم العثور على مستخدمين." : "No users found.")}
            </p>
          )}
        </Col>

        <Col md={9} className="chat-content">
          {showChat ? (
            <>
              <div className="chat-header">
                <h5 className={textColor}>
                  {text?.chattingWith?.replace("{userName}", userName) ||
                  (currentLange === "Ar" ? `الدردشة مع ${userName}` : `Chatting with ${userName}`)}
                </h5>
              </div>
              <Chat userName={userName} uidChats={userUID} showChat={showChat} />
            </>
          ) : (
            <div className="chat-placeholder">
              <p className={textColor}>
                {text?.selectUserToChat || (currentLange === "Ar" ? "اختر مستخدمًا لبدء الدردشة." : "Select a user to start chatting.")}
              </p>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;