const viewEngine = (app) => {
    app.set("view engine", "ejs");
    app.set("views", "./views"); // Đảm bảo chỉ định đúng thư mục views
};
export default viewEngine;
