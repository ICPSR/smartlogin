import { StyleSheet } from "react-native";
import Expo, { Constants } from "expo";

// --- Global Styles --- //
export const GlobalStyles = StyleSheet.create({
    background: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#005050",
    },
    text: {
        fontSize: 18,
        padding: 10,
        color: "white",
    },
    boldText: {
        fontSize: 20,
        padding: 10,
        color: "white",
        fontWeight: 'bold',
    },
    underlineText: {
        fontSize: 18,
        padding: 10,
        color: "white",
        textDecorationLine: "underline",
    },

    header: {
        backgroundColor: "teal",
        alignItems: "center",
        justifyContent: "center",
    },

    bigButton: {
        backgroundColor: "teal",
        flex: 1,
        marginHorizontal: "5%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
    backButton: {
        backgroundColor: "#605f5e",
        width: 150,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
    },



});
