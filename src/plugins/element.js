import Vue from 'vue'
import { Button,Form,Input,FormItem,Message,Header,Aside,Main,Container,Submenu,Menu,MenuItem,MessageBox} from 'element-ui';
import { Breadcrumb,BreadcrumbItem,Row,Col,Card,Table,TableColumn,Switch,Tooltip,Pagination,Dialog} from 'element-ui';
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Container)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)



Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm