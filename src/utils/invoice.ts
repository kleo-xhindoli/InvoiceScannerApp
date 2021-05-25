import axios from "axios";
import queryString from "query-string";
import { parseAsync } from "json2csv";
import { InvoiceData } from "../types/invoice";
import { formatDateTime } from "./date";
import Config from "../config/environment";

export interface InvoiceQueryParams {
  bu: string;
  cr: string;
  crtd: string;
  iic: string;
  ord: string;
  prc: string;
  sw: string;
  tin: string;
}

const INVOICE_DATA_ENDPOINT =
  "https://efiskalizimi-app.tatime.gov.al/invoice-check/api/verifyInvoice";

export function getInvoiceQueryParams(url: string): InvoiceQueryParams {
  const parsed: unknown = queryString.parse(url.split("?")[1]);

  return parsed as InvoiceQueryParams;
}

export function isValidInvoiceUrl(url: string) {
  if (!url.includes("https://efiskalizimi-app.tatime.gov.al")) return false;
  const params = getInvoiceQueryParams(url);
  if (!params.iic || !params.crtd || !params.tin) return false;

  return true;
}

export async function fetchInvoiceData(url: string) {
  const { iic, crtd, tin } = getInvoiceQueryParams(url);
  const formData = new FormData();
  formData.append("iic", iic);
  formData.append("dateTimeCreated", crtd);
  formData.append("tin", tin);

  const response = await axios({
    method: "POST",
    url: INVOICE_DATA_ENDPOINT,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data as InvoiceData;
}

const fields = [
  // Invoice info
  { value: "iic", label: "IIC" },
  { value: "fic", label: "FIC" },
  { value: "invoiceOrderNumber", label: "Invoice Order Number" },
  { value: "invoiceNumber", label: "Invoice Number" },
  { value: "issuerTaxNumber", label: "Issuer NUIS" },
  {
    label: "Issue Date",
    value: (row: InvoiceData) => formatDateTime(row.dateTimeCreated),
  },
  { value: "businessUnit", label: "Business Unit Code" },
  { value: "cashRegister", label: "Cash Register Code" },

  // Payment info
  { value: "totalPrice", label: "Total" },
  { value: "totalPriceWithoutVAT", label: "VAT Free Amount", default: "0" },
  { value: "totalVATAmount", label: "VAT Amount", default: "0" },
  { value: "markUpAmt", label: "Markup Amount" },
  {
    value: (row: InvoiceData) =>
      row.paymentMethod.map((m) => m.type).join(", "),
    label: "Payment Method",
  },
  { value: "currency.code", label: "Currency" },
  { value: "currency.exchangeRate", label: "Exchange Rate" },
  {
    label: "Payment Deadline",
    value: (row: InvoiceData) =>
      row.payDeadline && formatDateTime(row.payDeadline),
  },

  // Seller info
  { value: "seller.idNum", label: "Seller NUIS" },
  { value: "seller.name", label: "Seller Name" },
  { value: "seller.address", label: "Seller Address" },
  { value: "seller.town", label: "Seller City" },
  { value: "seller.country", label: "Seller Country" },

  // Buyer Info
  { value: "buyer.idNum", label: "Buyer NUIS" },
  { value: "buyer.name", label: "Buyer Name" },
  { value: "buyer.address", label: "Buyer Address" },
  { value: "buyer.town", label: "Buyer City" },
  { value: "buyer.country", label: "Buyer Country" },

  // Additional info
  { value: "invoiceType", label: "Invoice Type" },
  { value: "typeOfSelfIss", label: "Self Issue Type" },
  { value: "correctiveInvoiceType", label: "Corrective Invoice" },
  { value: "iicReference", label: "IIC Reference" },
  {
    label: "Supply Date",
    value: (row: InvoiceData) =>
      row.supplyDateOrPeriod && formatDateTime(row.supplyDateOrPeriod),
  },
  { value: "baddeptInv", label: "Bad Debt Invoice" },
];

export async function getInvoicesCSV(invoices: InvoiceData[]) {
  const csv = await parseAsync(invoices, { fields });
  return csv;
}

export async function emailCSV(invoiceData: InvoiceData[], email: string) {
  const csv = await getInvoicesCSV(invoiceData);

  return axios.post(`${Config.apiUrl}/email`, {
    filename: `InvoiceExport_${Date.now()}.csv`,
    csv,
    email,
  });
}
