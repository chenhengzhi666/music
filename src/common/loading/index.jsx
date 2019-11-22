import React, { Component } from 'react'
import loading from '@/assets/img/loading.gif'
import './index.less'

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        let displayStyle = this.props.show === true ? {display:''} : {display:'none'}
        return (
            <div className='loading-container' style={displayStyle}>
                <div className='loading-wrapper'>
                    <img src={loading} width='18px' height='18px' alt='loading'/>
                    <div className='loading-title'>{this.props.title}</div>
                </div>
            </div>
        )
    }
}
 
export default Loading;