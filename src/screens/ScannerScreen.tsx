import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Vibration } from "react-native";
import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner";
import useToast from "../hooks/useToast";
import useInvoices, {
  invoiceListSelector,
  totalInvoicesSelector,
} from "../hooks/useInvoices";
import { useBlockForSeconds } from "../hooks/useBlockForSeconds";
import { isValidInvoiceUrl } from "../utils/invoice";
import Counter from "../components/ui/Counter";
import * as Haptics from "expo-haptics";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types/stack";
import { useIsFocused } from "@react-navigation/core";

type ScannerScreenProps = StackScreenProps<RootStackParamList, "Scanner">;

const ScannerScreen: React.FC<ScannerScreenProps> = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanningEnabled, disableScanner] = useBlockForSeconds(3);

  const { addInvoice } = useInvoices();
  const invoicesCount = useInvoices(totalInvoicesSelector);
  const invoices = useInvoices(invoiceListSelector);

  const { showToast } = useToast();
  const isFocused = useIsFocused();

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestPermission();
  }, []);

  useEffect(() => {
    showToast({ text: "Start scanning invoices", duration: 3000 });
  }, []);

  const handleBarCodeScanned: BarCodeScannedCallback = ({ type, data }) => {
    const exists = invoices.some((inv) => inv.url === data);

    if (type !== "org.iso.QRCode") {
      return disableScanner();
    }

    if (!isValidInvoiceUrl(data)) {
      showToast({ text: "Invalid invoice", duration: 2000 });
      return disableScanner();
    }

    if (!exists) {
      addInvoice(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      showToast({ text: "Already Scanned", duration: 1000 });
    }
    disableScanner();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <BarCodeScanner
          onBarCodeScanned={
            isScanningEnabled ? handleBarCodeScanned : undefined
          }
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <Image
        width={200}
        height={200}
        source={require("../../assets/target.png")}
      />

      <Counter
        onPress={() => navigation.navigate("Invoices")}
        style={styles.invoiceCounter}
        value={invoicesCount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  invoiceCounter: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});

export default ScannerScreen;
