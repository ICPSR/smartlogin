import { StyleSheet } from "react-native";

// --- Global Styles --- //
export const GlobalStyles = StyleSheet.create({
    background: {
        flex: 1,
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
        marginTop: 25,
        backgroundColor: "teal",
        alignItems: "center",
        justifyContent: "center",
    },

    bigButton: {
        backgroundColor: "teal",
        width: 250,
        height: 250,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },



});
