const arabic = {
  // Existing keys (unchanged)
  lang: "English",
  home: "الرئيسية",
  menu: "القائمة",
  reservation: "الحجز",
  contactUs: "اتصل بنا",
  myOrders: "طلباتي",
  signIn: "تسجيل الدخول",
  register: "إنشاء حساب",
  logout: "تسجيل الخروج",
  wishlist: "المفضلة",
  cart: "عربة التسوق",
  chatWith: "الدردشة مع الإدارة",
  noMessages: "لا توجد رسائل بعد. ابدأ المحادثة!",
  typeMessage: "اكتب رسالتك...",
  sendButton: "إرسال",

  // AdminDashboard
  adminDashboard: "لوحة تحكم الإدارة",
  orders: "الطلبات",
  reservations: "الحجوزات",
  // menu: "القائمة",
  chat: "الدردشة",
  // logout: "تسجيل الخروج",
  loading: "جارٍ التحميل...",
  routeNotFound: "المسار غير موجود: {pathname}",
  logoutSuccess: "تم تسجيل الخروج بنجاح!",
  logoutFailed: "فشل في تسجيل الخروج: {error}",

  // AdminOrdersPage
  ordersManagement: "إدارة الطلبات",
  sort: "ترتيب",
  sortNewest: "الأحدث أولاً",
  sortOldest: "الأقدم أولاً",
  status: "الحالة",
  statusAll: "الكل",
  statusPending: "معلق",
  statusAccepted: "مقبول",
  statusRejected: "مرفوض",
  payment: "الدفع",
  paymentAll: "الكل",
  paymentCod: "الدفع عند الاستلام",
  paymentPaypal: "باي بال",
  noOrdersFiltered: "لا توجد طلبات تطابق الفلاتر المحددة.",
  success: "نجاح!",
  error: "خطأ!",
  orderAccepted: "تم قبول الطلب #{orderId}",
  orderUpdateFailed: "فشل في تحديث الطلب: {error}",
  deleteOrderConfirmTitle: "هل أنت متأكد؟",
  deleteOrderConfirmText: "حذف الطلب #{orderId}؟",
  deleteOrderConfirmButton: "نعم، احذف!",
  deleteOrderSuccessTitle: "تم الحذف!",
  deleteOrderSuccessMessage: "تم حذف الطلب #{orderId}",
  clearAllOrdersConfirmTitle: "حذف جميع الطلبات؟",
  clearAllOrdersConfirmButton: "نعم، احذف الكل!",
  clearAllOrdersSuccessTitle: "تم الحذف!",
  clearAllOrdersSuccessMessage: "تم مسح جميع الطلبات",
  refundMessage: "الطلب #{orderId}: سيتم الاسترداد قريبًا (إذا كان باي بال).",

  // AdminReservationsPage
  reservationsManagement: "إدارة الحجوزات",
  refreshReservations: "تحديث الحجوزات",
  reservationTitle: "الحجز #{reservationId}",
  tableId: "معرف الطاولة", // Removed colon
  name: "الاسم", // Removed colon
  date: "التاريخ", // Removed colon
  numPersons: "عدد الأشخاص", // Removed colon
  timeArriving: "وقت الوصول", // Removed colon
  timeLeaving: "وقت المغادرة", // Removed colon
  phone: "الهاتف", // Removed colon
  accept: "قبول",
  reject: "رفض",
  delete: "حذف",
  previous: "السابق",
  next: "التالي",
  noReservations: "لا توجد حجوزات.",
  reservationStatusSuccess: "تم تحديث الحجز #{reservationId} إلى {status}",
  reservationStatusError: "فشل في تحديث الحجز: {error}",
  deleteReservationConfirmTitle: "هل أنت متأكد؟",
  deleteReservationConfirmText: "حذف الحجز #{reservationId}؟",
  deleteReservationConfirmButton: "نعم، احذف!",
  deleteReservationSuccessTitle: "تم الحذف!",
  deleteReservationSuccessMessage: "تم حذف الحجز #{reservationId}",
  refreshSuccessTitle: "نجاح!",
  refreshSuccessMessage: "تم تحديث الحجوزات بنجاح",
  refreshErrorTitle: "خطأ!",
  refreshErrorMessage: "فشل في جلب الحجوزات: {error}",

  // AdminPanel
  pleaseLogIn: "يرجى تسجيل الدخول.",
  noItemsInCategory: "لا توجد عناصر في هذه الفئة.",
  failedLoadCategories: "فشل في تحميل الفئات",
  failedLoadMenuItems: "فشل في تحميل عناصر القائمة",
  itemAdded: "تم إضافة العنصر!",
  itemUpdated: "تم تحديث العنصر!",
  itemDeleted: "تم حذف العنصر!",
  failedUploadImage: "فشل في رفع الصورة: {error}",
  errorSavingItem: "خطأ في حفظ العنصر: {error}",
  categoryAdded: "تم إضافة الفئة!",
  errorAddingCategory: "خطأ في إضافة الفئة",
  addItem: "إضافة عنصر",

  // CategorySelector
  menuManagement: "إدارة القائمة",
  selectCategory: "اختر فئة",

  // AdminChat
  users: "المستخدمون",
  chattingWith: "الدردشة مع {userName}",
  loadingUsers: "جارٍ تحميل المستخدمين...",
  failedLoadUsers: "فشل في تحميل المستخدمين. حاول مرة أخرى.",
  noUsersFound: "لم يتم العثور على مستخدمين.",
  selectUserToChat: "اختر مستخدمًا لبدء الدردشة.",

  // StatsSection
  totalOrders: "إجمالي الطلبات",
  totalRevenue: "إجمالي الإيرادات",
  averageOrderValue: "متوسط قيمة الطلب",
  pendingOrders: "الطلبات المعلقة",

  // OrdersList (Pagination)
  // previous: "السابق",
  // next: "التالي",

  // MenuItemCard
  titleEn: "العنوان (الإنجليزية)",
  titleAr: "العنوان (العربية)",
  nameEn: "الاسم (الإنجليزية)",
  nameAr: "الاسم (العربية)",
  descriptionEn: "الوصف (الإنجليزية)",
  descriptionAr: "الوصف (العربية)",
  price: "السعر",
  edit: "تعديل",
  // delete: "حذف",

  // ItemModal
  addNewItem: "إضافة عنصر جديد",
  editItem: "تعديل العنصر",
  confirmDelete: "تأكيد الحذف",
  categoryEn: "الفئة (الإنجليزية)",
  categoryAr: "الفئة (العربية)",
  // titleEn: "العنوان (الإنجليزية)",
  // titleAr: "العنوان (العربية)",
  // nameEn: "الاسم (الإنجليزية)",
  // nameAr: "الاسم (العربية)",
  // descriptionEn: "الوصف (الإنجليزية)",
  // descriptionAr: "الوصف (العربية)",
  // price: "السعر ",
  uploadImage: "رفع الصورة",
  addCategory: "إضافة فئة جديدة",
  categoryNameEn: "اسم الفئة (الإنجليزية)",
  categoryNameAr: "اسم الفئة (العربية)",
  add: "إضافة",
  save: "حفظ",
  cancel: "إلغاء",
  // delete: "حذف",
  titleRequired: "العنوان (الإنجليزية) مطلوب",
  titleMin: "يجب أن يكون العنوان 3 أحرف على الأقل",
  titleArMin: "يجب أن يكون العنوان العربي 3 أحرف على الأقل",
  nameEnMin: "يجب أن يكون الاسم (الإنجليزية) 3 أحرف على الأقل",
  nameArMin: "يجب أن يكون الاسم (العربية) 3 أحرف على الأقل",
  descriptionMax: "الوصف لا يمكن أن يتجاوز 500 حرف",
  descArMax: "الوصف العربي لا يمكن أن يتجاوز 500 حرف",
  categoryRequired: "الفئة (الإنجليزية) مطلوبة",
  categoryArRequired: "الفئة (العربية) مطلوبة",
  priceRequired: "السعر مطلوب",
  pricePositive: "يجب أن يكون السعر رقمًا إيجابيًا",
  priceMin: "يجب أن يكون السعر $0.01 على الأقل",
  priceMax: "السعر لا يمكن أن يتجاوز $10,000",

  // OrderCard
  order: "الطلب #{orderId}",
  items: "العناصر",
  noItems: "لا توجد عناصر",
  total: "الإجمالي:",
  placed: "تم الطلب",
  shippingDetails: "تفاصيل الشحن",
  city: "المدينة",
  // phone: "الهاتف",
  details: "التفاصيل",
  discountApplied: "تم تطبيق الخصم:",
  discountYes: "نعم (20%)",
  discountNo: "لا",
  // payment: "الدفع",
  cashOnDelivery: "الدفع عند الاستلام",
  paidPaypal: "مدفوع (باي بال)",
  trackingStatus: "حالة التتبع",
  orderPlaced: "تم تقديم الطلب",
  processing: "قيد المعالجة",
  outForDelivery: "خارج للتوصيل",
  delivered: "تم التوصيل",
  // accept: "قبول",
  // reject: "رفض",
  // delete: "حذف",
  // statusPending: "معلق",
  // statusAccepted: "مقبول",
  // statusRejected: "مرفوض",

  // Orders Component
  noOrdersMatchFilters: "لا توجد طلبات تطابق الفلاتر المحددة.",
  totalDue: "الإجمالي المستحق",
  totalPaid: "الإجمالي المدفوع",
  trackOrder: "تتبع الطلب",
  authenticationRequired: "المصادقة مطلوبة",
  pleaseSignIn: "يرجى تسجيل الدخول لعرض طلباتك.",
  failedFetchOrders: "فشل في جلب الطلبات. حاول مرة أخرى.",
  // deleteOrderConfirmText: "أنت على وشك حذف الطلب #{orderId}. هذا الإجراء لا يمكن التراجع عنه.",
  // deleteOrderConfirmButton: "نعم، احذف!",
  // deleteOrderSuccessMessage: "تم حذف الطلب #{orderId}.",
  deleteOrderError: "حدث خطأ أثناء حذف الطلب.",

  // UserReservationsPage
  myReservationsTitle: "حجوزاتي",
  mustBeLoggedIn: "يجب أن تكون مسجلاً لعرض حجوزاتك.",
  failedLoadReservations: "فشل في تحميل الحجوزات: ",
  tableIdLabel: "معرف الطاولة", // Already updated above as `tableId`
  unknown: "غير معروف",
  nameLabel: "الاسم", // Already updated above as `name`
  dateLabel: "التاريخ", // Already updated above as `date`
  numPersonsLabel: "عدد الأشخاص", // Already updated above as `numPersons`
  timeArrivingLabel: "وقت الوصول", // Already updated above as `timeArriving`
  timeLeavingLabel: "وقت المغادرة", // Already updated above as `timeLeaving`
  phoneLabel: "الهاتف", // Already updated above as `phone`
  pendingMessage: "في انتظار موافقة الإدارة. سيتم إشعارك بمجرد التأكيد.",
  acceptedMessage: "تم تأكيد حجزك! نتطلع إلى رؤيتك.",
  rejectedMessage: "عذراً، لم يتم الموافقة على حجزك. يرجى تجربة وقت أو طاولة مختلفة.",
  // noReservations: "لم يتم العثور على حجوزات.",
  makeNewReservation: "إنشاء حجز جديد",
  makeReservation: "إنشاء حجز",

// Cart Component
yourCart: "عربة التسوق الخاصة بك",
cartEmpty: "عربة التسوق فارغة.",
addedToCart: "تمت الإضافة إلى عربة التسوق",
addedToCartToast: "أضيف إلى العربة!",
addedToWishlistToast: "أضيف إلى قائمة الرغبات!",
removedFromCartToast: "تمت إزالته من العربة!", // Added for removing from cart
removedFromWishlistToast: "تمت إزالته من قائمة الرغبات", // Added for removing from wishlist
errorUpdatingWishlist: "خطأ في تحديث قائمة الرغبات", // Added for wishlist error
errorUpdatingCart: "خطأ في تحديث العربة", // Added for cart error
pleaseSignInToAddToCart: "يرجى تسجيل الدخول لإضافة عناصر إلى العربة", // Added for login prompt
subtotal: "المجموع الفرعي",
discount20: "الخصم (20%)",
// total: "الإجمالي",
couponCodeLabel: "كود الخصم",
apply: "تطبيق",
orderNow: "اطلب الآن",
currency: "جنيه",
invalidCoupon: "كود خصم غير صالح",
invalidCouponMessage: "كود الخصم الذي أدخلته غير صالح.",
emptyCart: "عربة فارغة",
emptyCartMessage: "عربتك فارغة. أضف عناصر للمتابعة.",
removeItem: "إزالة العنصر",
removeItemConfirm: 'هل أنت متأكد أنك تريد إزالة "{title}" من عربتك؟',
confirmRemove: "نعم، أزلها!",
removed: "تمت الإزالة!",
removedMessage: 'تمت إزالة "{title}" من عربتك.',
// New keys for Chefs component
chefsTitle: "الطهاة",
professionalChefs: "طهاتنا المحترفون",
chefsData: [
  {
    name: "والتر وايت",
    name_ar: "والتر وايت",
    rank: "شيف رئيسي",
    rank_ar: "شيف رئيسي",
    description: "يهرب من أجل ذلك وذلك. متعة مؤلمة في الوقت الذي تستمر فيه بنفسها. ممارسة الحد الأدنى من الجسم والمتعة.",
    desc_ar: "يهرب من أجل ذلك وذلك. متعة مؤلمة في الوقت الذي تستمر فيه بنفسها. ممارسة الحد الأدنى من الجسم والمتعة.",
  },
  {
    name: "سارة جونسون",
    name_ar: "سارة جونسون",
    rank: "حلواني",
    rank_ar: "حلواني",
    description: "لأنه يصد. هو واتهاماته يهربون من الحد الأدنى من الجسم. متعة يتم رفضها ولا يعقل الحكيم.",
    desc_ar: "لأنه يصد. هو واتهاماته يهربون من الحد الأدنى من الجسم. متعة يتم رفضها ولا يعقل الحكيم.",
  },
  {
    name: "ويليام أندرسون",
    name_ar: "ويليام أندرسون",
    rank: "طباخ",
    rank_ar: "طباخ",
    description: "كل شيء حقيقي بالتأكيد. متعة يتم وصفها بالمضايقة. متعة بالفعل للمهندس الذي يعاني من التعديلات.",
    desc_ar: "كل شيء حقيقي بالتأكيد. متعة يتم وصفها بالمضايقة. متعة بالفعل للمهندس الذي يعاني من التعديلات.",
  },
],
// New keys for Counter component
aboutUs: "نبذة عنا",
happyClients: "عملاء سعداء",
mealDelivered: "وجبات تم توصيلها",
differentDishes: "أطباق متنوعة",
rate: "التقييم",

// New keys for Contact component
contactTitle: "الاتصال العام",
// contactUs: "تواصل معنا",
ourAddress: "عنواننا",
address: "المنيا الجديدة",
emailUs: "راسلنا عبر البريد الإلكتروني",

callUs: "اتصل بنا",

openingHours: "ساعات العمل",
hours: "الإثنين-السبت: 11 صباحًا - 11 مساءً؛ الأحد: مغلق",
// New keys for Footer component
restaurantTitle: "المطعم",
tastyBitesDesc: "تيستي بايتس هي صفحة هبوط لمطعم تقدم تجربة طعام لذيذة لعملائها.",
socialMedia: "وسائل التواصل الاجتماعي",
subscribeNewsletter: "اشترك في نشرتنا الإخبارية",
newsletterDesc: "لا تفوت آخر تحديثات قائمتنا وعروضنا الحصرية - اشترك في نشرتنا الإخبارية اليوم وابقَ على اطلاع بكل ما يتعلق بميليفاي!",
emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
subscribeButton: "اشترك",
quickLinks: "روابط سريعة",
// aboutUs: "نبذة عنا",
contact: "اتصل بنا",
testimonial: "شهادات",
ourPartners: "شركاؤنا",
faq: "الأسئلة الشائعة",
privacyPolicy: "سياسة الخصوصية",
getInTouch: "تواصل معنا",
// address: "شارع آدم 108، نيويورك، NY 535022",


qrCodeDesc: "امسح أو انقر للحصول على القائمة",
};

export default arabic;

