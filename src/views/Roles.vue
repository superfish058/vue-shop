<template>
	<div>
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 角色权限列表 -->
		<el-card>
			<!-- 搜索功能 -->
			<el-row>
				<el-button type="primary" @click="addVisible=true">添加角色</el-button>
			</el-row>
			<el-table :data="rolesList" stripe border style="margin-top: 10px;">
				<!-- 扩展列表 -->
				<el-table-column type="expand">
					<template v-slot="scope">
						<el-row v-for="item,index in scope.row.children" :key="item.id"
							:class="['bdbottom', index!=0 ?'':'bdtop']">
							<el-col :span="5">
								<el-tag closable @close="deleteTag(scope.row,item.id)">
									{{item.authName}}
								</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<el-col :span="19">
								<el-row v-for="item2,index2 in item.children" :key="item2.id"
									:class="[index2==0?'':'bdtop']">
									<el-col :span="5">
										<el-tag type="success" closable @close="deleteTag(scope.row,item2.id)">
											{{item2.authName}}
										</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="19">
										<el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable
											@close="deleteTag(scope.row,item3.id)">
											{{item3.authName}}
										</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<!-- 标识列表 -->
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作">
					<template v-slot="scope">
						<el-button type="primary" icon="el-icon-edit" size="small" @click="setEditForm(scope.row)">编辑
						</el-button>
						<el-button type="danger" icon="el-icon-delete" size="small"
							@click="deleteCurrentRole(scope.row)">删除</el-button>
						<el-button type="warning" icon="el-icon-setting" size="small"
							@click="getDefaultNodes(scope.row)">
							分配权限
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 树形控件对话框 -->
		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="checkedKeys=[]">
			<el-tree :data="rightsList" :props="rightsProps" show-checkbox default-expand-all node-key="id"
				:default-checked-keys="checkedKeys" ref="treeRef"></el-tree>
			<span slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="setCurrentNodes">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 增加角色对话框 -->
		<el-dialog title="提示" :visible.sync="addVisible" width="30%" @close="resetDialog()">
			<el-form ref="addForm" :model="addForm" label-width="80px" :rules="addRoleRules">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="addForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" >
					<el-input v-model="addForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="addNewRole">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑角色对话框 -->
		<el-dialog title="提示" :visible.sync="editVisible" width="30%">
			<el-form ref="editForm" :model="editForm" label-width="80px">
				<el-form-item label="角色ID">
					<el-input v-model="editForm.roleId" disabled></el-input>
				</el-form-item>
				<el-form-item label="角色名称">
					<el-input v-model="editForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述">
					<el-input v-model="editForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitEditForm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				rolesList: [], //角色列表
				dialogVisible: false, //对话框显示标识
				rightsList: [], //权限列表
				rightsProps: {
					children: 'children',
					label: 'authName'
				}, //树形控件匹配规则
				checkedKeys: [], //树形控件默认选中
				roleId: '', //当前角色id
				addVisible: false, //增加角色对话框显示标识
				addForm: {
					roleName: '',
					roleDesc: ''
				}, //增加角色数据
				editVisible: false, //编辑窗格显示标识
				editForm: {
					roleId: '',
					roleName: '',
					roleDesc: ''
				}, //编辑角色数据
				addRoleRules:{
					roleName: [{
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 10,
							message: '用户名长度在 2 到 10 个字符',
							trigger: 'blur'
						}
					],
				}

			}
		},
		created() {
			this.getRolesList()
			this.getRightsList()
		},
		methods: {
			//获取角色列表
			getRolesList() {
				this.$https.get('roles').then(res => {
					this.rolesList = res.data.data
				})
			},
			//获取权限列表
			getRightsList() {
				this.$https.get('rights/tree').then(res => {
					this.rightsList = res.data.data
				})
			},
			//删除角色权限
			deleteTag(role, rightid) {
				this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					const {
						data: res
					} = await this.$https.delete(`roles/${role.id}/rights/${rightid}`)
					console.log(res);
					role.children = res.data
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			//获取默认节点
			getDefaultNodes(role) {
				this.getRightsList()
				this.roleId = role.id
				this.setDefaultNodes(role)
				this.dialogVisible = true
			},
			//设置默认节点树状图
			setDefaultNodes(role) {
				if (!role.children) {
					this.checkedKeys.push(role.id)
				} else {
					role.children.forEach(item => this.setDefaultNodes(item))

				}
			},
			//设置修改选中节点
			setCurrentNodes() {
				const currentNodes = this.$refs.treeRef.getCheckedKeys()
				const halfNodes = this.$refs.treeRef.getHalfCheckedKeys()
				const keyStr = currentNodes.concat(halfNodes).join(',')
				this.$https.post(`roles/${this.roleId}/rights`, {
					rids: keyStr
				}).then(res => {
					if (res.data.meta.status == 200) {
						this.$message.success('更新成功')
						this.getRolesList()
					} else {
						this.$message.error('更新失败')
					}
					this.dialogVisible = false
				})
			},
			//增加新角色
			addNewRole() {
				this.$https.post('roles', this.addForm).then(res => {
					console.log(res);
					if (res.data.meta.status == 201) {
						this.$message.success('添加成功')
						this.getRolesList()
					} else {
						this.$message.error('添加失败')
					}
					this.addVisible = false
				})
			},
			//重置添加对话框
			resetDialog() {
				this.addForm = {}
				this.$refs.addForm.resetFields()
			},
			//设置编辑对话框
			setEditForm(role) {
				this.editVisible = true,
				console.log(role);
				this.editForm.roleId = role.id
				this.editForm.roleName = role.roleName
				this.editForm.roleDesc = role.roleDesc
			},
			//提交编辑表单
			submitEditForm() {
				this.$https.put(`roles/${this.editForm.roleId}`, {
					roleName: this.editForm.roleName,
					roleDesc: this.editForm.roleDesc
				}).then(res => {
					console.log(res);
					if (res.data.meta.status == 200) {
						this.$message.success('设置成功')
						this.getRolesList()
					} else {
						this.$message.error('设置失败')
					}
					this.editVisible = false
					this.editForm = {}
				})
			},
			//删除当前角色
			deleteCurrentRole(role) {
				this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$https.delete(`roles/${role.id}`).then(res => {
						console.log(res);
						if (res.data.meta.status == 200) {
							this.$message.success('删除成功')
						} else {
							this.$message.success('删除失败')
						}
						this.getRolesList()
					})

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			}
		}
	}
</script>

<style scoped>
	.bdtop {
		border-top: 1px solid #ccc;
	}

	.bdbottom {
		border-bottom: 1px solid #ccc;
	}

	.el-tag {
		margin: 10px 7px !important;
		font-size: 16px;
	}

	.el-row {
		display: flex;
		align-items: center;
		padding-top: 2px;
		padding-bottom: 2px;
		padding-left: 5px;
	}
</style>
