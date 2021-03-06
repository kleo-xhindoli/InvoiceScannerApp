import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { useTranslation } from "react-i18next";

import ActionSheet from "../components/ui/ActionSheet";
import ActionSheetItem from "../components/ui/ActionSheetItem";
import FullButton from "../components/ui/FullButton";
import TextButton from "../components/ui/TextButton";
import TextInput from "../components/ui/TextInput";
import Colors from "../constants/theme/Colors";
import FontSizes from "../constants/theme/FontSizes";
import FontWeights from "../constants/theme/FontWeights";
import Spacing from "../constants/theme/Spacing";
import { useDisclosure } from "../hooks/useDisclosure";
import useInvoices, {
  Invoice,
  invoiceListSelector,
  totalInvoiceAmountSelector,
} from "../hooks/useInvoices";
import useToast from "../hooks/useToast";
import { RootStackParamList } from "../types/stack";
import { formatDateTime } from "../utils/date";
import { emailCSV } from "../utils/invoice";
import { isValidEmail } from "../utils/string";

type InvoicesScreenProps = StackScreenProps<RootStackParamList, "Invoices">;

const InvoicesScreen: React.FC<InvoicesScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const isLoading = useInvoices((state) => state.isFetching);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEmailOpen,
    onOpen: openEmail,
    onClose: closeEmail,
  } = useDisclosure();
  const { showToast } = useToast();

  const [isSending, setIsSending] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [email, setEmail] = useState("");
  const invoices = useInvoices(invoiceListSelector);
  const totalAmount = useInvoices(totalInvoiceAmountSelector);
  const removeInvoice = useInvoices((state) => state.removeInvoice);
  const clearInvoices = useInvoices((state) => state.clearInvoices);

  const navToScanner = () => {
    navigation.navigate("Scanner");
  };

  const selectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    onOpen();
  };

  const deleteInvoice = () => {
    if (!selectedInvoice) return;
    Alert.alert(
      t("invoices.deleteInvoice"),
      t("invoices.deleteConfirmMessage", {
        invoiceNumber: selectedInvoice.invoiceData?.invoiceOrderNumber,
      }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.confirm"),
          onPress: () => {
            removeInvoice(selectedInvoice.iic);
            onClose();
          },
          style: "destructive",
        },
      ]
    );
  };

  const exportCSV = async () => {
    if (!email || !isValidEmail(email)) {
      showToast({ text: t("invoices.invalidEmail"), duration: 2000 });
      closeEmail();
      return;
    }

    setIsSending(true);
    const invoicesWithData = invoices.filter((i) => Boolean(i.invoiceData));
    try {
      await emailCSV(
        invoicesWithData.map((i) => i.invoiceData!),
        email.toLowerCase(),
        t
      );
      showToast({ text: t("invoices.emailSent", { email }), duration: 2000 });
    } catch (e) {
      console.error(e);
      showToast({
        text: t("invoices.failedToSend"),
        duration: 4000,
      });
    } finally {
      setIsSending(false);
      closeEmail();
    }
  };

  const clearALlInvoices = () => {
    Alert.alert(
      t("invoices.clearInvoices"),
      t("invoices.clearInvoicesConfirmMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.confirm"),
          onPress: () => {
            clearInvoices();
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderListItem = ({ item }: { item: Invoice }) => {
    const { invoiceData } = item;
    return (
      <TouchableOpacity
        style={styles.listItem}
        onLongPress={() => selectInvoice(item)}
      >
        {!invoiceData ? (
          <Text style={{ fontStyle: "italic" }}>{t("invoices.noData")}</Text>
        ) : (
          <>
            <View>
              <Text style={styles.invoiceNumber}>
                # {invoiceData.invoiceOrderNumber}
              </Text>
              <Text style={[styles.dateTime, { marginTop: Spacing[2] }]}>
                {formatDateTime(invoiceData.dateTimeCreated)}
              </Text>
            </View>
            <View>
              <Text style={styles.price}>ALL {invoiceData.totalPrice}</Text>
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.fullScreen}>
      {isLoading ? (
        <View style={styles.centeredContent}>
          <ActivityIndicator />
        </View>
      ) : invoices.length > 0 ? (
        <>
          <View style={{ flex: 1 }}>
            <FlatList
              data={invoices}
              renderItem={renderListItem}
              keyExtractor={(item) => item.iic}
            />
            {/* Spacer so no items show underneath the Total frame */}
            <View style={{ height: 100 }} />

            <View style={styles.exportButtonContainer}>
              <FullButton
                style={styles.exportButton}
                leftIcon="download"
                label={t("invoices.exportCsv")}
                onPress={openEmail}
              />
            </View>
          </View>
          <View style={[styles.totalViewContainer]}>
            <View style={styles.totalTextRow}>
              <Text style={styles.totalText}>{t("invoices.total")}</Text>
              <Text style={[styles.totalText, { color: Colors.green[600] }]}>
                ALL {totalAmount}
              </Text>
            </View>
            <TextButton
              label={t("invoices.clearAllInvoices")}
              leftIcon="trash-2"
              color={Colors.gray[600]}
              onPress={clearALlInvoices}
            />
          </View>
        </>
      ) : (
        <View style={styles.centeredContent}>
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={50}
            style={{ color: Colors.gray[400] }}
          />
          <Text style={[styles.emptyStateText, { marginTop: Spacing[4] }]}>
            {t("invoices.noInvoicesScanned")}
          </Text>
          <FullButton
            style={{ marginTop: Spacing[4] }}
            label={t("invoices.startScanning")}
            onPress={navToScanner}
          />
        </View>
      )}

      <ActionSheet isOpen={isOpen} onClose={onClose}>
        <ActionSheetItem
          label={t("invoices.invoiceDetails")}
          icon="file-text"
          onPress={() => console.log("Details")}
        />
        <ActionSheetItem
          label={t("common.delete")}
          icon="trash-2"
          iconColor={Colors.red[600]}
          onPress={deleteInvoice}
        />
      </ActionSheet>
      <ActionSheet isOpen={isEmailOpen} onClose={closeEmail}>
        <Text style={styles.modalTitleText}>
          {t("invoices.exportInvoices")}
        </Text>
        <Text style={styles.modalDescriptionText}>
          {t("invoices.sendEmailDescription")}
        </Text>
        <TextInput
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
          style={{ marginTop: Spacing[4] }}
          placeholder={t("common.emailAddress")}
        />
        <View style={{ marginTop: Spacing[6] }}>
          <FullButton
            label={t("common.send")}
            onPress={exportCSV}
            isLoading={isSending}
          />
          <TextButton
            label={t("common.cancel")}
            onPress={closeEmail}
            style={{ marginTop: Spacing[2] }}
          />
        </View>
        <KeyboardSpacer />
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.gray[100],
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: FontSizes.lg.size,
    fontWeight: FontWeights.medium,
    color: Colors.gray[600],
  },
  listItem: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  invoiceNumber: {
    fontWeight: FontWeights.semibold,
    fontSize: FontSizes.base.size,
  },
  dateTime: {
    color: Colors.gray[500],
  },
  price: {
    fontWeight: FontWeights.semibold,
    fontSize: FontSizes.base.size,
    color: Colors.green[600],
  },
  exportButtonContainer: {
    width: "100%",
    position: "absolute",
    bottom: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  exportButton: {
    marginTop: Spacing[4],
    ...Platform.select({
      android: {
        elevation: 10,
        overflow: "hidden",
      },
      default: {
        shadowColor: Colors.brand[600],
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 25,
      },
    }),
  },
  totalViewContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    height: 100,
    backgroundColor: Colors.white,
    flexDirection: "column",
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    ...Platform.select({
      android: {
        elevation: 2,
        overflow: "hidden",
      },
      default: {
        shadowColor: Colors.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
    }),
  },
  totalTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: FontSizes.lg.size,
    fontWeight: FontWeights.semibold,
  },

  modalTitleText: {
    fontSize: FontSizes.xl.size,
    lineHeight: FontSizes.xl.lineHeight,
    fontWeight: FontWeights.semibold,
  },
  modalDescriptionText: {
    marginTop: Spacing[2],
    fontSize: FontSizes.base.size,
  },
});

export default InvoicesScreen;
