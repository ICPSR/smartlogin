import { StyleSheet } from "react-native";
import Expo, { Constants } from "expo";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// --- Global Styles --- //
export const GlobalStyles = StyleSheet.create({
    background: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#005050",
    },
    header: {
        backgroundColor: "teal",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: moderateScale(18),
        padding: moderateScale(10),
        color: "white",
    },
    boldText: {
        fontSize: moderateScale(20),
        padding: moderateScale(10),
        color: "white",
        fontWeight: 'bold',
    },
    underlineText: {
        fontSize: moderateScale(18),
        padding: moderateScale(10),
        color: "white",
        textDecorationLine: "underline",
    },
});