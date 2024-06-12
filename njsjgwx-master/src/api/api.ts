import Taro from "@tarojs/taro"
import domain from "./domain";
import { isWeb } from '../utils/envUtil'
import carousel1 from '../assert/Carousel1.jpg'
import carousel2 from '../assert/Carousel2.jpg'
import carousel3 from '../assert/Carousel3.jpg'
import carousel4 from '../assert/Carousel4.jpg'
import carousel5 from '../assert/Carousel5.jpg'

export const USER_SERVICE = isWeb() ? "/njjzyxh": domain.getBaseUrl() + "/njjzyxh";

/**
 * 心跳检测 登录检测 考试心跳，获取服务器时间和开始考试时间 检测的数据格式
 */
export interface ExamHeartbeatRes {
    /*返回代码 */
    code: number;
    /*返回处理消息 */
    message: string;
    /*返回数据对象 */
    result: {
        createTime:string;
        time:string;
        answeredTime:number;
    };
    /*成功标志 */
    success: boolean;
    /*时间戳 */
    timestamp: number;
}

/**
 * 查询当前用户的考试项目 getExamProjectByUser 的数据格式
 */
export interface GetExamProjectByUserRes {
    /*返回代码 */
    code: number;
    /*返回处理消息 */
    message: string;
    /*返回数据对象 */
    result: {
        /* */
        current: number;
        /* */
        pages: number;
        /* */
        records: {
            /*解答题个数 */
            answersNum: number;
            /*解答题分值 */
            answersScore: number;
            /*创建人 */
            createBy: string;
            /*创建日期 */
            createTime: string;
            /*自动保存周期（分） */
            cycle: string;
            /*结束时间 */
            endTime: string;
            /*是否允许重考 */
            examAgain: string;
            /*是否开启 */
            examStat: string;
            /*考试时长(分) */
            examTime: number;
            /*主键 */
            id: string;
            /*组卷考题固定 */
            isFxed: string;
            /*显示图片 */
            logo: string;
            /*多选题题库信息 */
            multiple: string;
            /*多选题个数 */
            multipleNum: number;
            /*多选题分值 */
            multipleScore: number;
            /*考试项目名称 */
            name: string;
            /*多选给分规则 */
            optionScoreRule: number;
            /*试卷状态 */
            paperStatus: string;
            /*试卷id */
            paperid: string;
            /*判断题个数 */
            pdNum: number;
            /*判断题分值 */
            pdScore: number;
            /*是否练习 */
            practice: string;
            /*专业 */
            professional: string;
            /*信息发布时间 */
            publishTime: string;
            /*单选题题库信息 */
            radio: string;
            /*单选题个数 */
            radioNum: number;
            /*单选题分值 */
            radioSource: number;
            /*考试说明 */
            remark: string;
            /*抽题方式 */
            selectQuestionWay: number;
            /*验卷显示答案 */
            showAnswers: string;
            /*开始时间 */
            startTime: string;
            /*所属部门 */
            sysOrgCode: string;
            /*租户 */
            tenantId: string;
            /*更新人 */
            updateBy: string;
            /*更新日期 */
            updateTime: string;
            selectQuestionWay_dictText:string;
            professional_dictText:string;
            optionScoreRule_dictText:string;
        }[];
        /* */
        size: number;
        /* */
        total: number;
    };
    /*成功标志 */
    success: boolean;
    /*时间戳 */
    timestamp: number;
}

/**
 * getScoreByUser 查询当前用户需要学习的课程 的数据格式
 */
export interface GetScoreByUserRes {
    /*返回代码 */
    code: number;
    /*返回处理消息 */
    message: string;
    /*返回数据对象 */
    result: {
        /* */
        current: number;
        /* */
        pages: number;
        /* */
        records: {
            /*课件附件 */
            attachment: string;
            /*点击数 */
            clickNum: number;
            /*课程编码 */
            code: string;
            /*创建人 */
            createBy: string;
            /*创建日期 */
            createTime: string;
            /*课程描述 */
            description: string;
            /*时长 */
            duration: number;
            /*课程导学 */
            guidance: string;
            /*主键 */
            id: string;
            /* */
            lastLeardDate: string;
            /* */
            learedTime: number;
            /*封面图片 */
            logo: string;
            /*课程名称 */
            name: string;
            /*课程大纲 */
            outline: string;
            /*所属专业 */
            professional: string;
            /* */
            status: string;
            /*流地址 */
            streaming: string;
            /*所属部门 */
            sysOrgCode: string;
            /*师资介绍 */
            teachersIntro: string;
            /*租户 */
            tenantId: string;
            /*课程类型 */
            type: string;
            /*更新人 */
            updateBy: string;
            /*更新日期 */
            updateTime: string;
            /*多媒体附件 */
            video: string;
            type_dictText:string;
            professional_dictText:string;
        }[];
        /* */
        size: number;
        /* */
        total: number;
    };
    /*成功标志 */
    success: boolean;
    /*时间戳 */
    timestamp: number;
}

