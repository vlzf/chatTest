- method：
- url：/LZFWX/
- param：  
  - type
- return：
``` json
// 成功
{
    "result": "success",
    "message": ""
}
// 失败
{
    "result": "failed",
    "message": ""
}
```


## 1. 注册
- method：POST
- url：/LZFWX/register
- param：
  - string account     // 账号
  - string password    // 密码
- return：
``` json
// 成功
{
    "result": "success",
    "message": {
        "account": ""
    }
}
// 失败
{
    "result": "failed",
    "message": ""
}
```



## 2. 登录
- method: GET
- url: /LZFWX/login
- param: 
  - string account     // 账号
  - string password    // 密码
- return:
``` json
// 成功
{
    "result": "success",
    "message": {
        "userId": (number)
    }
}
// 失败
{
    "result": "failed",
    "message": ""
}
```


## 3. 获取用户信息
- method：GET
- url：/LZFWX/getUserInfor
- param：
  - 无
- return：
``` json
// 成功
{
    "result": "success",
    "message": {
        "address": "",//字符串
        "mailbox": "",//字符串，用户的email
        "introduction": "",//字符串，用户设置的自我介绍
        "nickName": "",//字符串，用户的昵称
        "age": null,//用户的年龄
        "userPhoto": "",     // 头像
        "sex": 0 || 1       // "0": 女性;  "1": 男性 
    }
}
// 失败
{
    "result": "failed",
    "message": ""
}
```



## 4. 修改用户信息
- method：POST
- url：/LZFWX/updateUserInfor
- param：  
  - string nickName     // 昵称
  - number age          // 年龄
  - string address      // 所在地区
  - string introduction // 介绍
  - string mailbox      // 用户的email 
  - number sex          // "0": "女", "1": "男"
- return：
``` json
// 成功
{
    "result": "success",
    "message": ""
}
// 失败
{
    "result": "failed",
    "message": ""
}
```


## 5. 更换头像
- method：POST
- url：/LZFWX/uploadPhoto
- param：  
  - file
- return：
``` json
// 成功
{
    "result": "success",
    "message": ""
}
// 失败
{
    "result": "failed",
    "message": ""
}
```



## 6. 寻找联系人
- method：GET
- url：/LZFWX/findFriend
- param：  
  - string account
- return：
``` json
// 成功
{
    "result": "success",
    "message": [
        {
            "account": "",     // 账号
            "userId": null,    // id
            "nickName": "",    // 昵称
            "sex": 0 | 1,      // 性别： "0": "女", "1": "男"
            "userPhoto": "",   // 头像
        },
        {},
    ]
}
// 失败
{
    "result": "failed",
    "message": ""
}
```


## 7. 好友申请
- method：POST
- url：/LZFWX/markFriend
- param：  
  - number receiverId
  - string content
- return：
``` json
// 成功
{
    "result": "success",
    "message": ""
}
// 失败
{
    "result": "failed",
    "message": ""
}
```


## 8. 同意交友
- method：POST
- url：/LZFWX/agreeFriend
- param：  
  - number messageId
  - boolean agree
- return：
``` json
// 成功
{
    "result": "success",
    "message": "已拒绝/已接受"
}
// 失败
{
    "result": "failed",
    "message": ""
}
```


## 9. 发信息
- method：POST
- url：/LZFWX/sendContent
- param：  
  - number receiverId
  - string content
- return：
``` json
// 成功
{
    "result": "success",
    "message": ""
}
// 失败
{
    "result": "failed",
    "message": ""
}
```

## 10. 获取历史
- method：POST
- url：/LZFWX/getChatRecord
- param：  
  - number userId
- return：
``` json
// 成功
{
    "result": "success",
    "message": [
        {
            "messageType": 0 | 1 | 2 | 3, // "0": 无效信息; "1": 普通消息; "2": 好友申请; "3": 更新好友列表消息
            "messageId": "",  // 信息 id
            "createTime": "", // 创建时间
            "sender": {
                "userId": "",          // 发送人id
                "nickName": "",    // 发送人昵称
                "userPhoto": "",       // 发送人头像
            },
            "receiver": {
                "userId": "",        // 接收人id
                "nickName": "",  // 接收人昵称
                "userPhoto": "",     // 接收人头像
            },
            "content": "",               // 内容

            "receiverLook": false | true,  // 是否已被接收
            "senderLook": false | true,  // 是否已被接收
        },
        {},
    ]
}
// 失败
{
    "result": "failed",
    "message": ""
}
```


## 11. 获取未读消息
- method：POST
- url：/LZFWX/getUnreadChatRecord
- param：  
  - 无
- return：
``` json
// 成功
{
    "result": "success",
    "message": [
        {
            "messageType": 0 | 1 | 2 | 3, // "0": 无效信息; "1": 普通消息; "2": 好友申请; "3": 更新好友列表消息
            "messageId": "",  // 信息 id
            "createTime": "", // 创建时间
            "sender": {
                "userId": "",          // 发送人id
                "nickName": "",    // 发送人昵称
                "userPhoto": "",       // 发送人头像
            },
            "receiver": {
                "userId": "",        // 接收人id
                "nickName": "",  // 接收人昵称
                "userPhoto": "",     // 接收人头像
            },
            "content": "",               // 内容

            "receiverLook": false | true,  // 是否已被接收
            "senderLook": false | true,  // 是否已被接收
        },
        {},
    ]
}
// 失败
{
    "result": "failed",
    "message": ""
}
```
