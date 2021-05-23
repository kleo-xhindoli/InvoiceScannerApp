import React from "react";
import { View, StyleSheet } from "react-native";
import Radii from "../../constants/theme/Radii";
import Spacing from "../../constants/theme/Spacing";
import Modal from "react-native-modal";
import Colors from "../../constants/theme/Colors";

interface ActionSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function ActionSheet({
  isOpen,
  onClose,
  children,
}: ActionSheetProps) {
  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={"down"}
      style={styles.modal}
      backdropOpacity={0.6}
      backdropTransitionInTiming={0}
    >
      <View style={styles.modalSheet}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View style={styles.modalHandle} />
        </View>
        <View style={styles.modalContent}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalSheet: {
    width: "100%",

    borderTopLeftRadius: Radii["3xl"],
    borderTopRightRadius: Radii["3xl"],
    overflow: "hidden",
    backgroundColor: Colors.white,
  },
  modalHandle: {
    width: 50,
    height: 4,
    backgroundColor: Colors.gray[400],
    marginVertical: Spacing[4],
    borderRadius: Radii.full,
  },
  modalContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[8],
  },
});
