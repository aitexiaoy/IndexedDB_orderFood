/**
 * Created by gecat on 2016/7/7.
 */
window.onload = function () {
    window_onload();
    btnControl_onclick();
};

$(document).on('click', '.content', function (e) {
    e.preventDefault();//阻止冒泡
    var $print = $('#print_view_list');
    var name = $(this).find('p').eq(0).text(); //获得名字
    findData(name);

});
//    $("#name").val().on('change', function () {
//        console.log("-------");
//        btnControl_onclick();
//    });
//canvas绘画
function canvas(img_src, img_width, img_height) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");
    var offset_width = 200;
    var offset_height = offset_width * img_height / img_width;
    canvas.width = offset_width;
    canvas.height = offset_height;
    var img = new Image();
    img.src = img_src;
    img.onload = function () {
        context.drawImage(img, 0, 0, img_width, img_height, 0, 0, offset_width, offset_height);
        $('#div_canvas_img').attr("src", canvas.toDataURL("image/jpeg"));
    };

}

//上传图片
function file_Img() {
    var imgFile = document.getElementById('imgFile').files[0];
    if (!/image\/w*/.test(imgFile.type)) {
        alert("请选择正确的文件类型，图像");
        return false;
    }
    var reader = new FileReader();
    var img = new Image();
    reader.readAsDataURL(imgFile);
    reader.onload = function () {
        var img_src = img.src = this.result;
        var img_width = img.width;
        var img_height = img.height;
        canvas(img_src, img_width, img_height);
    };
}

