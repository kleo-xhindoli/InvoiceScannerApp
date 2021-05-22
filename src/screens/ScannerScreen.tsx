import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Image } from "react-native";
import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner";
import useToast from "../hooks/useToast";
import useInvoices from "../hooks/useInvoices";
import Colors from "../constants/theme/Colors";
import FontSizes from "../constants/theme/FontSizes";
import { useBlockForSeconds } from "../hooks/useBlockForSeconds";
import { isValidInvoiceUrl } from "../utils/invoice";
import Spacing from "../constants/theme/Spacing";
import Radii from "../constants/theme/Radii";
import FontWeights from "../constants/theme/FontWeights";

interface ScannerScreenProps {}

const ScannerScreen: React.FC<ScannerScreenProps> = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanningEnabled, disableScanner] = useBlockForSeconds(3);
  const { invoices, addInvoice } = useInvoices();

  const { showToast } = useToast();

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
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
      <BarCodeScanner
        onBarCodeScanned={isScanningEnabled ? handleBarCodeScanned : undefined}
        style={StyleSheet.absoluteFillObject}
      />
      <Image
        width={200}
        height={200}
        source={require("../../assets/target.png")}
      />

      {invoices.length > 0 && (
        <View style={styles.invoiceCounter}>
          <Text style={styles.invoiceCounterText}>{invoices.length}</Text>
        </View>
      )}
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
    backgroundColor: Colors.brand[500],
    borderRadius: Radii.full,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  invoiceCounterText: {
    color: Colors.white,
    fontSize: FontSizes.lg.size,
    fontWeight: FontWeights.bold,
    textAlign: "center",
  },
});

export default ScannerScreen;
