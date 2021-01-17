import React, { FC, useEffect, useState } from 'react'
import { Button } from 'antd'
import { history } from 'umi'
import TRTC from 'trtc-js-sdk'
import LibGenerateTestUserSig from '@/assets/lib/js/lib-generate-test-usersig.min.js'

const WebTrtc: FC = () => {
  const [client, setClient] = useState<any>()
  const [remoteStream, setRemoteStream] = useState<any>()
  const [localStream, setLocalStream] = useState<any>()
  const { userId, homeId } = history.location.query
  // 签名
  const genTestUserSig = (userID: string) => {
    const SDKAPPID = 0 //必须是数字
    const EXPIRETIME = 604800
    const SECRETKEY = ''
    const generator = new LibGenerateTestUserSig(
      SDKAPPID,
      SECRETKEY,
      EXPIRETIME,
    )
    const userSig = generator.genTestUserSig(userID)
    return {
      sdkAppId: SDKAPPID,
      userSig: userSig,
    }
  }
  //退出房间
  const leaveRoom = (c: any) => {
    client
      .leave()
      .then(() => {
        console.log('退房成功')
        // 停止本地流，关闭本地流内部的音视频播放器
        localStream?.stop()
        // 关闭本地流，释放摄像头和麦克风访问权限
        localStream?.close()
        setLocalStream(null)
        setClient(null)
        // 退房成功，可再次调用client.join重新进房开启新的通话。
        history.push({
          pathname: '/',
        })
      })
      .catch((error: any) => {
        console.error('退房失败 ' + error)
        // 错误不可恢复，需要刷新页面。
      })
  }
  // 订阅远端流
  const subscribeStream = (c: any) => {
    c.on('stream-added', (event: any) => {
      const rs = event.stream
      console.log('远端流增加: ' + remoteStream?.getId())
      //订阅远端流
      c.subscribe(rs)
    })
  }
  // 发布本地流
  const publishStream = (local: any, c: any) => {
    c.publish(local)
      .catch((error: any) => {
        console.error('本地流发布失败 ' + error)
      })
      .then(() => {
        console.log('本地流发布成功')
      })
  }
  // 创建本地流
  const createStream = (u: any, c: any) => {
    const ls = TRTC.createStream({ userId, audio: true, video: true })
    setLocalStream(ls)
    ls.initialize()
      .catch((error: any) => {
        console.error('初始化本地流失败 ' + error)
      })
      .then(() => {
        console.log('初始化本地流成功')
        // 创建好后才能播放 本地流播放 local_stream 是div的id
        ls.play('local_stream')
        //创建好后才能发布
        publishStream(ls, c)
      })
  }
  // 监听远端流订阅成功，然后播放远端
  const playStream = (c: any) => {
    c.on('stream-subscribed', (event: any) => {
      const rs = event.stream
      setRemoteStream(rs)
      console.log('远端流订阅成功：' + rs.getId())
      // 创建远端流标签，因为id是动态的，所以动态创建
      rs.play('remote_stream')
    })
  }
  // 加入房间
  const joinRoom = (c: any, roomId: number) => {
    c.join({ roomId })
      .catch((error: any) => {
        console.error('进房失败 ' + error)
      })
      .then(() => {
        console.log('进房成功')
        //创建本地流
        createStream(userId, c)
        //播放远端流
        playStream(c)
      })
  }
  // 创建客户端
  const createClient = (id: string) => {
    //获取签名
    const config = genTestUserSig(id)
    const sdkAppId = config.sdkAppId
    const userSig = config.userSig
    const clt = TRTC.createClient({
      mode: 'videoCall',
      sdkAppId,
      userId,
      userSig,
    })
    setClient(clt)
    //注册远程监听，要放在加入房间前
    subscribeStream(clt)
    // 加入房间
    joinRoom(clt, homeId)
  }
  const check = () => {
    // v4.7.0 及其以上版本的 SDK
    TRTC.checkSystemRequirements().then((checkResult: any) => {
      if (!checkResult.result) {
        // SDK 不支持当前浏览器，根据用户设备类型建议用户使用 SDK 支持的浏览器
        console.log(
          'checkResult',
          checkResult.result,
          'checkDetail',
          checkResult.detail,
        )
        return
      }
      // 否则创建客户端
      createClient(userId)
    })
  }

  useEffect(() => {
    check()
  }, [])
  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        <Button type="primary" onClick={leaveRoom}>
          退出房间
        </Button>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ width: 500, height: 400 }} id="remote_stream"></div>
          <div style={{ width: 50 }}></div>
          <div style={{ width: 600, height: 400 }} id="local_stream"></div>
        </div>
      </div>
    </>
  )
}

export default WebTrtc
