<!--
 * @Descripttion: 
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-07-30 14:39:56
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-09-03 16:22:36
 -->
<!-- 首页 -->
<template>
	<div class="index" style="overflow: hidden;">
        <!-- 侧边导航 -->
        <Nav></Nav>
        <!-- 中间内容区域 -->
		<transition name="custom-classes-transition" enter-active-class="animated fadeIn">
			<router-view></router-view>
		</transition>
	</div>	
</template>

<script>
    import Nav from '@/components/Nav.vue'
	export default {
		name: 'index',
        data() {
  			return {

            };
        },
        components: { Nav }
    };
</script>