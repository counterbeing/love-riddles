<template>
    <div class='outer-flex'>
      <div class='flex-left'>
        <h1>Riddlesticks! Make someone a riddle where the solution gives them
        the password to a secret message.</h1>
        <h2>Write Your Riddle Below</h2>
        <p>Replace the demo riddle with your own, and preview it on the right.</p>
        <markdown-editor  v-model='riddle'></markdown-editor>

        <h2>Password: The Answer To Your Riddle</h2>
        <p>Don't worry about spaces and punctuation, they will be ignored.
        Make sure the password is something they can guess based on the
        riddle above.</p>
        <div class='pass-entry'>
          <input type="text" v-model='password'>
        </div>
        
        <h2>Compose Your Secret Message</h2>
        <p>This message will not be revealed until the correct password is
        typed. The right side of the page is an exact replica of what your
        recipeient will see, including the password access and formatting.
        Play with it, befor you download!</p>
        <markdown-editor  v-model='message'></markdown-editor>

        <p>
        Once you have the riddle/password/message filled in, download it and
        send it to your loved one. They work on iPhones through iMessage, and
        they work well through email when someone opens it in a browser. The
        message will look like the one on the right hand side of the screen.
        You can test it out over there.
        </p>
        <a class='button' @click='download'>Download</a>
      </div>

      <div class='flex-right'>
        <iframe ref='iframe' frameborder="0"></iframe>
      </div>
    </div>
</template>

<script>
import pbkdf2 from 'pbkdf2'
import CryptoJS from 'crypto-js'
import template from './template.hbs'
import Handlebars from 'handlebars'
import customMDRenderer from './custom-renderer.js'
import exampleMessage from './examples/message.md'
import exampleRiddle from './examples/riddle.md'

export default {
  name: 'app',
  data () {
    return {
      riddle: exampleRiddle,
      password: 'fido boo',
      message: exampleMessage,
      generateCount: 0
    }
  },
  computed: {
    compiledTemplate: function() {
      return Handlebars.compile(template)
    },
    renderedTemplate: function() {
      let context = {
        riddle: customMDRenderer(this.riddle),
        message: this.encryptedMessage,
      }
      return this.compiledTemplate(context)
    },
    encryptedMessage: function() {
      return CryptoJS.AES.encrypt(customMDRenderer(this.message), this.simplifiedPassword)
    },
    simplifiedPassword: function() {
      return this.password
        .replace(/(-|\s|,|\.)/g, '')
        .toLowerCase()
    }
  },
  watch: {
    renderedTemplate: function() { 
      this.setIframe(); 
      this.generateCount += 1
    },
  },
  methods: {
    setIframe: function() {
      let doc = this.$refs.iframe.contentWindow.document;
      doc.open();
      doc.write(this.renderedTemplate);
      doc.close();
    },
    download: function() {
      var element = document.createElement('a')
      element.style.display = 'none'
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.renderedTemplate))
      element.setAttribute('download', 'riddle.html')
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      this.generateCount = 0
    },
    unloadPage: function() {
      if(this.generateCount > 2){
        return "There have been changes on the page since you last downloaded your riddle! If you leave your changes will be lost!";
      }
    }
  },
  mounted: function() {
    this.setIframe()
    window.onbeforeunload = this.unloadPage;
  }
}
</script>

<style lang="scss">
div {
  margin: 0;
	padding: 0;
	border: 0;
  box-sizing: border-box;
}
html, body {
  height: 100%;
  margin: 0;
  box-sizing: border-box;
}

body {
    font-family: 'Kalam', cursive;
    color: #333;
    display: flex;
}

a {
  color: #42b983;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

h1,h2,h3,h4 {
    font-family: 'Scope One', serif;
}

iframe {
  height: 100%;
  width: 100%;
}

.encrypted-message {
    font-family: monospace;
    max-height: 300px;
    overflow: scroll;
    white-space: pre-wrap;    
    overflow-wrap: break-word;
    padding: 10px;
    background-color: #333;
    color: #EEE;
}

.wrapper {
    text-align: left;
    max-width: 500px;
    margin: auto;
}

.pass-entry {
    text-align: center;
}
.pass-entry input {
    box-sizing: border-box;
    width: 100%;
    font-size: 30px;
    padding: 10px;
    text-align: center;
}
.pass-entry input.complete {
    color: green;
}

#guess-list {
    list-style: none;
}

.outer-flex {
  display: flex;
  height: 100%;
  width: 100%;
}

.flex-left {
  flex: 0 1 50%;
  height: 100%;
  max-width: 50%;
  overflow-y: scroll;
  padding: 2em;
}

.flex-right {
  flex: 0 1 50%;
  height: 100%;
  max-width: 50%;
  padding: 2em;
}

.button {
    background-color: #42b983; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 30px;
    margin-bottom: 20px;
    box-sizing: border-box;
    width: 100%;
    cursor: pointer;
}

</style>
