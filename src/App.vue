<template>
    <div class='outer-flex'>
      <div class='flex-left'>
        <h1>Riddlesticks! Make someone a riddle where the solution gives them the password to a secret message.</h1>
        <h2>Riddle</h2>
        <p>These riddle is written in <a target='_blank' href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">markdown</a>, and displayed first.</p>
        <markdown-editor  v-model='riddle'></markdown-editor>

        <h2>Password</h2>
        <div class='pass-entry'>
          <input type="text" v-model='password'>
        </div>
        
        <h2>Secret Message</h2>
        <p>The message is also written in <a target='_blank' href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">markdown</a>, but is not displayed until the correct password is entered.</p>
        <markdown-editor  v-model='message'></markdown-editor>

        <p>
        Once you have the riddle/password/message filled in, download it
        and send it to your loved one. The message will look like the one on the
        right hand side of the screen. You can test it out over there.
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
      password: 'fido adieu',
      message: exampleMessage,
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
      return CryptoJS.AES.encrypt(customMDRenderer(this.message), this.password)
    },
  },
  watch: {
    renderedTemplate: function() {
      this.setIframe();
    }
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
    }
  },
  mounted: function() {
    this.setIframe()
  }
}

function download(filename, text) {

}

</script>

<style lang="scss">
html, body {
  height: 100%;
  box-sizing: border-box;
}
body {
    font-family: 'Kalam', cursive;
    color: #333;
    display: flex;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
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
h1,h2,h3,h4 {
    font-family: 'Scope One', serif;
}
.pass-entry {
    text-align: center;
}
.pass-entry input {
    width: 80%;
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
  width: 100%;
  height: 100%;
}

.flex-left {
  flex: 0 1 50%;
  min-height: 100%;
  max-width: 50%;
  padding: .5em;
}

.flex-right {
  flex: 0 1 50%;
  min-height: 100%;
  max-width: 50%;
}

.button {
    background-color: #42b983; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 20px;
    width: 80%;
    cursor: pointer;
}

</style>
