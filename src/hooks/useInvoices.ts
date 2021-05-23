import create from "zustand";
import { InvoiceData } from "../types/invoice";
import { fetchInvoiceData, getInvoiceQueryParams } from "../utils/invoice";

export type Invoice = { iic: string; url: string; invoiceData?: InvoiceData };

interface State {
  isFetching: boolean;
  invoices: { [iic: string]: Invoice };
  addInvoice: (invoiceUrl: string) => void;
  clearInvoices: () => void;
  removeInvoice: (iic: string) => void;
}

export const totalInvoicesSelector = (state: State) =>
  Object.keys(state.invoices).length;

export const invoiceListSelector = (state: State) =>
  Object.values(state.invoices);

const useInvoices = create<State>((set) => ({
  isFetching: false,
  invoices: {},

  async addInvoice(invoiceUrl) {
    const { iic } = getInvoiceQueryParams(invoiceUrl);
    const invoice: Invoice = { url: invoiceUrl, iic };
    set((state) => ({
      isFetching: true,
      invoices: {
        ...state.invoices,
        [iic]: invoice,
      },
    }));

    try {
      const invoiceData = await fetchInvoiceData(invoiceUrl);
      invoice.invoiceData = invoiceData;
      set((state) => ({
        isFetching: false,
        invoices: {
          ...state.invoices,
          [iic]: invoice,
        },
      }));
    } catch (e) {
      set((state) => ({
        ...state,
        isFetching: false,
      }));
    }
  },
  removeInvoice(iic: string) {
    set((state) => {
      const newState = { ...state };
      if (newState.invoices[iic]) delete newState.invoices[iic];
      return {
        ...newState,
      };
    });
  },
  clearInvoices() {
    set({ invoices: {}, isFetching: false });
  },
}));

export default useInvoices;