/**
 * queryCourseNote 根据课程信息获取课程笔记 的数据格式
 */
export interface QueryCourseNoteRes {
    /*返回代码 */
    code: number;
    /*返回处理消息 */
    message: string;
    /*返回数据对象 */
    result: {
        /*笔记内容 */
        content: string;
        /*课程 */
        course: string;
        /*创建人 */
        createBy: string;
        /*创建日期 */
        createTime: string;
        /*用户 */
        examinee: string;
        /*主键 */
        id: string;
        /*所属部门 */
        sysOrgCode: string;
        /*标题 */
        title: string;
        /*更新人 */
        updateBy: string;
        /*更新日期 */
        updateTime: string;
    };
    /*成功标志 */
    success: boolean;
    /*时间戳 */
    timestamp: number;
}

/**
 * 获取当前用户所报名的专业及学习情况 getCurUserPro 的数据格式
 */
export interface getCurUserProRes {
    /*返回代码 */
    code: number;
    /*返回处理消息 */
    message: string;
    /*返回数据对象 */
    result: {
        /* */
        current: number;
        /* */
        pages: number;
        /* */
        records: {
            /*证书信息 */
            certificate: string;
            /*证书编号 */
            certificateNum: string;
            /*创建人 */
            createBy: string;
            /*创建日期 */
            createTime: string;
            /*考试状态 */
            examStat: string;
            /*是否已生成证书 */
            genCertificate: string;
            /*是否已缴费 */
            hasPayment: string;
            /*主键 */
            id: string;
            /*已学时长 */
            learned: number;
            /*试卷 */
            paperid: string;
            /*缴费方式 */
            paymentWay: string;
            /*所属专业 */
            professional: string;
            /*考试分数 */
            score: number;
            /*所属部门 */
            sysOrgCode: string;
            /*租户 */
            tenantId: string;
            /*学员信息 */
            uid: string;
            /*更新人 */
            updateBy: string;
            /*更新日期 */
            updateTime: string;
            /*需要学习时间*/
            totalTime:number;
            /*专业名*/
            professional_dictText;
        }[];
        /* */
        size: number;
        /* */
        total: number;
    };
    /*成功标志 */
    success: boolean;
    /*时间戳 */
    timestamp: number;
}

/**
 * 刷新学时 calcLearndTime
 */
export interface CalcLearndTimeRes {
    /*返回代码 */
    code: number;
    /*返回处理消息 */
    message: string;
    /*返回数据对象 */
    result: string;
    /*成功标志 */
    success: boolean;
    /*时间戳 */
    timestamp: number;
}


/**
 * genCert 生成合格证的回显
 */
export interface GenCertRes {
    /*返回代码 */
    code: number;
    /*返回处理消息 */
    message: string;
    /*返回数据对象 */
    result: string;
    /*成功标志 */
    success: boolean;
    /*时间戳 */
    timestamp: number;
}

/**
 * 获取getAnnouncement，这里还没有解析
 */
export interface GetAnnouncementRes {
    /*返回代码 */
    code: number;
    /*返回处理消息 */
    message: string;
    /*返回数据对象 */
    result: {
        anntMsgList:{
            busId:string;
            busType:string;
            cancelTime:string;
            createBy:string;
            createTime:string;
            delFlag:string;
            dtTaskId:string;
            endTime:string;
            id:string;
            msgAbstract:string;
            msgCategory: string;
            /*** 具体内容*/
            msgContent: string;
            msgType: string;
            openPage: string;
            openType: string;
            priority:string;
            readFlag: string;
            sendId: string;
            sendStatus: string;
            /*** 发送时间*/
            sendTime: string;
            /*** 发送人*/
            sender: string;
            starFlag: string;
            startTime: string;
            tenantId: string;
            /** 标题*/
            titile: string;
            updateBy: string;
            updateTime: string;
            userIds: string;
        }[];
        /***通知总数*/
        anntMsgTotal:number;
        sysMsgList:[];
        sysMsgTotal:number;
    };
    /*成功标志 */
    success: boolean;
    /*时间戳 */
    timestamp: number;
}

