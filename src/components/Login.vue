<template>
	<div id="login">
		<div class="login-box">
			<!-- 图片 -->
			<div class="img">
				<img src="@/assets/1.png">
			</div>
			<el-form ref="form" class="login-form" :model="loginForm" :rules="rules" >
				<!-- 输入框 -->
				<el-form-item prop="username">
					<el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
				</el-form-item>
				<el-form-item prop="password" >
					<el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password" 
					@keyup.enter.native="loginJudge">
					</el-input>
				</el-form-item>
				<!-- 按钮 -->
				<el-form-item class="btn">
					<el-button type="primary" @click="loginJudge">登录</el-button>
					<el-button @click="$refs.form.resetFields()">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//表单数据
				loginForm: {
					username: '',
					password: ''
				},
				//输入规则
				rules: {
					username: [{
							required: true,
							message: '请输入用户名称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '长度在 3 到 5 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 15,
							message: '长度在 3 到 5 个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			loginJudge() {
				this.$refs.form.validate(async valid => {
					if (!valid) return;
					const {
						data: res
					} = await this.$https.post('login', this.loginForm)
					console.log(res);
					if (res.meta.status == 200) {
						this.$message({
							showClose: true,
							message: '登录成功',
							type: 'success',
							duration:1000
						});
						window.sessionStorage.setItem("token",res.data.token)
						this.$router.push('/home')
					} else {
						this.$message({
							showClose: true,
							message: '登录失败',
							type: 'error',
							duration:1000
						});
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	#login {
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #264a6b;

		.login-box {
			height: 40vh;
			aspect-ratio: 15/10;
			border-radius: 8px;
			background-color: #fff;
			position: relative;

			.img {
				height: 15vh;
				aspect-ratio: 1;
				border-radius: 50%;
				background-color: #fff;
				box-shadow: 0 0 10px #264a6b;
				position: absolute;
				padding: 5px;
				left: 50%;
				transform: translate(-50%, -50%);
				overflow: hidden;

				img {
					width: 100%;
					aspect-ratio: 1;
					border-radius: 50%;
				}
			}

			.login-form {
				position: absolute;
				width: 100%;
				bottom: 0;
				box-sizing: border-box;
				padding: 0 30px;

				.btn {
					display: flex;
					justify-content: flex-end;
				}
			}
		}
	}
</style>
