<template>
  <div>
    <h2>Riddle</h2>
    <textarea name="riddle" id="riddle" v-model='riddle' cols="30" rows="10"></textarea>

    <h2>Password</h2>
    <input type="text" v-model='password'>
    
    <h2>Message</h2>
    <textarea v-model='message' ref='message' name="message" id="message" cols="30" rows="10"></textarea>
    <button @click='download'>Download</button>

    <iframe ref='iframe' frameborder="2"></iframe>
  </div>
</template>

<script>
import pbkdf2 from 'pbkdf2'
import CryptoJS from 'crypto-js'
import template from './template.hbs'
import Handlebars from 'handlebars'
import marked from 'marked'

export default {
  name: 'app',
  data () {
    return {
      riddle: 'A Riddle for YOU',
      message: 'Some kinda thing to say',
      password: 'pass',
    }
  },
  computed: {
    compiledTemplate: function() {
      return Handlebars.compile(template)
    },
    renderedTemplate: function() {
      let context = {
        riddle: marked(this.riddle),
        message: this.encryptedMessage,
      }
      return this.compiledTemplate(context)
    },
    encryptedMessage: function() {
      return CryptoJS.AES.encrypt(marked(this.message), this.password)
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
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
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 50%;
}
</style>