export interface GetHomeRegionRes {
    /*返回代码 */
    code: number;
    /*返回处理消息 */
    message: string;
    /*返回数据对象 */
    result: [];
    /*成功标志 */
    success: boolean;
    /*时间戳 */
    timestamp: number;
}


export interface TreeNode {
    id: string;
    name: string;
    parent: string;
    type: string;
    child: TreeNode[];
};

// 解析的树结构
export interface QueryProfessionalTreeRes {
    /*返回代码 */
    code: number;
    /*返回处理消息 */
    message: string;
    /*返回数据对象 */
    result: TreeNode[];
    /*成功标志 */
    success: boolean;
    /*时间戳 */
    timestamp: number;
}



class api {

    /**
     * 移动端登录，并设置token
     * @param params 用户的用户名和密码
     */
    setToken(params: object){
        return this.login(USER_SERVICE+"/m/api/mLogin",params)
    }


    /**
     * 获取当前用户信息
     */
    getExamineeInfo(){
        return this.sendRequest(USER_SERVICE+"/m/api/getExamineeInfo",{},"POST")
    }

    /**
     * 查询当前用户需要学习的课程
     * @param params
     * ｛
     * pageNo 多少页
     * pageSize 每页显示多少
     * ｝
     */
    getScoreByUser(params: object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/getScoreByUser",params,"GET")
            .then((response: GetScoreByUserRes) => {
                return response;
            })
            .catch((error) => {
                console.error("Request failed", error);
                throw error;
            });
    }


    /**
     * 查询当前用户的考试项目
     * @param params
     * ｛
     * pageNo 多少页
     * pageSize 每页显示多少
     * ｝
     */
    getExamProjectByUser(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/getExamProjectByUser",params,"POST")
            .then((response: GetExamProjectByUserRes) => {
                return response;
            })
            .catch((error) => {
                console.error("Request failed", error);
                throw error;
            });
    }

    /**
     * 获取当前用户所报名的专业及学习情况
     * ｛
     * pageNo 多少页
     * pageSize 每页显示多少
     * ｝
     */
    getCurUserPro(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/getCurUserPro",params,"POST")
            .then((response: getCurUserProRes) => {
                return response;
            })
            .catch((error) => {
                console.error("Request failed", error);
                throw error;
            });
    }

    /**
     * 判断是否可以进入考试
     * @param params
     * {
     *     examid 考试的ID
     * }
     */
    judgeEnterExam(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/judgeEnterExam",params,"POST")
    }

    /**
     * 根据专业获取课程信息
     * @param params
     * {
     *     proid 专业的ID
     *     pageNo 多少页
     *     pageSize 每页显示多少
     * }
     */
    listCourse(params:object){
        return this.sendRequest(USER_SERVICE+"/m/api/listCourse",params,"POST")
    }

    /**
     * 重考
     * @param params
     * {
     *     professional 考试ID
     * }
     */
    reexam(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/reexam",params,"POST")
    }


    /**
     * 保存学习时间
     * @param params
     * {
     *     scoreid 课程名称
     *     time 时间
     * }
     */
    saveLeardTime(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/saveLeardTime",params,"POST")
    }


    /**
     * 开始考试
     * @param proid 试卷的ID
     */
    startExam(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/startExam",params,"POST")
    }


    startLearning(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/startLearning",params,"POST")
    }


    /**
     * *保存答案或交卷
     *      * answers： [{'id':'75e14a41-5eed-4ade-892d-0878404443a2','exaAnswer':'ABDE'},{'id':'a27f56d3-55c6-4989-9ed0-7baacd597c22','exaAnswer':'A'}]
     *      * type ：1
     *      * @param answers 考生答题的情况，可以只需要传入已答题ID和答案即可
     *      * @param type  类型，0临时保存，1交卷
     *      * @param req
     *
     */
    saveAnswer(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/saveAnswer",params,"POST")
    }


    /**
     * 查询当前所有的考试记录
     * @param params
     * pageNo
     * pageSize
     */
    querExamLog(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/querExamLog",params,"POST")
    }

    /**
     * 验卷
     * @param params paperid 验证卷子
     */
    inspectPapers(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/inspectPapers",params,"POST")
    }


