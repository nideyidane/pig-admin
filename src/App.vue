<template>
    <div id="app">
        <router-view v-wechat-title="$route.meta.title" v-if="isRouterAlive"></router-view> 
    </div>
</template>

<script>
    export default {
        name: 'app',
        data (){
            return{
                isRouterAlive: true
            }
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'backToTop',
        },
        provide () {
            return {
                reload: this.reload
            }
        },
        methods: {
            backToTop(){
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            },
            reload () {
                this.isRouterAlive = false;
                this.$nextTick(() => (this.isRouterAlive = true));
            }  
        }
    }
</script>

<style lang="scss">
	@import '../static/css/common';
</style>