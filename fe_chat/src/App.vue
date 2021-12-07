<template>
  <div id="app">
    <h1>Vuejs project chat realtime</h1>
    <h3>Welcome {{ currentUser }} to room chat {{ currentRoom }}</h3>
    <div v-if="!joined" class="form" :class="{ flex: !joined }">
      <input
        type="text"
        placeholder="Enter Your Nickname"
        v-model="currentUser"
      />
      <input type="text" placeholder="Enter Room Chat" v-model="currentRoom" />
      <button @click="joinChat">Join Chat</button>
    </div>
    <div v-else class="chat-form">
      <div class="chatWrapper">
        <div
          class="message"
          v-for="content in contents"
          :key="content.id"
          :class="{
            right: currentUser === content.user,
            left: currentUser !== content.user,
          }"
        >
          <span class="name">{{ content.user }} - </span>
          <span>{{ content.message }}</span>
        </div>
      </div>
      <div class="action">
        <input
          type="text"
          placeholder="Message"
          v-model="message"
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage">Enter</button>
        <button @click="exitRoom">Exit Room</button>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "App",
  data: () => ({
    joined: false,
    currentUser: "",
    currentRoom: null,
    message: "",
    contents: [],
    socketInstance: null,
  }),

  methods: {
    joinChat() {
      this.joined = true;
      this.socketInstance = io("http://localhost:3000");

      this.socketInstance.on("message:received", (roomId, data) => {
        if (roomId === this.currentRoom) {
          this.contents.push(data);
        }
      });

      this.socketInstance.emit("joinRoom", this.currentRoom);

      this.socketInstance.on("message:all", (messages) => {
        if (messages.length > 0) this.contents = messages;
      });
    },
    sendMessage() {
      if (this.message.length !== 0) this.addMessage();
    },
    addMessage() {
      const content = {
        id: new Date().getTime(),
        message: this.message.trim(),
        user: this.currentUser,
      };
      this.socketInstance.emit("message", this.currentRoom, content);
      this.contents.push(content);
      this.message = "";
    },
    exitRoom() {
      this.joined = false;
      this.currentUser = "";
      this.currentRoom = null;
      this.message = "";
      this.contents = [];
      this.socketInstance = null;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding: 0 30%;
}
.chatWrapper {
  width: 100%;
  padding: 10px 10px;
  overflow-y: auto;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.name {
  font-weight: 600;
}
.right {
  margin-left: auto;
  background: #80b791ad;
}
.left {
  background: #dfdfdfc9;
  margin-right: auto;
}
.message {
  display: block;
  max-width: max-content;
  padding: 10px 20px;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  margin-bottom: 8px;
}
.action {
  text-align: right;
}
h1,
h3 {
  text-align: left;
  color: #2c3e50;
}

h3 {
  font-weight: 400;
}
.form {
  width: 100%;
  text-align: right;
  height: 40px;
}
.flex {
  display: flex;
}
.chat-form {
  height: max-content;
  width: 100%;
}
button {
  height: 35px;
  margin-left: 4px;
  border-radius: 10px;
  outline: none;
  border: none;
  padding: 0 25px;
  background: #80b791;
  cursor: pointer;
}
button:hover {
  background: #80b791a6;
}
input {
  height: 30px;
  outline: none;
  border-radius: 10px;
  border-color: #80b791;
  padding: 0 20px;
  width: 50%;
}
</style>
