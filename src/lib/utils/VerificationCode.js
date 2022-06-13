/** 示例
 <!DOCTYPE html>
 <html>
 <head>
 <meta http-equiv="X-UA-Compatible" content="chrome=IE8">
 <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
 <script>
 window.onload = function() {
        var verifyCode = new VerificationCode("verificationContainer");
        document.getElementById("my_button").onclick = function() {
          var res = verifyCode.validate(document.getElementById("code_input").value);
          if (res) {
            alert("验证码正确");
          } else {
            alert("验证码错误");
          }
        }
      }
 </script>
 </head>
 <body>
 <div id="verificationContainer" style="width: 200px;height: 50px;"></div>
 <input type="text" id="code_input" value="" placeholder="请输入验证码" />
 <button id="my_button">验证</button>
 </body>
 </html>
 */
class VerificationCode {
    static version = '1.0.0' // 设置版本号
    // 创建和初始化class创建的对象
    constructor(options, size = 4) {
        this.size = size // 设置验证码的长度
        // 默认选项参数值
        this.options = {
            id: '', // 容器ID
            canvasId: 'verifyCanvas', // 画布ID
            interfereLine: true, // 干扰线
            interferePoint: true, // 干扰点
            width: '100', // 默认的画布宽度
            height: '30', // 默认的画布高度
            type: 'blend', // 默认的图形验证码类型混合（blend）：数字和字母的混合类型，数字（number）：纯数字，字母（letter）：纯字母
            code: ''
        }
        if (Object.prototype.toString.call(options) === '[object Object]') { // Determine the type of incoming parameters
            // 根据传入的参数修改默认参数值
            // for (var i in options) {
            //   this.options[i] = options[i];
            // }
            this.options = Object.assign(this.options, options)
        } else {
            this.options.id = options
        }
        this.options.numArr = '0,1,2,3,4,5,6,7,8,9'.split(',')
        this.options.letterArr = this.getAllLetter()
        this._init()
        this.refresh()
    }

    get version() {
        return VerificationCode.version
    }

    // 初始化方法
    _init() {
        const dom = document.getElementById(this.options.id)
        const canvas = document.createElement('canvas')
        this.options.width = dom.offsetWidth > 0 ? dom.offsetWidth : '100'
        this.options.height = dom.offsetHeight > 0 ? dom.offsetHeight : '30'
        canvas.id = this.options.canvasId
        canvas.width = this.options.width
        canvas.height = this.options.height
        canvas.style.cursor = 'pointer'
        canvas.innerHTML = '您的浏览器不支持Canvas'
        dom.appendChild(canvas)
        canvas.onclick = () => this.refresh()
    }

    // 生成验证码
    refresh() {
        this.options.code = ''
        const canvas = document.getElementById(this.options.canvasId)
        let ctx = null;
        let txtArr = ''
        if (canvas.getContext) {
            ctx = canvas.getContext('2d')
        } else {
            return
        }
        ctx.textBaseline = 'middle'
        ctx.fillStyle = this.randomColor(180, 240)
        ctx.fillRect(0, 0, this.options.width, this.options.height)
        if (this.options.type === 'blend') { // 确定验证码类型
            txtArr = this.options.numArr.concat(this.options.letterArr)
        } else if (this.options.type === 'number') {
            txtArr = this.options.numArr
        } else {
            txtArr = this.options.letterArr
        }
        for (let i = 1; i <= this.size; i++) {
            const txt = txtArr[this.randomNum(0, txtArr.length)]
            this.options.code += txt
            ctx.font = this.randomNum(this.options.height / 2, this.options.height) + 'px SimHei' // 随机生成字体大小
            ctx.fillStyle = this.randomColor(50, 160) // 随机生成字体颜色
            ctx.shadowOffsetX = this.randomNum(-3, 3)
            ctx.shadowOffsetY = this.randomNum(-3, 3)
            ctx.shadowBlur = this.randomNum(-3, 3)
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
            const x = this.options.width / (this.size + 1) * i
            const y = this.options.height / 2
            const deg = this.randomNum(-30, 30)
            // 设置旋转角度和坐标原点
            ctx.translate(x, y)
            ctx.rotate(deg * Math.PI / 180)
            ctx.fillText(txt, 0, 0)
            // 恢复旋转角度和坐标原点
            ctx.rotate(-deg * Math.PI / 180)
            ctx.translate(-x, -y)
        }
        // 绘制干扰线
        if (this.options.interfereLine) {
            for (let i = 0; i < 4; i++) {
                ctx.strokeStyle = this.randomColor(40, 180)
                ctx.beginPath()
                ctx.moveTo(this.randomNum(0, this.options.width), this.randomNum(0, this.options.height))
                ctx.lineTo(this.randomNum(0, this.options.width), this.randomNum(0, this.options.height))
                ctx.stroke()
            }
        }
        // 绘制干涉点
        if (this.options.interferePoint) {
            for (let i = 0; i < this.options.width / 4; i++) {
                ctx.fillStyle = this.randomColor(0, 255)
                ctx.beginPath()
                ctx.arc(this.randomNum(0, this.options.width), this.randomNum(0, this.options.height), 1, 0, 2 * Math.PI)
                ctx.fill()
            }
        }
    }

    // 验证码
    validate(code) {
        if (!code) return false
        const _code = code.toLowerCase().toString()
        const __code = this.options.code.toLowerCase().toString()
        if (_code === __code) {
            return true
        } else {
            this.refresh()
            return false
        }
    }

    // 生成字母数组
    getAllLetter() {
        const letterStr = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w, x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V, W,X,Y,Z'
        return letterStr.split(',')
    }

    // 生成随机数
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }

    // 生成随机颜色
    randomColor(min, max) {
        const r = this.randomNum(min, max)
        const g = this.randomNum(min, max)
        const b = this.randomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    }
}

export default VerificationCode
