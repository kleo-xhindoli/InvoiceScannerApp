import axios from "axios";
import queryString from "query-string";
import { InvoiceData } from "../types/invoice";

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
