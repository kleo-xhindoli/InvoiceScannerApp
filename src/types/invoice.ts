export interface InvoiceData {
  id: number;
  iic: string;
  totalPrice: number;
  invoiceOrderNumber: number;
  businessUnit: string;
  cashRegister: string;
  issuerTaxNumber: string;
  dateTimeCreated: string;
  // invoiceRequest: null;
  invoiceVersion: number;
  fic: string;
  iicReference: string | null;
  iicRefIssuingDate: string | null;
  impCustDecNum: string | null;
  supplyDateOrPeriod: string | null;
  correctiveInvoiceType: string | null;
  baddeptInv: string | null;
  paymentMethod: PaymentMethod[];
  currency: Currency;
  seller: Business;
  buyer: Business | null;
  items: Item[];
  sameTaxes: any[] | null;
  consTaxes: any[] | null;
  fees: any[] | null;
  sumInvIicRefs: any[] | null;
  invoiceType: string;
  typeOfSelfIss: string | null;
  invoiceNumber: string;
  tcrCode: string | null;
  taxFreeAmt: number;
  markUpAmt: number | null;
  goodsExAmt: number | null;
  totalPriceWithoutVAT: number;
  totalVATAmount: number | null;
  operatorCode: string | null;
  softwareCode: string;
  iicSignature: string;
  payDeadline: string | null;
  listOfCorrectedInvoiceIIC: any[];
  originalInvoice: object | null;
  badDebtInvoice: object | null;
  issuerInVat: boolean;
  reverseCharge: boolean;
  badDebt: boolean;
  simplifiedInvoice: boolean;
}

interface PaymentMethod {
  id: number;
  vouchers: string | null;
  type: string;
  amount: number;
  compCard: string | null;
  typeCode: string;
}

interface Currency {
  code: string;
  exchangeRate: number;
  buying: boolean;
}

interface Business {
  idType: string;
  idNum: string;
  name: string;
  address: string;
  town: string;
  country: string;
}

interface Item {
  id: number;
  name: string;
  code: string;
  unit: string;
  quantity: number;
  unitPriceBeforeVat: number;
  unitPriceAfterVat: number;
  rebate: number;
  rebateReducing: boolean;
  priceBeforeVat: number;
  vatRate: number;
  vatAmount: number;
  priceAfterVat: number;
  exemptFromVat: string;
  voucherSold: string | null;
  investment: boolean;
}
