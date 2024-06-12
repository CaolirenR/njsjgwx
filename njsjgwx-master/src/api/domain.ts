import Taro from "@tarojs/taro";


/**
 * 如果需要本地开发测试，关闭http 验证 ，然后下面替换为 develop  this.baseUrl
 */

// const local = 'http://192.168.10.15:8080';

const httpsUrlSet = "https://exam.njscia.com"



class domain {
    baseUrl: String
    constructor() {
        this.baseUrl = ""
    }

    getBaseUrl() {
        // wx 为空，非小程序模式
        const { miniProgram } = Taro.getAccountInfoSync();
        if(!miniProgram) {
            this.baseUrl = httpsUrlSet;
            return this.baseUrl;
        }
        const { envVersion } = miniProgram
        console.log("当前开发环境，envVersion: " + envVersion);
        switch (envVersion) {
            case "develop":
                // 开发版
                this.baseUrl = httpsUrlSet;
                break;
            case "release":
                this.baseUrl = httpsUrlSet;
                break
            case "trial":
                this.baseUrl = httpsUrlSet;
            default:
                // 正式版
                this.baseUrl = httpsUrlSet;
                break;
        }
        return this.baseUrl;
    }
}

export default new domain();
