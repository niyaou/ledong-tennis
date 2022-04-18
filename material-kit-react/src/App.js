// routes
/* eslint-disable */
import { connect, Provider } from "react-redux";
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import store from "./store/store";

// ----------------------------------------------------------------------

export default function App() {
  return (
    <Provider store={store}>
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Router />
    </ThemeConfig>
    </Provider>
  );
}
