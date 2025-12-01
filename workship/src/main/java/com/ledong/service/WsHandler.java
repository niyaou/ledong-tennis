package com.ledong.service;

import cn.hutool.core.convert.Convert;
import lombok.SneakyThrows;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class WsHandler {

    private WebSocketClient cc;
    private ByteBuffer recvByteBuffer =ByteBuffer.allocate(4);
    private ByteBuffer stringCacheByteBuffer = ByteBuffer.allocate(1024);
    @SneakyThrows
    public WsHandler(){
        cc = new WebSocketClient(new URI("ws://localhost:8080")) {
            @Override
            public void onOpen(ServerHandshake serverHandshake) {
this.send("-0--------0-0--0---------");
            }

            @Override
            public void onMessage(String s) {

            }

            @Override
            public void onClose(int i, String s, boolean b) {

            }

            @Override
            public void onError(Exception e) {

            }
            @Override
            public void onMessage(ByteBuffer bytes) {


                while(recvByteBuffer.position() <4 && bytes.remaining()>0){
                  var p=  recvByteBuffer.position();
                    var r = bytes.remaining();
                    recvByteBuffer.put( bytes.get());
                }
            var bfs=    recvByteBuffer.array();
              var len=  Convert.bytesToInt(bfs);
                while(stringCacheByteBuffer.position()< len && bytes.remaining()>0){
                    var p=  recvByteBuffer.position();
                    var r = bytes.remaining();
                    stringCacheByteBuffer.put(bytes.get());
                }

                if(stringCacheByteBuffer.position()==len){
                    var msg = new String(stringCacheByteBuffer.array(),
                            StandardCharsets.UTF_8);
                    this.send("------------------------"+msg);


                }



            }
        };
        cc.connect();
    }

}