    /**
     * 添加后者修改学习笔记
     * @param params
     * {
     *   "content": "", 	笔记内容
     *   "course": "",      课程
     *   "createBy": "",    创建人
     *   "createTime": "",  创建日期
     *   "examinee": "",    用户
     *   "id": "",          主键
     *   "sysOrgCode": "", 	所属部门
     *   "title": "",     	标题
     *   "updateBy": "", 	更新人
     *   "updateTime": ""   更新日期
     * }
     */
    saveNote(params:object){
        return this.sendRequest(USER_SERVICE+"/m/api/saveNote",params,"POST")
    }


    /**
     * 上传头像，需要单独书写，里面参数验证过多了，这里就返回应该url连接回去，在前端做更多的参数验证
     */
    uploadAvatar(){
        return USER_SERVICE+"/m/api/uploadAvatar"
    }

    headerGet(){
        const token = Taro.getStorageSync('token')
        if (token===null){
            Taro.clearStorageSync();
            Taro.reLaunch({ url: "/pages/index/index" })
        }else{
            return {
                'X-Access-Token': token,
            }
        }
    }


    /**
     * 查看合格证
     * @param params cid
     *
     */
    showCert(params:object){
        return this.getPicture(USER_SERVICE+"/m/api/showCert",params,"GET")
    }

    /**
     * 获取连接
     */
    getShowCertUrl(cid:string){
        return USER_SERVICE+"/m/api/showCert?cid="+cid
    }

    /**
     * 生成
     * @param params
     * professional 专业的ID
     */
    genCert(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/genCert",params,"POST")
            .then((response: GenCertRes) => {
                return response;
            })
            .catch((error) => {
                console.error("Request failed", error);
                throw error;
            });
    }


    /**
     * 获取系统通知公告
     * @param params
     * pageNo
     * pageSize
     */
    getAnnouncement(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/getAnnouncement",params,"GET")
            .then((response: GetAnnouncementRes) => {
                return response;
            })
            .catch((error) => {
                console.error("Request failed", error);
                throw error;
            });
    }

    /**
     * 刷新学时
     */
    calcLearndTime(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/calcLearndTime",params,"GET")
            .then((response: CalcLearndTimeRes) => {
                return response;
            })
            .catch((error) => {
                console.error("Request failed", error);
                throw error;
            });
    }


    /**
     *  用户退出登出
     */
    userLogout(){
        return this.logout(USER_SERVICE+"/m/api/logout")
    }


    /**
     * 获取证书列表
     */
    queryCert(){
        return this.formUrlencoded(USER_SERVICE+"/m/api/queryCert",{},"POST")
    }


    /**
     * 获取首页轮播图
     */
    getBannerList(){
        return [carousel1,carousel2,carousel3,carousel4,carousel5]
    }


    /**
     * 获取考试的开始时间
     * @param params
     */
    examHeartbeat(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/examHeartbeat",params,"POST")
            .then((response: ExamHeartbeatRes) => {
                return response;
            })
            .catch((error) => {
                console.error("Request failed", error);
                throw error;
            });
    }


    /**
     * 这个是网页的请求设置，完整的请求。可以带查询，这里确定不用这个了
     * @param pageNo
     * @param pageSize
     * @param nameVal
     */
    getCourseList(pageNo:number,pageSize:number,nameVal:string){
        let requestParams = {
            "column":"createTime",
            "order":"desc",
            "pageNo":pageNo,
            "pageSize":pageSize,
            "superQueryMatchType":"and",
            "superQueryParams":[{"field":"name","rule":"like","val":nameVal,"type":"text","dbType":"string"}],
            "_t":new Date().getTime(),
        }
        return this.sendRequest(USER_SERVICE+"/exam/tCourse/list",requestParams,"GET")
    }




    /**
     * API 级拿到评论，这里确定不用这个了
     * @param pageNo
     * @param pageSize
     * @param courseId
     */
    getStudyNode(pageNo:number,pageSize:number,courseId:string,createBy:string,examinee:string){
        // 这里就先把所有的弄出来，所有人都看的其他人的
        console.log(createBy,examinee)

        let requestParams = {
            "column":"createTime",
            "order":"desc",
            "pageNo":pageNo,
            "pageSize":pageSize,
            "superQueryMatchType":"and",
            // "superQueryParams":[{"field":"course","rule":"eq","val":courseId,"type":"text","dbType":"string"},{"field":"createBy","rule":"eq","val":createBy,"type":"text","dbType":"string"}],
            "superQueryParams":[{"field":"course","rule":"eq","val":courseId,"type":"text","dbType":"string"}],
            "_t":new Date().getTime(),
        }
        return this.sendRequest(USER_SERVICE+"/examinee/tExamineeNote/list",requestParams,"GET")
    }


