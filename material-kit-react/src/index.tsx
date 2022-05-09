/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-23 11:44:46
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-19 19:56:16
 * @content: edit your page content
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from "react-redux";
import PangooDMApplication from './pages/dataMarketApp';
import { CombinedState } from './store/actions/stateInterfaces';
import store from "./store/store";

interface StateToProps {
}

interface DispatchToProps {

}

function mapStateToProps(state: CombinedState): StateToProps {

  return {}
}
function mapDispatchToProps(dispatch: any): DispatchToProps {
  return {}
}

const ReduxAppWrapper = connect(mapStateToProps, mapDispatchToProps)(PangooDMApplication);

ReactDOM.render(
  <Provider store={store} >
    <PangooDMApplication />
  </Provider>,
  document.getElementById('root')
);
