import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "rgb(0,24,77)",
    800: "rgb(0,41,130)",
    700: "rgb(0,62,193)",
    600: "rgb(0,75,235)",
    500: "rgb(0,82,255)",
    400: "rgb(16,94,255)",
    300: "rgb(38,110,255)",
    200: "rgb(70,132,255)",
    150: "rgb(115,162,255)",
    100: "rgb(146,182,255)",
    50: "rgb(176,202,255)",
    0: "rgb(245,248,255)",
  },
};

export default extendTheme({
  colors,
  styles: {
    global: {
      "html, body": {
        background: "initial",
        padding: 0,
        margin: 0,
        fontFeatureSettings: `'zero' 1`,
        scrollBehavior: "smooth",
        borderColor: "gray.200",
      },
    },
  },
});
