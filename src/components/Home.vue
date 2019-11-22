<template>
    <el-card class="cardBox">
        <el-row>
            <p class="titleName">基本信息</p>
            <el-col :span="24">
                <div class="homeContent">
                    <p class="subText">项目介绍</p>
                    <p class="subText">获取帮助</p>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
    export default {
        name: 'home',
        data() {
            return {
                
            }
        },
        created (){
        
        },
        methods: {
        
        }
    }
</script>
<style lang="scss">
    .homeContent {
        padding: 0 20px 20px;
        .subText {
            font-size: 26px;
            line-height: 30px;
            padding-bottom: 10px;   
        };
    }
</style>