    getSysAnnountCement(id:string){
        let requestParams = {
            "column":"createTime",
            "order":"desc",
            "pageNo":1,
            "pageSize":10,
            "superQueryMatchType":"and",
            // "superQueryParams":[{"field":"course","rule":"eq","val":courseId,"type":"text","dbType":"string"},{"field":"createBy","rule":"eq","val":createBy,"type":"text","dbType":"string"}],
            "superQueryParams":[{"field":"id","rule":"eq","val":id,"type":"text","dbType":"string"}],
            "_t":new Date().getTime(),
        }
        return this.sendRequest(USER_SERVICE+"/sys/annountCement/list",requestParams,"GET")
    }





    getInputCode(){
        let currdatetime = new Date().getTime()
        let requestParams ={
            "_t":currdatetime,
        }
        return this.getCaptcha(USER_SERVICE+"/sys/randomImage/"+currdatetime,requestParams,"GET")
    }

    /**
     * 根据课程信息获取课程笔记
     */
    queryCourseNote(params:object){
        return this.formUrlencoded(USER_SERVICE+"/m/api/queryCourseNote",params,"GET")
            .then((response: QueryCourseNoteRes) => {
                return response;
            })
            .catch((error) => {
                console.error("Request failed", error);
                throw error;
            });
    }

    frontPageJumpSet(){
        return this.sendRequestWithoutToken(USER_SERVICE+"/m/api/examHeartbeat","POST")
    }

    /**
     * 这里还没有用，到时候添加的后端的
     */
    getHomeRegion(){
        return this.sendRequestWithoutToken(USER_SERVICE+"/m/api/getHomeRegion","POST")
            .then((response: GetHomeRegionRes) => {
                return response;
            })
            .catch((error) => {
                console.error("Request failed", error);
                throw error;
            });
    }

    judgeHaveToken(){
        const token = Taro.getStorageSync('token')
        if (token!==null&&token!==''){
            return true
        }else {
            Taro.clearStorageSync();
            return false
        }
    }

    /**
     * 获取专业类别和专业组成的树，是塞在child里面的，层级解析就行了
     */
    queryProfessionalTree(){
        return this.formUrlencoded(USER_SERVICE+"/m/api/queryProfessionalTree",{},"GET")
            .then((response: QueryProfessionalTreeRes) => {
                return response;
            })
            .catch((error) => {
                console.error("Request failed", error);
                throw error;
            });
    }


    async getCaptcha(url:string = "",data: Object = {},method: "GET" | "POST" | "PUT" = "POST"){
        console.log(url)
        return await new Promise<any>((resolve, reject) => {
            Taro.request<any>({
                timeout: 1000 * 60,
                url: url,
                method:method,
                data:data,
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: res => {
                    resolve(res.data as any)
                },
                fail: e => {
                    console.log("请求错误查看：",e)
                    Taro.showToast({ title: '未知错误' });
                    Taro.hideLoading()
                    reject(e)
                }
            })
        })
    }



    async sendRequestWithoutToken(url:string = "",method: "GET" | "POST" | "PUT" = "POST"){
        return await new Promise<any>((resolve, reject) => {
            Taro.request<any>({
                timeout: 1000 * 60,
                url: url,
                data:{
                    "paperid":""
                },
                method:method,
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: res => {
                    resolve(res.data as any)
                },
                fail: e => {
                    console.log("请求错误查看：",e)
                    Taro.showToast({ title: '未知错误' });
                    Taro.hideLoading()
                    reject(e)
                }
            })
        })
    }

    async sendRequest(url:string = "",data: Object = {},method: "GET" | "POST" | "PUT" = "POST"){
        const token = Taro.getStorageSync('token')
        console.log("请求的token值：",token)
        console.log("请求的参数：",data)
        console.log("请求的url：",url)
        if (token===null){
            Taro.clearStorageSync();
            Taro.reLaunch({ url: "/pages/index/index" })
        }else {
            return await new Promise<any>((resolve, reject) => {
                Taro.request<any>({
                    timeout: 1000 * 60,
                    url: url,
                    method:method,
                    data:data,
                    header: {
                        'X-Access-Token': token,
                        'content-type': 'application/json' // 默认值
                    },
                    success: res => {
                        console.log(res)
                        resolve(res.data as any)
                    },
                    fail: e => {
                        console.log("请求错误查看：",e)
                        Taro.showToast({ title: '未知错误' });
                        Taro.hideLoading()
                        reject(e)
                    }
                })
            })
        }
    }




