import React, { PropTypes } from 'react'
import Editor from './controls/editor'

import 'less/site.less'

const Demo = React.createClass({
  render () {
    return (
      <div className='container'>
        <h2>Demo page</h2>
        <Editor />
      </div>
    )
  }
})

export default Demo
