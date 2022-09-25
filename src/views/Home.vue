<template>
	<div>
		<el-container style="height: 100vh;width: 100vw;">
			<!-- 表头部分 -->
			<el-header style="background-color: #363d40;">
				<!-- 系统名称 -->
				<div class="left">
					<div class="img">
						<img src="@/assets/1.png">
					</div>
					<div class="text">
						<p>后台管理系统</p>
					</div>
				</div>
				<!-- 退出按钮 -->
				<div class="right">
					<el-button @click="logout" size="small">登出</el-button>
				</div>
			</el-header>
			<el-container>
				<!-- 侧边栏部分 -->
				<el-aside style="background-color: #313743;" :width="asideWidth" >
					<div class="sliderBar">
						<span @click="collapseChange">
							|||
						</span>
					</div>
					<el-menu background-color="#313743" text-color="#fff" active-text-color="#3d99fd" unique-opened
						style="border-right:none" :collapse="isCollapse" :collapse-transition="false" router >
						<!-- 主菜单 -->
						<el-submenu :index="'/'+item.id" v-for="item in menuList" :key="item.id">
							<template slot="title">
								<i :class="iconObj[item.id]"></i>
								<span>{{item.authName}}</span>
							</template>
							<!-- 子菜单 -->
							<el-menu-item :index="subItem.path+''" v-for="subItem in item.children" :key="subItem.id">
								<template slot="title">
									<i class="el-icon-menu"></i>
									<span>{{subItem.id}}</span>
								</template>
							</el-menu-item>
						</el-submenu>
					</el-menu>
				</el-aside>
				<el-main style="background-color: #e9edf1;">
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				isCollapse: false, //侧边栏展开状态
				menuList: [],//侧边栏数据
				asideWidth:'240px',//侧边栏宽度
				iconObj: {
					125: 'iconfont icon-user',
					103: 'iconfont icon-tijikongjian-xianxing',
					101: 'iconfont icon-shangpin-xianxing',
					102: 'iconfont icon-danju-xianxing',
					145: 'iconfont icon-baobiao-xianxing'
				}
			}
		},
		created() {
			this.getMenuList()
		},
		methods: {
			logout() {
				window.sessionStorage.clear();
				this.$router.replace('/login')
			},//登出功能
			async getMenuList() {
				const {
					data: res
				} = await this.$https.get('menus')
				console.log(res);
				if (res.meta.status != 200) {
					this.$message.error(res.meta.msg)
				}
				this.menuList = res.data

			},//获取侧边栏信息
			collapseChange(){
				this.isCollapse=!this.isCollapse
				if(this.isCollapse){
					this.asideWidth='64px'
				}else{
					this.asideWidth='240px'
				}
				
			}
		}
	}
</script>

<style scoped lang="less">
	.el-container {
		.el-header {
			padding: 0;
			display: flex;

			.left {
				height: 100%;
				display: flex;
				align-items: center;
				margin-left: 10px;

				.img {
					height: 80%;
					aspect-ratio: 1;
					overflow: hidden;
					border-radius: 50%;

					img {
						height: 100%;
					}
				}

				.text {
					font-size: 20px;
					margin-left: 10px;
					height: 100%;
					display: flex;
					align-items: center;
					color: #fff;
				}
			}

			.right {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				margin-right: 10px;
			}
		}
		.el-aside {
			.sliderBar {
				span {
					display: flex;
					width: 100%;
					justify-content: center;
					font-size: 16px;
					line-height: 35px;
					align-items: center;
					color: rgba(255, 255, 255, 0.8);
					cursor: pointer;
					background-color: #313743;
					border-bottom: 1px solid rgba(255,255,255,0.5);
					letter-spacing: 0.2em;
					user-select: none;
				}
			}

			.iconfont {
				margin-right: 10px;
				font-size: 20px;
			}
		}
	}
</style>
