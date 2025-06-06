const english = {
  // Existing keys (unchanged)
  lang: "Arabic",
  home: "Home",
  menu: "Menu",
  reservation: "Reservation",
  contactUs: "Contact Us",
  myOrders: "My Orders",
  signIn: "Sign In",
  register: "Register",
  logout: "Log Out",
  wishlist: "Wishlist",
  cart: "Cart",
  chatWith: "Chat with admin",
  noMessages: "No messages yet. Start the conversation!",
  typeMessage: "Type your message...",
  sendButton: "Send",

  // AdminDashboard
  adminDashboard: "Admin Dashboard",
  orders: "Orders",
  reservations: "Reservations",
  // menu: "Menu",
  chat: "Chat",
  // logout: "Logout",
  loading: "Loading...",
  routeNotFound: "Route not found: {pathname}",
  logoutSuccess: "Logged out successfully!",
  logoutFailed: "Failed to log out: {error}",

  // AdminOrdersPage
  ordersManagement: "Orders Management",
  sort: "Sort",
  sortNewest: "Newest First",
  sortOldest: "Oldest First",
  status: "Status",
  statusAll: "All",
  statusPending: "Pending",
  statusAccepted: "Accepted",
  statusRejected: "Rejected",
  payment: "Payment",
  paymentAll: "All",
  paymentCod: "Cash on Delivery",
  paymentPaypal: "PayPal",
  noOrdersFiltered: "No orders match the selected filters.",
  success: "Success!",
  error: "Error!",
  orderAccepted: "Order #{orderId} accepted",
  orderUpdateFailed: "Failed to update order: {error}",
  deleteOrderConfirmTitle: "Are you sure?",
  deleteOrderConfirmText: "Delete Order #{orderId}?",
  deleteOrderConfirmButton: "Yes, delete!",
  deleteOrderSuccessTitle: "Deleted!",
  deleteOrderSuccessMessage: "Order #{orderId} deleted",
  clearAllOrdersConfirmTitle: "Delete all orders?",
  clearAllOrdersConfirmButton: "Yes, delete all!",
  clearAllOrdersSuccessTitle: "Deleted!",
  clearAllOrdersSuccessMessage: "All orders cleared",
  refundMessage: "Order #{orderId}: Refunding soon (if PayPal).",

  // AdminReservationsPage
  reservationsManagement: "Reservations Management",
  refreshReservations: "Refresh Reservations",
  reservationTitle: "Reservation #{reservationId}",
  tableId: "Table ID",
  name: "Name",
  date: "Date",
  numPersons: "Number of Persons",
  timeArriving: "Time Arriving",
  timeLeaving: "Time Leaving",
  phone: "Phone",
  accept: "Accept",
  reject: "Reject",
  delete: "Delete",
  previous: "Previous",
  next: "Next",
  noReservations: "No reservations found.",
  reservationStatusSuccess: "Reservation #{reservationId} {status}",
  reservationStatusError: "Failed to update reservation: {error}",
  deleteReservationConfirmTitle: "Are you sure?",
  deleteReservationConfirmText: "Delete Reservation #{reservationId}?",
  deleteReservationConfirmButton: "Yes, delete!",
  deleteReservationSuccessTitle: "Deleted!",
  deleteReservationSuccessMessage: "Reservation #{reservationId} deleted",
  refreshSuccessTitle: "Success!",
  refreshSuccessMessage: "Reservations refreshed successfully",
  refreshErrorTitle: "Error!",
  refreshErrorMessage: "Failed to fetch reservations: {error}",

  // AdminPanel
  pleaseLogIn: "Please log in.",
  noItemsInCategory: "No items found in this category.",
  failedLoadCategories: "Failed to load categories",
  failedLoadMenuItems: "Failed to load menu items",
  itemAdded: "Item added!",
  itemUpdated: "Item updated!",
  itemDeleted: "Item deleted!",
  failedUploadImage: "Failed to upload image: {error}",
  errorSavingItem: "Error saving item: {error}",
  categoryAdded: "Category added!",
  errorAddingCategory: "Error adding category",
  addItem: "Add Item",

  // CategorySelector
  menuManagement: "Menu Management",
  selectCategory: "Select Category",

  // AdminChat
  users: "Users",
  chattingWith: "Chatting with {userName}",
  loadingUsers: "Loading users...",
  failedLoadUsers: "Failed to load users. Please try again.",
  noUsersFound: "No users found.",
  selectUserToChat: "Select a user to start chatting.",

  // StatsSection
  totalOrders: "Total Orders",
  totalRevenue: "Total Revenue",
  averageOrderValue: "Average Order Value",
  pendingOrders: "Pending Orders",

  // OrdersList (Pagination)
  // previous: "Previous",
  // next: "Next",

  // MenuItemCard
  titleEn: "Title (EN)",
  titleAr: "Title (AR)",
  nameEn: "Name (EN)",
  nameAr: "Name (AR)",
  descriptionEn: "Description (EN)",
  descriptionAr: "Description (AR)",
  price: "Price",
  edit: "Edit",
  // delete: "Delete",

  // ItemModal
  addNewItem: "Add New Item",
  editItem: "Edit Item",
  confirmDelete: "Confirm Delete",
  categoryEn: "Category (English)",
  categoryAr: "Category (Arabic)",
  // titleEn: "Title (English)",
  // titleAr: "Title (Arabic)",
  // nameEn: "Name (English)",
  // nameAr: "Name (Arabic)",
  // descriptionEn: "Description (English)",
  // descriptionAr: "Description (Arabic)",
  // price: "Price",
  uploadImage: "Upload Image",
  addCategory: "Add New Category",
  categoryNameEn: "Category Name (English)",
  categoryNameAr: "Category Name (Arabic)",
  add: "Add",
  save: "Save",
  cancel: "Cancel",
  // delete: "Delete",
  titleRequired: "Title (English) is required",
  titleMin: "Title must be at least 3 characters",
  titleArMin: "Arabic title must be at least 3 characters",
  nameEnMin: "Name (English) must be at least 3 characters",
  nameArMin: "Arabic name must be at least 3 characters",
  descriptionMax: "Description cannot exceed 500 characters",
  descArMax: "Arabic description cannot exceed 500 characters",
  categoryRequired: "Category (English) is required",
  categoryArRequired: "Category (Arabic) is required",
  priceRequired: "Price is required",
  pricePositive: "Price must be a positive number",
  priceMin: "Price must be at least $0.01",
  priceMax: "Price cannot exceed $10,000",

  // OrderCard
  order: "Order #{orderId}",
  items: "Items",
  noItems: "No items",
  total: "Total:",
  placed: "Placed",
  shippingDetails: "Shipping Details",
  city: "City",
  // phone: "Phone",
  details: "Details",
  discountApplied: "Discount Applied:",
  discountYes: "Yes (20%)",
  discountNo: "No",
  // payment: "Payment",
  cashOnDelivery: "Cash on Delivery",
  paidPaypal: "Paid (PayPal)",
  trackingStatus: "Tracking Status",
  orderPlaced: "Order Placed",
  processing: "Processing",
  outForDelivery: "Out for Delivery",
  delivered: "Delivered",
  // accept: "Accept",
  // reject: "Reject",
  // delete: "Delete",
  // statusPending: "Pending",
  // statusAccepted: "Accepted",
  // statusRejected: "Rejected",

  // Orders Component
  noOrdersMatchFilters: "No orders match the selected filters.",
  totalDue: "Total Due",
  totalPaid: "Total Paid",
  trackOrder: "Track Order",
  authenticationRequired: "Authentication Required",
  pleaseSignIn: "Please sign in to view your orders.",
  failedFetchOrders: "Failed to fetch orders. Please try again.",
  // deleteOrderConfirmText: "You are about to delete Order #{orderId}. This action cannot be undone.",
  // deleteOrderConfirmButton: "Yes, delete it!",
  // deleteOrderSuccessMessage: "Order #{orderId} has been deleted.",
  deleteOrderError: "There was an error deleting the order.",

  // UserReservationsPage
  myReservationsTitle: "My Reservations",
  mustBeLoggedIn: "You must be logged in to view your reservations.",
  failedLoadReservations: "Failed to load reservations: ",
  tableIdLabel: "Table ID",
  unknown: "Unknown",
  nameLabel: "Name",
  dateLabel: "Date",
  numPersonsLabel: "Number of Persons",
  timeArrivingLabel: "Time Arriving",
  timeLeavingLabel: "Time Leaving",
  phoneLabel: "Phone",
  pendingMessage: "Awaiting admin approval. You’ll be notified once confirmed.",
  acceptedMessage: "Your reservation is confirmed! We look forward to seeing you.",
  rejectedMessage: "Sorry, your reservation was not approved. Please try a different time or table.",
  // noReservations: "No reservations found.",
  makeNewReservation: "Make a New Reservation",
  makeReservation: "Make a Reservation",
  
// Cart Component
yourCart: "Your Cart",
cartEmpty: "Your cart is empty.",
addedToCart: "Added to cart",
addedToCartToast: "Added to cart!",
addedToWishlistToast: "Added to wishlist!",
removedFromCartToast: "Removed from cart!", // Added for removing from cart
removedFromWishlistToast: "Removed from wishlist!", // Added for removing from wishlist
errorUpdatingWishlist: "Error updating wishlist", // Added for wishlist error
errorUpdatingCart: "Error updating cart", // Added for cart error
pleaseSignInToAddToCart: "Please sign in to add items to cart", // Added for login prompt
subtotal: "Subtotal",
discount20: "Discount (20%)",
// total: "Total",
couponCodeLabel: "Coupon Code",
apply: "Apply",
orderNow: "Order Now",
currency: "LE",
invalidCoupon: "Invalid Coupon",
invalidCouponMessage: "The coupon code you entered is invalid.",
emptyCart: "Empty Cart",
emptyCartMessage: "Your cart is empty. Add items to proceed.",
removeItem: "Remove Item",
removeItemConfirm: 'Are you sure you want to remove "{title}" from your cart?',
confirmRemove: "Yes, remove it!",
removed: "Removed!",
removedMessage: '"{title}" has been removed from your cart.',
// New keys for Chefs component
chefsTitle: "CHEFS",
professionalChefs: "Our Professional Chefs",
chefsData: [
  {
    name: "Walter White",
    name_ar: "والتر وايت",
    rank: "Master Chef",
    rank_ar: "شيف رئيسي",
    description: "Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut. Ipsum exercitationem iure minima enim corporis et voluptate.",
    desc_ar: "يهرب من أجل ذلك وذلك. متعة مؤلمة في الوقت الذي تستمر فيه بنفسها. ممارسة الحد الأدنى من الجسم والمتعة.",
  },
  {
    name: "Sarah Jhonson",
    name_ar: "سارة جونسون",
    rank: "Patissier",
    rank_ar: "حلواني",
    description: "Quo esse repellendus quia id. Est eum et accusantium pariatur fugit nihil minima suscipit corporis. Voluptate sed quas reiciendis animi neque sapiente.",
    desc_ar: "لأنه يصد. هو واتهاماته يهربون من الحد الأدنى من الجسم. متعة يتم رفضها ولا يعقل الحكيم.",
  },
  {
    name: "William Anderson",
    name_ar: "ويليام أندرسون",
    rank: "Cook",
    rank_ar: "طباخ",
    description: "Vero omnis enim consequatur. Voluptas consectetur unde qui molestiae deserunt. Voluptates enim aut architecto porro aspernatur molestiae modi.",
    desc_ar: "كل شيء حقيقي بالتأكيد. متعة يتم وصفها بالمضايقة. متعة بالفعل للمهندس الذي يعاني من التعديلات.",
  },
],

  // New keys for Counter component
  aboutUs: "About Us",
  happyClients: "Happy Clients",
  mealDelivered: "Meal Delivered",
  differentDishes: "Different Dishes",
  rate: "Rate",

  // New keys for Contact component
  contactTitle: "General CONTACT",
  ourAddress: "Our Address",
  address: "Al menya elgededa",
  emailUs: "Email Us",
  callUs: "Call Us",
  openingHours: "Opening Hours",
  hours: "Mon-Sat: 11AM - 23PM; Sunday: Closed",

// New keys for Footer component
restaurantTitle: "Restaurant",
tastyBitesDesc: "TastyBites is a restaurant landing page that offers a delicious dining experience to its customers.",
socialMedia: "Social Media",
subscribeNewsletter: "Subscribe Our Newsletter",
newsletterDesc: "Don't miss out on our latest menu updates and exclusive offers - join our newsletter today and stay up-to-date with all things Mealify!",
emailPlaceholder: "Enter your email address",
subscribeButton: "Subscribe",
quickLinks: "Quick Links",
// aboutUs: "About Us",
contact: "Contact",
testimonial: "Testimonial",
ourPartners: "Our Partners",
faq: "FAQ",
privacyPolicy: "Privacy Policy",
getInTouch: "Get in Touch",
// address: "A108 Adam Street, New York, NY 535022",


qrCodeDesc: "Scan or click for menu",
};

export default english;