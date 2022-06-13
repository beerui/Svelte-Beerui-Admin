export default class FormatTime {
    constructor(formatTime, date) {
        this.reg = /(yyyy)|(MM)|(M)|(dd)|(d)|(HH)|(H)|(mm)|(m)|(ss)|(s)/g;
        this.formatTime = "yyyy-MM-dd HH:mm:ss"; // 格式
        this._date = new Date(); // 传入时间 默认当前
        if (formatTime)
            this.formatTime = formatTime;
        if (date)
            this._date = date;
    }
    // 获取当前时间
    get getTime() {
        this._date = new Date();
        return this.replaceTime();
    }
    // 设置时间 默认当前
    setTime(now) {
        now ? this._date = now : this._date = new Date();
        return this.replaceTime();
    }
    // 格式化时间
    replaceTime() {
        return this.formatTime.replace(this.reg, v => this.getNowTime(v));
    }
    // 替换日期
    getNowTime(v) {
        const _year = String(this._date.getFullYear());
        const _month = String(this._date.getMonth() + 1);
        const _day = String(this._date.getDate());
        const _hours = String(this._date.getHours());
        const _minutes = String(this._date.getMinutes());
        const _seconds = String(this._date.getSeconds());
        const t = {
            yyyy: _year,
            M: _month,
            MM: this.concatZero(_month),
            d: _day,
            dd: this.concatZero(_day),
            H: _hours,
            HH: this.concatZero(_hours),
            m: _minutes,
            mm: this.concatZero(_minutes),
            s: _seconds,
            ss: this.concatZero(_seconds)
        };
        return t[v];
    }
    // 补零
    concatZero(v) {
        return v.padStart(2, "0");
    }
}
