import axios from '../plugins/axios';

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 */
export function get(url, data) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: data
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} data [请求时携带的参数] 
 */
export function post(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
// ---------  登录页面 ------------
// 登录请求
export const login = data => post('login', data);
// ---------  左侧导航菜单 -----------
// 左侧导航栏请求
export const menus = data => get('menus', data);
// ---------  users:用户列表  ---------
// 用户数据列表
export const users = data => get('users', data)
// 添加用户
export const creat = data => post('users', data)
// 查询数据
export const update = data => get(data)
// 修改数据
export const put = data => axios.put(`users/${data.id}`, data)
// 删除数据
export const del = data => axios.delete(data)
// 修改状态
export const state = data => axios.put(`users/${data.uId}/state/${data.type}`)
// --------- roles:角色列表 ----------
// 角色列表
export const roles = data => get('roles', data)
// 添加角色
export const addroles = data => post('roles',data)
// 删除角色
export const delList = data => axios.delete(data)
// 查询角色id
export const queryList = data => get(data)
// 修改当前角色
export const isEditLiseEd = data => axios.put(`roles/${data.roleId}`,data)
// --------- rights:权限列表 ----------
// 权限列表
export const rights = data => get(`rights/${data}`)
// 分配权限
// export const rights = data => get(`rights/${data}`)  