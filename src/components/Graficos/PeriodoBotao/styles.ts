import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  periodButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    marginHorizontal: 4,
  },

  periodButtonActive: {
    backgroundColor: "#4CAF50",
  },

  periodButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },

  periodButtonTextActive: {
    color: "#FFFFFF",
  },
});

export default styles;
