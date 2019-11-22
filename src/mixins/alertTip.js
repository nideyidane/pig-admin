/*
 * @Author: zhongbin.chen 
 * @Date: 2019-02-20 17:46:10 
 */

export default {
    name: 'alert-tip',
    methods: {
        tip(msg, msgtype, ms) {
            this.$message({
                showClose: true,
                message: msg,
                type: msgtype,
                duration: ms | 2000
            });
        },
        alert(msg) {
            this.$alert(msg, '提示', {
                confirmButtonText: '确定',
            });
        }
    }
}