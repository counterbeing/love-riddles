import marked from 'marked'
const renderer = new marked.Renderer()

renderer.heading = function (text, level) {
  const adjustedLevel = level + 2
  return `<h${adjustedLevel}>${text}</h${adjustedLevel}>`
};

export default (text) => {
    return marked(text, { renderer: renderer })
}