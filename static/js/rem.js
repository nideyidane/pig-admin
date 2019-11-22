/*
 * @Author: zhongbin.chen 
 * @Date: 2019-02-20 14:16:36 
 * @Last Modified by: zhongbin.chen
 * @Last Modified time: 2019-02-21 15:34:28
 */
((doc,win) => {
    let docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = () => {
            let clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 20 * (clientWidth / 375) + 'px';
        }
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document,window)