<template>
	<div id="users">
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>活动管理</el-breadcrumb-item>
			<el-breadcrumb-item>活动列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片区-->
		<el-card>
			<el-row :gutter="20" style="margin-bottom: 20px;">
				<!-- 搜索模块 -->
				<el-col :span="6">
					<el-input placeholder="请输入内容" v-model="userQuery.query" @keyup.enter.native="getUserData" clearable
						@clear="getUserData">
						<el-button slot="append" icon="el-icon-search" @click="getUserData"></el-button>
					</el-input>
				</el-col>
				<!-- 添加用户 -->
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>
			<!-- 用户列表 -->
			<el-row>
				<el-table :data="userData" stripe style="width: 100%" border>
					<el-table-column type="index" width="50">
					</el-table-column>
					<el-table-column prop="username" label="姓名" width="180">
					</el-table-column>
					<el-table-column prop="email" label="邮箱" width="180">
					</el-table-column>
					<el-table-column prop="mobile" label="电话" width="180">
					</el-table-column>
					<el-table-column prop="role_name" label="角色" width="180">
					</el-table-column>
					<el-table-column label="状态" width="180">
						<template v-slot="scope">
							<el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180">
						<template v-slot="scope">
							<!-- 修改用户 -->
							<el-button type="primary" icon="el-icon-edit" size="mini"
								@click="showEditDialog(scope.row)"></el-button>
							<!-- 删除用户 -->
							<el-button type="danger" icon="el-icon-delete" size="mini"
								@click="deleteUserData(scope.row.id)"></el-button>
							<el-tooltip ffect="dark" content="分配角色" placement="right-end" :enterable="false"
								transition="none">
								<el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<!-- 分页区 -->
			<el-row style="margin-top: 10px;">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="userQuery.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="userQuery.pagesize"
					layout=" total,sizes, prev, pager, next, jumper" :total='total'>
				</el-pagination>
			</el-row>
		</el-card>

		<!-- 添加对话框 -->
		<el-dialog title="提示" :visible.sync="addDialogVisible" width="30%" @close="dialogReset('addFormRef')">
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="addForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 修改对话框 -->
		<el-dialog title="提示" :visible.sync="editDialogVisible" width="30%" @close="resetEditDialog('editFormRef')">
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
				<el-form-item label="用户名">
					<el-input v-model="editForm.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="editForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitEditForm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		data() {
			let emailCheck = function(rule, value, callback) {
				if (value === '') {
					callback(new Error('请正确填写邮箱'));
				} else {
					if (value !== '') {
						var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
						if (!reg.test(value)) {
							callback(new Error('请输入有效的邮箱'));
						}
					} else {
						callback();
					}
					callback()
				}
			} //邮箱验证规则
			let mobileCheck = function(rule, value, callback) {
				if (/^1[34578]\d{9}$/.test(value) == false) {
					callback(new Error("请输入正确的手机号"));
				} else {
					callback();
				}
			} //手机号验证规则
			return {
				userData: [], //用户数据
				userQuery: {
					query: '',
					pagenum: 1,
					pagesize: 10
				}, //用户请求参数
				total: 0, //用户总数
				addDialogVisible: false, //添加对话框展示
				editDialogVisible: false, //修改对话框展示
				addForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				}, //添加用户数据	
				addFormRules: {
					username: [{
							required: true,
							message: '请输入用户名称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '用户名长度在 3 到 10 个字符',
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
							message: '密码长度在 6 到 15 个字符',
							trigger: 'blur'
						}
					],
					email: [{
							required: true,
							message: '请输入邮箱号',
							trigger: 'blur'
						},
						{
							validator: emailCheck,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入手机号码',
							trigger: 'blur'
						},
						{
							validator: mobileCheck,
							trigger: 'blur'
						}
					]
				},
				editForm: {}, //编辑用户数据
				editFormRules: {
					email: [{
							required: true,
							message: '请输入邮箱号',
							trigger: 'blur'
						},
						{
							validator: emailCheck,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入手机号码',
							trigger: 'blur'
						},
						{
							validator: mobileCheck,
							trigger: 'blur'
						}
					]
				}
			}
		},
		created() {
			this.getUserData()
		},
		methods: {
			async getUserData() {
				const {
					data: res
				} = await this.$https.get('users', {
					params: this.userQuery
				})
				console.log(res);
				if (res.meta.status == 200) {
					this.userData = res.data.users
					this.total = res.data.total
				} else {
					this.$message(res.meta.msg)
				}

			}, //获取列表数据
			handleSizeChange(size) {
				this.userQuery.pagesize = size
				this.getUserData()
			}, //页面显示大小改变
			handleCurrentChange(page) {
				this.userQuery.pagenum = page
				this.getUserData()
			}, //页码改变
			async userStateChanged(data) {
				const {
					data: res
				} = await this.$https.put(`users/${data.id}/state/${data.mg_state}`)
				if (res.meta.status != 200) {
					data.mg_state = !data.mg_state
					this.$message.error('更新数据失败')
				} else {
					this.$message.success('更新数据成功')
				}
			}, //数据更新
			dialogReset(formName) {
				this.$refs[formName].resetFields();
			}, //重置添加数据
			submitForm() {
				this.$refs.addFormRef.validate(async valid => {
					if (valid) {
						const {
							data: res
						} = await this.$https.post('users', this.addForm)
						if (res.meta.status != 201) {
							this.$message.error('添加用户失败')
						} else {
							this.$message.success('添加用户成功')
							this.addDialogVisible = false
							this.getUserData()

						}
					} else {
						this.$message.error('提交失败')
						return
					}
				});
			}, //提交表单
			showEditDialog(value) {
				this.editForm = Object.assign({}, value)
				this.editDialogVisible = true
			},
			//重置编辑对话框
			resetEditDialog(formName) {
				this.editForm = {}
				this.$refs[formName].resetFields()
			},
			//提交编辑表单
			submitEditForm() {
				this.$refs.editFormRef.validate(async valid => {
					if (valid) {
						const {
							data: res
						} = await this.$https.put('users/' + this.editForm.id, {
							email: this.editForm.email,
							mobile: this.editForm.mobile
						})
						if (res.meta.status != 200) {
							this.$message.error('修改用户失败')
						} else {
							this.$message.success('修改用户成功')
							this.editDialogVisible = false
							this.getUserData()
						}
					} else {
						this.$message.error('修改失败')
						return
					}
				});
			},
			//删除用户数据
			deleteUserData(id) {
				this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$https.delete('users/'+id).then(res =>{
						if(res.data.meta.status==200){
							this.$message({
								type: 'success',
								message: '删除成功!'
							})
							this.getUserData()
						}else{
							this.$message.error('删除失败')
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
		}
	}
</script>

<style scoped>

</style>
