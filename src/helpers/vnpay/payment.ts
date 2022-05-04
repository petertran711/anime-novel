import { format } from 'date-fns';
import { VnpayConst, VnpayParam } from '../enum';
const qs = require('qs');
const crypto = require('crypto');
export function createPaymentUrlHelper(orderId: string, price: number, hostname: string, ip: string) {
  console.log('Create vn payment url');

  var createDate = format(new Date(), 'yyyyMMddHHmmss').toString();
  var payment: VnpayParam = {
    vnp_Version: '',
    vnp_TmnCode: '',
    vnp_Amount: '',
    vnp_Command: '',
    vnp_CreateDate: '',
    vnp_CurrCode: 'VND',
    vnp_IpAddr: '',
    vnp_Locale: '',
    vnp_OrderInfo: '',
    vnp_OrderType: '',
    vnp_ReturnUrl: '',
    vnp_TxnRef: '',
  };

  const returnUrl = hostname.toString().includes('uat')
    ? 'http://api.uat.elearning.viziple.com/orders/vnpay_return'
    : 'http://localhost:3000/orders/vnpay_return';
  payment.vnp_Version = '2.1.0';
  payment.vnp_TxnRef = orderId;
  payment.vnp_TmnCode = VnpayConst.vnp_TmnCode;
  payment.vnp_OrderType = 'billpayment';
  payment.vnp_Locale = 'vn';
  payment.vnp_Amount = (price * 100).toString();
  payment.vnp_OrderInfo = 'Thanh toan khoa hoc truc tuyen';
  payment.vnp_ReturnUrl = returnUrl;
  payment.vnp_CreateDate = createDate;
  payment.vnp_Command = 'pay';
  payment.vnp_IpAddr = ip;

  const vnp_Params = sortObject(payment);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', VnpayConst.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  const url = VnpayConst.vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });
  return url;
}

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

export function checkReturnResult(query: Object) {
  var vnp_Params = query;

  var secureHash = vnp_Params['vnp_SecureHash'];
  var status = vnp_Params['vnp_TransactionStatus'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  var secretKey = VnpayConst.vnp_HashSecret;

  var querystring = require('qs');
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require('crypto');
  var hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return secureHash === signed && status.toString() == '00';
}
