import React from 'react';
import { connect } from 'dva';
import styles from './common.less';
import OrdersComponent from '../components/Orders/Orders';
// import OrderEdit from '../components/Orders/Edit.js';
import MainLayout from '../components/MainLayout/MainLayout';

function Orders(props) {
  return (
      <MainLayout location={location}>
        <div className={styles.normal}>
          <OrdersComponent />
        </div>
      </MainLayout>
  );
};



// function OrderEditRout(props) {
//   return (
//       <MainLayout location={location}>
//         <div className={styles.normal}>
//           <OrderEdit />
//         </div>
//       </MainLayout>
//   );
// };

function mapStateToProps(state) {
  return {};
}


// exports["Orders"] = connect(mapStateToProps)(Orders);
// exports["OrderEditRout"] = connect(mapStateToProps)(OrderEditRout);
export default connect(mapStateToProps)(Orders);
