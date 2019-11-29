import React, { Component } from 'react'
import './index.less'
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
        this.state = { }
    }

    componentDidMount() {
        this.progressBarDOM = ReactDOM.findDOMNode(this.refs.progressBar)
        this.progressDOM = ReactDOM.findDOMNode(this.refs.progress)
        this.progressBtnDOM = ReactDOM.findDOMNode(this.refs.progressBtn)
        this.progressBarWidth = this.progressBarDOM.offsetWidth


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

            this.progressBtnDOM.addEventListener('touchstart', (e) => {
                let touch = e.touches[0]
                downX = touch.clientX
                buttonLeft = parseInt(touch.target.style.left, 10)
                if (onDragStart) {
                    onDragStart()
                }
            })

            this.progressBtnDOM.addEventListener('touchmove', (e) => {
                e.preventDefault()

                let touch = e.touches[0]
                let diffX = touch.clientX - downX

                let btnLeft = buttonLeft + diffX
                if (btnLeft > (this.progressBarWidth || btnLeft + 1)) {
                    btnLeft = this.progressBarWidth
                } else if (btnLeft < 0) {
                    btnLeft = 0
                }
                //设置按钮left值
                touch.target.style.left = btnLeft + 'px'
                //设置进度width值
                this.progressDOM.style.width = btnLeft / this.progressBarWidth * 100 + '%'

                if (onDrag) {
                    onDrag(btnLeft / this.progressBarWidth)
                }
            })

            this.progressBtnDOM.addEventListener('touchend', (e) => {
                if (onDragEnd) {
                    onDragEnd()
                }
            })
        }
    }

    componentDidUpdate() {
        setTimeout(() => {
            if (!this.progressBarWidth) this.progressBarWidth = this.progressBarDOM.offsetWidth
        }, 0);
        
    }

    // 点击播放界面进度条
    progressClick = (e) => {
        const { progressClick } = this.props
        if (progressClick) {
            let barLeft = this.progressBarDOM.getBoundingClientRect().left
            let clickX = e.clientX - barLeft
            let progress = clickX / (this.progressBarWidth || this.progressBarDOM.offsetWidth)
            this.progressBtnDOM.style.left = `${clickX}px`
            this.progressDOM.style.width = `${progress * 100}%`
            progressClick(progress)
        }
    }

    render() {
        //进度值：范围 0-1
        let { progress, disableButton } = this.props
        let progressButtonOffsetLeft = 0
        progress = progress || 0
        if (this.progressBarWidth) progressButtonOffsetLeft = progress * this.progressBarWidth

        return (
            <div className='progress-bar' ref='progressBar' onClick={this.progressClick}>
                <div className='progress' style={{ width: `${progress * 100}%` }} ref='progress'></div>
                {
                    disableButton ? '' :
                        <div className='progress-button' style={{ left: `${progressButtonOffsetLeft}px` }} ref='progressBtn'></div>
                }
            </div>
        )
    }
}

export default Progress