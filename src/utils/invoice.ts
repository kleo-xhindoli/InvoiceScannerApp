import axios from "axios";
import queryString from "query-string";
import { parseAsync } from "json2csv";
import { InvoiceData } from "../types/invoice";
import { formatDateTime } from "./date";
import Config from "../config/environment";
import { TFunction } from "i18next";

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

const getInvoiceFields = (t: TFunction) => {
  return [
    // Invoice info
    { value: "iic", label: t("invoiceFields.iic") },
    { value: "fic", label: t("invoiceFields.fic") },
    {
      value: "invoiceOrderNumber",
      label: t("invoiceFields.invoiceOrderNumber"),
    },
    { value: "invoiceNumber", label: t("invoiceFields.invoiceNumber") },
    { value: "issuerTaxNumber", label: t("invoiceFields.issuerNuis") },
    {
      label: t("invoiceFields.issueDate"),
      value: (row: InvoiceData) => formatDateTime(row.dateTimeCreated),
    },
    { value: "businessUnit", label: t("invoiceFields.businessUnitCode") },
    { value: "cashRegister", label: t("invoiceFields.cashRegisterCode") },

    // Payment info
    { value: "totalPrice", label: t("invoiceFields.total") },
    {
      value: "totalPriceWithoutVAT",
      label: t("invoiceFields.vatFreeAmount"),
      default: "0",
    },
    {
      value: "totalVATAmount",
      label: t("invoiceFields.vatAmount"),
      default: "0",
    },
    { value: "markUpAmt", label: t("invoiceFields.markupAmount") },
    {
      value: (row: InvoiceData) =>
        row.paymentMethod.map((m) => m.type).join(", "),
      label: t("invoiceFields.paymentMethod"),
    },
    { value: "currency.code", label: t("invoiceFields.currency") },
    { value: "currency.exchangeRate", label: t("invoiceFields.exchangeRate") },
    {
      label: t("invoiceFields.paymentDeadline"),
      value: (row: InvoiceData) =>
        row.payDeadline && formatDateTime(row.payDeadline),
    },

    // Seller info
    { value: "seller.idNum", label: t("invoiceFields.sellerNuis") },
    { value: "seller.name", label: t("invoiceFields.sellerName") },
    { value: "seller.address", label: t("invoiceFields.sellerAddress") },
    { value: "seller.town", label: t("invoiceFields.sellerCity") },
    { value: "seller.country", label: t("invoiceFields.sellerCountry") },

    // Buyer Info
    { value: "buyer.idNum", label: t("invoiceFields.buyerNuis") },
    { value: "buyer.name", label: t("invoiceFields.buyerName") },
    { value: "buyer.address", label: t("invoiceFields.buyerAddress") },
    { value: "buyer.town", label: t("invoiceFields.buyerCity") },
    { value: "buyer.country", label: t("invoiceFields.buyerCountry") },

    // Additional info
    { value: "invoiceType", label: t("invoiceFields.invoiceType") },
    { value: "typeOfSelfIss", label: t("invoiceFields.selfIssueType") },
    {
      value: "correctiveInvoiceType",
      label: t("invoiceFields.correctiveInvoice"),
    },
    { value: "iicReference", label: t("invoiceFields.iicReference") },
    {
      label: t("invoiceFields.supplyDate"),
      value: (row: InvoiceData) =>
        row.supplyDateOrPeriod && formatDateTime(row.supplyDateOrPeriod),
    },
    { value: "baddeptInv", label: t("invoiceFields.badDebtInvoice") },
  ];
};

export async function getInvoicesCSV(invoices: InvoiceData[], t: TFunction) {
  const fields = getInvoiceFields(t);
  const csv = await parseAsync(invoices, { fields });
  return csv;
}

export async function emailCSV(
  invoiceData: InvoiceData[],
  email: string,
  t: TFunction
) {
  const csv = await getInvoicesCSV(invoiceData, t);

  return axios.post(`${Config.apiUrl}/email`, {
    filename: `InvoiceExport_${Date.now()}.csv`,
    csv,
    email,
  });
}
