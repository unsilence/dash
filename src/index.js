import dva from 'dva';
import createLoading from 'dva-loading';
import { browserHistory } from 'dva/router';

import './index.html';

import * as models from './models'

try{

    (async function() {

      let rt = await models.checkAccount()
      let opt = {history:browserHistory}
      if(rt.data.status !== 'success'){
          console.log('check false',rt)
           console.log('你没有登录')
           localStorage.setItem("token", "");
           localStorage.setItem("user","{}");
      }else{

      }
      const app = dva(opt);
      app.use(createLoading());
      Object.keys(models).filter(v=>v.endsWith('Model')).map(cls=>{
          console.log('load ... model:',cls)
          app.model(models[cls])
      })
    //   var d = await models.login()
    //   console.log("dd",{d})
    console.log(app);
    app.router(require('./router'));
    app.start('#root');



    })();

}catch(e){
    console.error(e.message);
}
