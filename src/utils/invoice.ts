export function isValidInvoiceUrl(url: string) {
  if (url.includes("https://efiskalizimi-app.tatime.gov.al")) {
    return true;
  }

  return false;
}
