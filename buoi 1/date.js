const myDateTime = (str = "Ngày Hiện Tại: ") => {
    return str + new Date().toString();
}

export default myDateTime;
