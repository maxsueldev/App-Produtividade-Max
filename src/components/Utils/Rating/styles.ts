import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  rating: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  star: {
    fontSize: 38,
    color: "#DDDDDD",
  },

  selectedStar: {
    color: "#FFC107",
  },
});

export default styles;
