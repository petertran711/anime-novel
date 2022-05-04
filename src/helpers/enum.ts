export enum Role {
  USER = 'USER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  RESETPASSWORD = 'RESETPASSWORD',
}

export enum OrderStatus {
  CHECKOUT = 'CHECKOUT',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
  LOCK = 'LOCK',
  ERROR = 'ERROR',
  PROCESSING = 'PROCESSING',
}

export enum OrderCourseStatus {
  CHECKOUT = 'CHECKOUT',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
  LOCK = 'LOCK',
  ERROR = 'ERROR',
  PROCESSING = 'PROCESSING',
}

export enum WithdrawStatus {
  // WAITING = 'Chờ xử lý',
  PROCESS = 'Đang xử lý',
  DONE = 'Hoàn thành',
  CANCEL = 'Huỷ',
}

export interface VnpayParam {
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_Locale: string;
  vnp_CurrCode: string;
  vnp_TxnRef: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;

  vnp_Amount: string;
  vnp_ReturnUrl: string;
  vnp_IpAddr: string;
  vnp_CreateDate: string;
  vnp_Version: string;
}

export enum VnpayConst {
  vnp_HashSecret = 'VRQPRCLXUZSOQHZRMRUWSUNVTFXOMYZI',
  vnp_TmnCode = 'L23GINML',
  vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
}

export enum TypeCharge {
  VNPAY = 'VNPAY',
  TRANSFER = 'TRANSFER',
  PAY_WITH_BALANCE = 'PAY_WITH_BALANCE',
}

export enum StaticPageType {
  INTRODUCE = 'INTRODUCE',
  CGU = 'CGU',
}

// export enum TransactionType {
//   PURCHASE = 'PURCHASE', // admin nạp tiền hộ
//   ADMIN_PURCHASE = 'ADMIN_PURCHASE', // admin
//   PROFIT_COMMISSION = 'PROFIT_COMMISSION',
//   WITHDRAW = 'WITHDRAW',
//   ADMIN_WITHDRAW = 'ADMIN_WITHDRAW',
//   BUY_COURSE = 'BUY_COURSE', // kind: trừ tiền của khách hàng mua
//   ADMIN_BUY_COURSE = 'ADMIN_BUY_COURSE',
// }

export enum TransactionType {
  OWNER_SELL = 'OWNER_SELL', // khách hàng tự chọn (người bán bán khoá học) -> hiển thị cho cấp cha. không có hoa hồng cho các cấp con
  REFUSER_SELL = 'REFUSER_SELL', // cấp con bán khoá học của cấp cha -> hiển thị cho cấp cha
  REF = 'REF', // cấp con bán -> các cấp cha dc ăn hoa hồng
  REF_SELL = 'REF_SELL', // user cấp con đã bán khoá học
  ADMIN_SELL = 'ADMIN_SELL', // admin bán khoá học trên CMS
  ADMIN_RECHARGE = 'ADMIN_RECHARGE', // admin nạp tiền
  USER_BUY = 'USER_BUY', // khách hàng mua cho outcome, trừ tiền kháng hàng
  ADMIN_WITHDRAW = 'ADMIN_WITHDRAW', // admin rút tiền -> cms : chưa có case này
  WITHDRAW = 'WITHDRAW', // rút tiền
  DEPOSIT = 'DEPOSIT', // nạp tiền bằng VNPAY hoặc nap tiền khi mua khoá học online
  FEE = 'FEE', // Cac giao dich dang phi
}

export enum TransactionKind {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME',
}

export enum DeviceType {
  MOBILE = 'MOBILE',
  WEB = 'WEB',
}

export enum NotificationType {
  business = 'business',
  transaction = 'transaction',
  courseDetail = 'courseDetail',
}

export enum IS_DELETE {
  yes = 1,
  no = 0,
}
