import Vue from 'vue'
import App from './App'
import store from "./store";
import VueI18n from 'vue-i18n'
import {getItem} from "./pages/util/storageHelper";
import Picker from "./common/Picker";
import wfc from "./wfc/client/wfc";

Vue.config.productionTip = false

App.mpType = 'app'

Vue.use(VueI18n)
Vue.use(Picker)

const i18n = new VueI18n({
    // 使用localStorage存储语言状态是为了保证页面刷新之后还是保持原来选择的语言状态
    locale: getItem('lang') ? getItem('lang') : 'zh-CN', // 定义默认语言为中文
    messages: {
        'zh-CN': require('@/assets/lang/zh-CN.json'),
        'zh-TW': require('@/assets/lang/zh-TW.json'),
        'en': require('@/assets/lang/en.json')
    }
})

// 如果不存在会话页面，则入栈，如果已经存在会话页面，则返回到该页面
Vue.prototype.$go2ConversationPage = () => {
    let pages = getCurrentPages();
    let cvRoute = 'pages/conversation/ConversationView'
    let delta = 0;
    let found = false;
    for (let i = pages.length - 1; i >=0 ; i--) {
        if (pages[i].route === cvRoute){
            found = true;
            break;
        } else {
            delta ++;
        }
    }
    if (found){
        uni.navigateBack({
            delta: delta,
            fail: err => {
                console.log('nav back to conversationView err', err);
            }
        });
    } else {
        uni.navigateTo({
            url: '/pages/conversation/ConversationView',
            success: () => {
                console.log('nav to conversationView success');

            },
            fail: (err) => {
                console.log('nav to conversationView err', err);
            }
        })
    }
}

Vue.prototype._i18n = i18n;
const app = new Vue({
    i18n,
    ...App
})

app.store = store;
wfc.init();
store.init();

app.$mount()
