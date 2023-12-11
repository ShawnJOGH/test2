export default {
    formatDate(timestamp) {
        // 此处时间戳以毫秒为单位
        let date = new Date(parseInt(timestamp));
        let Year = date.getFullYear();
        let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
        let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        console.log(Minute);
        let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        let GMT = Year + '-' + Moth + '-' + Day + '   ' + Hour + ':' + Minute + ':' + Sechond;
        return GMT;
    }
}