    async getPicture(url:string= "",data:Object={},method:"GET"){
        const token = Taro.getStorageSync('token')
        if (token===null){
            Taro.clearStorageSync();
            Taro.reLaunch({ url: "/pages/index/index" })
        }else {
            return await new Promise<any>((resolve, reject) => {
                Taro.request<any>({
                    timeout: 1000 * 60,
                    url: url,
                    method:method,
                    data:data,
                    header: {
                        'X-Access-Token': token,
                        'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    responseType:"arraybuffer",
                    success: res => {

                        console.log(res.header)

                        let header = res.header
                        let disposition = ""
                        Object.entries(header).forEach(([k, v]) => {
                            if (k==="Content-Disposition"){
                                disposition=v
                            }
                        });
                        const parts = disposition.split(';');
                        const fileName = parts.find(part => part.includes('fileName=')).split('=')[1];
                        console.log("文件名:",fileName)
                        resolve({
                                fileName:fileName,
                                data:res.data,
                        }as any)
                    },
                    fail: e => {
                        console.log("请求错误查看：",e)
                        Taro.showToast({ title: '未知错误' });
                        Taro.hideLoading()
                        reject(e)
                    }
                })
            })
        }
    }


    async formUrlencoded(url:string = "",data: Object = {},method: "GET" | "POST" | "PUT" = "POST"){
        const token = Taro.getStorageSync('token')
        console.log("请求的token值：",token)
        console.log("请求的参数：",data)
        console.log("请求的url：",url)
        if (token===null){
            Taro.clearStorageSync();
            Taro.reLaunch({ url: "/pages/index/index" })
        }else {
            return await new Promise<any>((resolve, reject) => {
                Taro.request<any>({
                    timeout: 1000 * 60,
                    url: url,
                    method:method,
                    data:data,
                    header: {
                        'X-Access-Token': token,
                        'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    success: res => {
                        console.log("返回的参数",res)
                        resolve(res.data as any)
                    },
                    fail: e => {
                        console.log("请求错误查看：",e)
                        Taro.showToast({ title: '未知错误' });
                        Taro.hideLoading()
                        reject(e)
                    }
                })
            })
        }
    }

    /**
     * 无论怎么样都退出到主页面
     * @param url
     */
    async logout(url:string= ""){
        const token = Taro.getStorageSync('token')
        if (token===null){
            Taro.clearStorageSync();
            Taro.reLaunch({ url: "/pages/index/index" })
        }else {
            return await new Promise<any>((resolve, reject) => {
                Taro.request<any>({
                    timeout: 1000 * 60,
                    url: url,
                    method:"GET",
                    header: {
                        'X-Access-Token': token,
                        'content-type': 'application/json' // 默认值
                    },
                    success: res => {
                        console.log("返回的参数",res)
                        const { code } = res.data || {};
                        if (code ===200){
                            resolve(res.data as any)
                            Taro.clearStorageSync();
                            Taro.reLaunch({ url: "/pages/index/index" })
                        }else {
                            Taro.clearStorageSync();
                            Taro.reLaunch({ url: "/pages/index/index" })
                        }
                    },
                    fail: e => {
                        console.log("请求错误查看：",e)
                        Taro.showToast({ title: '未知错误' });
                        Taro.hideLoading()
                        reject(e)
                        Taro.clearStorageSync();
                        Taro.reLaunch({ url: "/pages/index/index" })
                    }
                })
            })
        }
    }


    async login(url:string = "",data: Object = {}){
        console.log("请求的参数：",data)
        console.log("请求的url：",url)
        return await new Promise<any>((resolve, reject) => {
            Taro.request<any>({
                timeout: 1000 * 60,
                url: url,
                method:"POST",
                data:data,
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: res => {
                    console.log(res)
                    const { code, result } = res.data || {};
                    if (code === 200){
                        let token = result.token
                        console.log("token 获取",token)
                        // 将token放入里面
                        try {
                            // 存入token
                            Taro.setStorageSync('token', token)
                        } catch (e) {
                            console.log(e)
                        }
                        resolve(res.data as any)
                    }else {
                        console.log(res.data)
                        resolve(res.data as any)
                    }
                },
                fail: e => {
                    console.log("请求错误查看：",e)
                    Taro.showToast({ title: '未知错误' });
                    Taro.hideLoading()
                    reject(e)
                }
            })
        })
    }

}

export default new api()
