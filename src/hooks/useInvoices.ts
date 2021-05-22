import create from "zustand";

export type Invoice = { url: string };

interface State {
  invoices: Invoice[];
  addInvoice: (invoiceUrl: string) => void;
  clearInvoices: () => void;
}

const useInvoices = create<State>((set) => ({
  invoices: [],

  addInvoice(invoiceUrl) {
    const invoice = { url: invoiceUrl };
    set((state) => ({
      invoices: [...state.invoices, invoice],
    }));
  },
  clearInvoices() {
    set({ invoices: [] });
  },
}));

export default useInvoices;
