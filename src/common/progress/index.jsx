import React, { Component } from 'react'
import './index.less'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

/* 
    Progress组件接收进度（progress），
    是否禁用按钮（disableButton），
    是否禁用拖拽（disableButton），
    开始拖拽回调函数（onDragStart），
    拖拽中回调函数（onDrag），
    拖拽接受回调函数（onDragEnd）
*/

class Progress extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progressBarWidth: 0
        }
    }

    componentDidMount() {
        let progressBarDOM = ReactDOM.findDOMNode(this.refs.progressBar)
        let progressDOM = ReactDOM.findDOMNode(this.refs.progress)
        let progressBtnDOM = ReactDOM.findDOMNode(this.refs.progressBtn)
        this.setState({
            progressBarWidth: progressBarDOM.offsetWidth
        })
        // this.progressBarWidth = progressBarDOM.offsetWidth


        // 拖拽功能利用移动端的touchstart、touchmove和touchend来实现。
        // 先判断按钮和拖拽功能是否启用，然后给progressBtnDOM添加touchstart、touchmove和touchend事件。
        // 拖拽开始记录触摸开始的位置downX和按钮的left值buttonLeft，拖拽中计算拖拽的距离diffx，然后重
        // 新设置按钮left值为btnLeft。btnLeft就是拖拽后距离进度条最左边开始的距离，除以总进度长就是当前进度比。
        // 这个值乘以100就是progressDOM的width。在拖拽中调事件对象preventDefault函数阻止有些浏览器触摸移动时
        // 窗口会前进后退的默认行为。在每个事件的最后调用对应的回调事件，onDrag回调函数中传入当前进度值
        let { disableButton, disableDrag, onDragStart, onDrag, onDragEnd } = this.props
        if (!disableButton && !disableDrag) {
            //触摸开始位置
            let downX = 0
            //按钮left值
            let buttonLeft = 0

            progressBtnDOM.addEventListener('touchstart', (e) => {
                let touch = e.touches[0]
                downX = touch.clientX
                buttonLeft = parseInt(touch.target.style.left, 10)

                if (onDragStart) {
                    onDragStart()
                }
            })

            progressBtnDOM.addEventListener('touchmove', (e) => {
                e.preventDefault()

                let touch = e.touches[0]
                let diffX = touch.clientX - downX

                let btnLeft = buttonLeft + diffX
                if (btnLeft > progressBarDOM.offsetWidth) {
                    btnLeft = progressBarDOM.offsetWidth
                } else if (btnLeft < 0) {
                    btnLeft = 0
                }
                //设置按钮left值
                touch.target.style.left = btnLeft + 'px'
                //设置进度width值
                progressDOM.style.width = btnLeft / this.state.progressBarWidth * 100 + '%'

                if (onDrag) {
                    onDrag(btnLeft / this.state.progressBarWidth)
                }
            })

            progressBtnDOM.addEventListener('touchend', (e) => {
                if (onDragEnd) {
                    onDragEnd()
                }
            })
        }
    }

    componentDidUpdate() {
        
    }

    render() {
        //进度值：范围 0-1
        let { progress, disableButton } = this.props
        let progressButtonOffsetLeft = 0
        progress = progress || 0
        
        if (this.state.progressBarWidth) progressButtonOffsetLeft = progress * this.state.progressBarWidth
        return (
            <div className='progress-bar' ref='progressBar'>
                <div className='progress' style={{ width: `${progress * 100}%` }} ref='progress'></div>
                {
                    disableButton ? '' :
                        <div className='progress-button' style={{ left: progressButtonOffsetLeft }} ref='progressBtn'></div>
                }
            </div>
        )
    }
}

//使用prop-types给传入的props进行类型校验
// Progress.prototype = {
//     progress: PropTypes.number.isRequired,
//     disableButton: PropTypes.bool,
//     disableDrag: PropTypes.bool,
//     onDragStart: PropTypes.func,
//     onDrag: PropTypes.func,
//     onDragEnd: PropTypes.func
// }

export default Progress