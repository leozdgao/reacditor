import React, { PropTypes as T } from 'react'
import Immutable from 'immutable'
import KeyCode from 'lgutil/dom/keycode'
import 'less/editor.less'

//
// Structure of editor state :
//
// {
//   paragraphs: [
//     {
//       type: 'paragraph',
//       key: 'key0',
//       inlines: [
//         {
//           type: 'plain',
//           content: ''
//         }
//       ]
//     }
//   ]
// }
//

let seed = 0
const nextKey = () => {
  return (seed ++).toString(16)
}

const newInlineNode = (type) => {
  return {
    type,
    content: ''
  }
}

const newParagraph = () => {
  return {
    type: 'paragraph',
    key: nextKey(),
    inlines: [ newInlineNode('plain') ],
    activeInlineIndex: 0
  }
}

//
// Type of node:
//   - plain text: 'plain'
//   - bold text: 'bold'
//   - italistic text: 'italistic'
//   - highlighted text: 'hlt'
//
const renderInlineNode = (node) => {
  const content = node.get('content')
  switch (node.get('type')) {
  case 'bold':
    return <b>{content}</b>
  case 'italistic':
    return <em>{content}</em>
  case 'hlt':
    return <span className='hl-text'>{content}</span>
  case 'plain':
  default:
    return <span>{content}</span>
  }
}

//
// Structure of paragraph:
//   - type: paragraph
//   - key: unique key
//   - inlines: [ nodes ]
//
const renderParagraph = (paragraph) => {
  const inlines = paragraph.get('inlines').map(renderInlineNode)
  return (
    <p key={paragraph.key}>{inlines}</p>
  )
}

const RichEditor = React.createClass({
  propTypes: {
    outdoor: T.string // html string
  },
  getInitialState () {
    return {
      contentStructure: Immutable.fromJS({
        paragraphs: [ newParagraph() ],
        activeParagraphIndex: 0
      })
    }
  },
  shouldComponentUpdate (nextProps, nextState) {
    // immutable state
    return this.state !== nextState
  },
  componentDidUpdate (prevProps, prevState) {
    // move caret mannually
    const sel = window.getSelection()
    sel.collapse(React.findDOMNode(this), 1)
  },
  render () {
    return (
      <div contentEditable className='editor'
        onKeyDown={this._handleKeyDown}
        onKeyPress={this._handleKeyPress}
        onKeyUp={this._handleKeyUp}>
        {this._renderContent()}
      </div>
    )
  },
  _renderContent () {
    return this.state.contentStructure.get('paragraphs').map(renderParagraph).toArray()
  },
  _handleKeyDown (e) {
    if (KeyCode.isTextModifyingKeyEvent(e)) {
      // console.log('down')
    }
  },
  _handleKeyPress (e) {
    e.preventDefault()

    const contentStructure = this.state.contentStructure
    const activeParagraphIndex = contentStructure.get('activeParagraphIndex')
    const currentParagraph = contentStructure.getIn([ 'paragraphs', activeParagraphIndex ])
    const activeInlineIndex = currentParagraph.get('activeInlineIndex')
    const currentInline = currentParagraph.getIn([ 'inlines', activeInlineIndex ])
    const content = currentInline.get('content')
    const input = String.fromCharCode(e.charCode)

    this.setState({
      contentStructure: contentStructure.setIn(
        [ 'paragraphs', activeParagraphIndex, 'inlines', activeInlineIndex, 'content' ],
        content + input
      )
    })

    // console.log('press')
  },
  _handleKeyUp (e) {
    // console.log('up')
  },
  _handleInput (e) {
    // console.log('input')
  }
})

export default RichEditor
