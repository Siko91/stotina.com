import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";

import AppsPage from "./components/AppsPage.vue";
import JokeAppsPage from "./components/JokeAppsPage.vue";
import ToolsPage from "./components/ToolsPage.vue";
import HomePage from "./components/HomePage.vue";

import AboutPage from "./components/AboutPage.vue";
import ArticlePage from "./components/ArticlePage.vue";
import BlogPage from "./components/BlogPage.vue";
import FaqPage from "./components/FaqPage.vue";
import PrivacyPage from "./components/PrivacyPage.vue";
import TermsPage from "./components/TermsPage.vue";

import ProbablyNothingPage from "./components/apps/ProbablyNothingPage.vue";

import BlockInspector from "./components/tools/BlockInspector.vue"
import BsvTestnetWalletPage from "./components/tools/BsvTestnetWalletPage.vue"
import ConsoleBsvJs15Page from "./components/tools/ConsoleBsvJs15Page.vue"
import ConsoleBsvJs20Page from "./components/tools/ConsoleBsvJs20Page.vue"
import ConvertDataPage from "./components/tools/ConvertDataPage.vue"
import CurrencyConverterPage from "./components/tools/CurrencyConverterPage.vue"
import DecodeRawTxPage from "./components/tools/DecodeRawTxPage.vue"
import DuplicateRunTokens from "./components/tools/DuplicateRunTokens.vue"
import EvalBitcoinScriptPage from "./components/tools/EvalBitcoinScriptPage.vue"
import GenerateTestKeysPage from "./components/tools/GenerateTestKeysPage.vue"
import MapiGuiPage from "./components/tools/MapiGuiPage.vue"
import ParseBitcoinUriPage from "./components/tools/ParseBitcoinUriPage.vue"
import RpcDashboardPage from "./components/tools/RpcDashboardPage.vue"
import TransactionGraph from "./components/tools/TransactionGraph.vue"
import TxDemoPage from "./components/tools/TxDemoPage.vue"
import StopwatchPage from "./components/tools/StopwatchPage.vue"
import NotImplementedPage from "./components/tools/NotImplementedPage.vue"
import HtmlVisualizer from "./components/tools/HtmlVisualizer.vue"

require("jquery");
require("bootstrap");
require("./assets/css/bootstrap-cyborg.min.css");
require("./assets/css/tooltip.css");
require("@fortawesome/fontawesome-free");
require("@fortawesome/fontawesome-free/css/all.min.css");

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },

    { path: "/tools", component: ToolsPage },

    { path: "/tools/blockstats", component: BlockInspector },
    { path: "/tools/decoderaw", component: DecodeRawTxPage },
    { path: "/tools/decoderaw/:rawtx", component: DecodeRawTxPage },
    { path: "/tools/parseuri", component: ParseBitcoinUriPage },
    { path: "/tools/parseuri/:uri", component: ParseBitcoinUriPage },
    { path: "/tools/currencyconverter", component: CurrencyConverterPage },
    { path: "/tools/scripteval", component: EvalBitcoinScriptPage },
    { path: "/tools/scripteval/:rawscript", component: EvalBitcoinScriptPage },
    { path: "/tools/generatekey", component: GenerateTestKeysPage },
    { path: "/tools/convertdata", component: ConvertDataPage },
    { path: "/tools/txgraph", component: TransactionGraph },
    { path: "/tools/txdemo", component: TxDemoPage },
    { path: "/tools/testnetwallet", component: BsvTestnetWalletPage },
    { path: "/tools/debugbsv15", component: ConsoleBsvJs15Page },
    { path: "/tools/debugbsv2", component: ConsoleBsvJs20Page },
    { path: "/tools/rpcdashboard", component: RpcDashboardPage },
    { path: "/tools/mapigui", component: MapiGuiPage },
    { path: "/tools/duplicatetoken/run", component: DuplicateRunTokens },
    { path: "/tools/stopwatch", component: StopwatchPage },

    { path: "/tools/color-palette", component: NotImplementedPage },
    { path: "/tools/paint", component: NotImplementedPage },
    { path: "/tools/convert-doc", component: NotImplementedPage },
    { path: "/tools/cron", component: NotImplementedPage },
    { path: "/tools/diff", component: NotImplementedPage },
    { path: "/tools/html-viewer", component: HtmlVisualizer },
    { path: "/tools/js-runner", component: NotImplementedPage },
    { path: "/tools/json-path", component: NotImplementedPage },
    { path: "/tools/lorem", component: NotImplementedPage },
    { path: "/tools/markdown-viewer", component: NotImplementedPage },
    { path: "/tools/qr", component: NotImplementedPage },

    { path: "/apps", component: AppsPage },

    { path: "/joke-apps", component: JokeAppsPage },
    { path: "/joke-apps/probably-nothing", component: ProbablyNothingPage },

    { path: "/about", component: AboutPage },
    { path: "/article", component: ArticlePage },
    { path: "/blog", component: BlogPage },
    { path: "/faq", component: FaqPage },
    { path: "/privacy", component: PrivacyPage },
    { path: "/terms", component: TermsPage },
  ],
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
