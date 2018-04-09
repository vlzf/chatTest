$(function(){
    $('#register').click(function(){
        $.ajax({
            url: '/LZFWX/register',
            dataType: 'json',
            type: 'post',
            data: {
                account: $('#account').val(),
                password: $('#password').val()
            },
            success: (data)=>{
                console.log(JSON.stringify(data));
            }
        })
    });
    $('#login').click(function(){
        $.ajax({
            url: '/LZFWX/login',
            dataType: 'json',
            type: 'get',
            data: {
                account: $('#account').val(),
                password: $('#password').val()
            },
            success: (data)=>{
                console.log(JSON.stringify(data));
            }
        })
    });
    $('#logout').click(function(){
        $.ajax({
            url: '/LZFWX/logout',
            dataType: 'json',
            type: 'get',
            success: (data)=>{
                console.log(JSON.stringify(data));
            }
        })
    });




    $('#getInf').click(()=>{
        $.ajax({
            url: '/LZFWX/getUserInfor',
            dataType: 'json',
            type: 'get',
            success: (data)=>{
                console.log(JSON.stringify(data));
                if(data.result=='success'){
                    $('#nickname').val(data.messages.nickName);
                    $('#age').val(data.messages.age);
                    $('#address').val(data.messages.address);
                    $('#mailbox').val(data.messages.mailbox);
                    $('#introduction').val(data.messages.introduction);
                }else{
                    console.log('failed');
                }
            }
        })
    })

    $('#postInf').click(()=>{
        $.ajax({
            url: '/LZFWX/updateUserInfor',
            dataType: 'json',
            type: 'post',
            data: {
                nickName: $('#nickname').val(),
                age: $('#age').val(),
                address: $('#address').val(),
                mailbox: $('#mailbox').val(),
                introduction: $('#introduction').val(),
            },
            success: (data)=>{
                console.log(JSON.stringify(data));
            }
        })
    })

    $('#sendInf').click(()=>{
        $.ajax({
            url: '/LZFWX/sendContent',
            dataType: 'json',
            type: 'post',
            data: {
                content: $('#message').val(),
                receiver: $('#receiver').val()
            },
            success: (data)=>{
                console.log(JSON.stringify(data));
            }
        })
    })

    $('#newInf').click(()=>{
        $.ajax({
            url: '/LZFWX/getUnreadChatRecord',
            type: 'get',
            dataType: 'json',
            success: (data)=>{
                console.log(JSON.stringify(data));
            }
        })
    })

    $('#history').click(()=>{
        $.ajax({
            url: '/LZFWX/getChatRecord',
            dataType: 'json',
            type: 'get',
            data: {
                receiver: $('#receiver').val()
            },
            success: (data)=>{
                console.log(JSON.stringify(data));
            }
        })
    })


}) 