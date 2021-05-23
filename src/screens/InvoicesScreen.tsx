import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import ActionSheet from "../components/ui/ActionSheet";
import ActionSheetItem from "../components/ui/ActionSheetItem";
import FullButton from "../components/ui/FullButton";
import Colors from "../constants/theme/Colors";
import FontSizes from "../constants/theme/FontSizes";
import FontWeights from "../constants/theme/FontWeights";
import Spacing from "../constants/theme/Spacing";
import { useDisclosure } from "../hooks/useDisclosure";
import useInvoices, {
  Invoice,
  invoiceListSelector,
} from "../hooks/useInvoices";
import useToast from "../hooks/useToast";
import { RootStackParamList } from "../types/stack";
import { formatDateTime } from "../utils/date";
import { isValidEmail } from "../utils/string";

type InvoicesScreenProps = StackScreenProps<RootStackParamList, "Invoices">;

const InvoicesScreen: React.FC<InvoicesScreenProps> = ({ navigation }) => {
  const isLoading = useInvoices((state) => state.isFetching);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useToast();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const invoices = useInvoices(invoiceListSelector);
  const removeInvoice = useInvoices((state) => state.removeInvoice);

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
      "Delete Invoice",
      `Are you sure you want to delete invoice #${selectedInvoice.invoiceData?.invoiceOrderNumber}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            removeInvoice(selectedInvoice.iic);
            onClose();
          },
          style: "destructive",
        },
      ]
    );
  };

  const exportCSV = () => {
    // TODO: Refactor this. Prompt is not available on Android.
    Alert.prompt(
      "Export Invoices",
      `Enter the email address you want to send the exported file to.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Send",
          onPress: (text) => {
            if (text && isValidEmail(text)) {
              showToast({ text: `Email sent to ${text}`, duration: 2000 });
            } else {
              showToast({ text: "Invalid email", duration: 2000 });
            }
          },
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
          <Text style={{ fontStyle: "italic" }}>No Data</Text>
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
        <View style={{ flex: 1 }}>
          <FlatList
            data={invoices}
            renderItem={renderListItem}
            keyExtractor={(item) => item.iic}
          />
          <View style={styles.exportButtonContainer}>
            <FullButton
              style={styles.exportButton}
              icon={
                <Feather
                  name="download"
                  color={Colors.white}
                  size={18}
                  style={{ marginRight: Spacing[2] }}
                />
              }
              text="Export CSV"
              onPress={exportCSV}
            />
          </View>
        </View>
      ) : (
        <View style={styles.centeredContent}>
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={50}
            style={{ color: Colors.gray[400] }}
          />
          <Text style={[styles.emptyStateText, { marginTop: Spacing[4] }]}>
            No invoices scanned
          </Text>
          <FullButton
            style={{ marginTop: Spacing[4] }}
            text="Start Scanning"
            onPress={navToScanner}
          />
        </View>
      )}

      <ActionSheet isOpen={isOpen} onClose={onClose}>
        <ActionSheetItem
          label="Invoice Details"
          icon="file-text"
          onPress={() => console.log("Details")}
        />
        <ActionSheetItem
          label="Delete"
          icon="trash-2"
          iconColor={Colors.red[600]}
          onPress={deleteInvoice}
        />
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
    bottom: 40,
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
});

export default InvoicesScreen;
