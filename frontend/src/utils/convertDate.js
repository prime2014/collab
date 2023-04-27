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

