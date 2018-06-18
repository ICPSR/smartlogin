import { StyleSheet } from "react-native";

// --- Style Sheet --- //
export const Styles = StyleSheet.create({
    // --- Global Styles --- //
    background: {
        flex: 1,
        backgroundColor: "#005050",
    },


    /// --- Login Page Styles --- //
    titleContainer: {
        marginTop: 25,
        backgroundColor: "teal",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        //fontFamily: "BEHATRICE",
        fontSize: 100,
        fontWeight: 'bold',
        color: "white",
    },
    buttonContainer: {
        marginTop: "60%",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    bigButton: {
        backgroundColor: "teal",
        width: 250,
        height: 250,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
    button: {
        backgroundColor: "teal",
        width: 200,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
    textContainer: {
        marginTop: 50,
        backgroundColor: "#005050",
        alignItems: "center",
        justifyContent: "center",
    },
    textInputContainer: {
        margin: 30,
    },
    textInput: {
        height: 40,
        padding: 10,
        fontSize: 20,
        color: "white",
    },
    text: {
        fontSize: 20,
        padding: 10,
        color: "white",
        fontWeight: 'bold',
    },
    smallText: {
        fontSize: 18,
        padding: 10,
        color: "white",
        textDecorationLine: "underline",
    }
});
