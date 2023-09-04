export const convertDate = (publish_date)=>{
    let date = new Date(publish_date)

    let day = date.toDateString()
    let hours = date.getHours().toLocaleString() < 10 ? `0${date.getHours().toLocaleString()}` : date.getHours().toLocaleString();
    let minutes = date.getMinutes().toLocaleString() < 10 ? `0${date.getMinutes().toLocaleString()}`: date.getMinutes().toLocaleString();
    let seconds = date.getSeconds().toLocaleString() < 10 ? `0${date.getSeconds().toLocaleString()}` : date.getSeconds().toLocaleString();

    // return hours + ":" + minutes + ":" + seconds
    return day + ", " + hours + ":" + minutes + ":" + seconds

}

export const IsAvailable = (fetched_object) => {
    return !!(Object.keys(fetched_object).length)
}


export const customDate = (post_date) => {

    // current time since epoch
    var current_date_in_timestamp = Date.now()
    // time from epoch till the date of post
    var post_date_from_epoch = new Date(post_date).getTime()

    var date_difference = current_date_in_timestamp - post_date_from_epoch;

    // convert into seconds
    var date_in_seconds = date_difference / 1000;

    // classify time categories
    var min = 60;
    var hour = min ** 2;
    var day = hour * 24;
    var week = day * 7;
    var month = day * 30;
    var year = day * 365;

    if(date_in_seconds <= 1) {
        return "Just now";
    }
    else if(date_in_seconds >= min && date_in_seconds < hour){
        let posted_min = Math.floor(date_in_seconds / min);
        return `${posted_min} min ago`;

    } else if(date_in_seconds >= hour && date_in_seconds < day){
        let posted_hr = Math.floor(date_in_seconds/ hour)
        return posted_hr > 1 ? `${posted_hr} hrs ago` : `${posted_hr} hr ago`;

    } else if(date_in_seconds >= day && date_in_seconds < week){
        let posted_day = Math.floor(date_in_seconds / day)
        return posted_day > 1 ? `${posted_day} days ago` : `${posted_day} day ago`;

    } else if (date_in_seconds >= week && date_in_seconds < month) {
        let posted_week = Math.floor(date_in_seconds / week)
        return posted_week > 1 ? `${posted_week} wks ago` : `${posted_week} wk ago`;

    } else if(date_in_seconds >= month && date_in_seconds < year) {
        let posted_month = Math.floor(date_in_seconds / month)
        return posted_month > 1 ? `${posted_month} months ago` : `${posted_month} month ago`;

    } else if(date_in_seconds >= year) {
        let posted_year = Math.floor(date_in_seconds / year)
        return posted_year > 1 ? `${posted_year} yrs ago` : `${posted_year} yr ago`;

    } else {
        let posted_sec = Math.floor(date_in_seconds)
        return `${posted_sec} secs ago`;
    }
}


export const customizeLikes = (count) => {

    let thousandMetric = 1000
    let millionthMetric = 1000000
    let billionthMetric = 1000000000


    if (count >= thousandMetric) {
        let result = Math.floor(count / thousandMetric);
        return result.toString() + "K";
    } else if (count >= millionthMetric) {
        let mResult = Math.floor(count / millionthMetric)
        return mResult.toString() + "M";
    } else if (count >= billionthMetric) {
        let bResult = Math.floor(count / millionthMetric)
        return bResult.toString() + "B"
    } else {
        return count + " likes";
    }
}
