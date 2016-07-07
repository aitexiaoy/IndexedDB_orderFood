/**
 * Created by gecat on 2016/7/5.
 */
window.onload = function () {
    window_onload();
};
//为动态生成的菜单元素注册事件（如果直接注册监听事件，将注册不成功）
$(document).on('click', '.content', function (e) {
    e.preventDefault();//阻止冒泡
    var $print = $('#print_view_list');
    var name = $(this).find('p').eq(0).text();
    var price = Number($(this).find('p').eq(1).text());
    //菜名
    var $show_name = $('<li class="show_name">' + name + '</li>');
    //单价
    var $show_price = $('<li class="show_price">' + price + '</li>');
    //数量
    var $show_number = $('<li class="show_number">1</li>');
    //单菜品总价
    var $show_totalPrices = $('<li class="show_totalPrices">' + price + '</li>');
    //总价
    var $totalPrices_name = $('<li class="totalPrice_name">总价:</li>');
    var $totalPrice = $('<li class="totalPrice">' + price + '</li>');
    //实收
    var $getMoney_name = $('<li class="totalPrice_name">实收:</li>');
    var $getMoney = $('<li><input class="getMoney"  id="getMoney" type="number" ></li>');


    var li1 = $('<li class="show_name">菜名</li>');
    var li2 = $('<li class="show_name">单价</li>');
    var li3 = $('<li class="show_name">数量</li>');
    var li4 = $('<li class="show_name">总价</li>');

    var $show_row = $('<ul class="show_row show_float_right"></ul>');
    var $show_row1 = $('<ul class="show_row show_list"></ul>');
    var $show_row2 = $('<ul class="show_row show_float_right"></ul>');
    var $show_row3 = $('<ul class="show_row"></ul>');

    if ($('.totalPrice').length == 0) {
        $('.input_deskNumber').removeAttr('autofocus');
        //总价
        $show_row.append($totalPrices_name);
        $show_row.append($totalPrice);
        $print.append($show_row);
        //实收钱数
        $show_row2.append($getMoney_name);
        $show_row2.append($getMoney);
        $print.append($show_row2);

        //头部
        $show_row3.append(li1);
        $show_row3.append(li2);
        $show_row3.append(li3);
        $show_row3.append(li4);
        $print.prepend($show_row3);

        $('.sure_btn').show();
    }
    var regname = new RegExp(name);
    if (regname.test($('.show_name').text())) {
        var this_show_row = $('.show_row').filter(function (index) {
            return $('.show_name', this).text() == name
        });
        var old_number = Number(this_show_row.find('.show_number').text());
        var new_number = old_number + 1;
        var old_totalPrices = Number(this_show_row.find('.show_totalPrices').text());
        var new_totalPrices = old_totalPrices + price;
        this_show_row.find('.show_number').text(new_number);
        this_show_row.find('.show_totalPrices').text(new_totalPrices);
    }
    else {
        $show_row1.append($show_name);
        $show_row1.append($show_price);
        $show_row1.append($show_number);
        $show_row1.append($show_totalPrices);
        $('.totalPrice').parent().before($show_row1);

    }
    if ($('.totalPrice').length > 0) {
        var $totalPrice = 0;
        $('.show_totalPrices').each(
            function () {
                $totalPrice += Number($(this).text());
            });
        $('.totalPrice').text($totalPrice);
        console.log($totalPrice);
    }
    $('.getMoney').get(0).focus();
});

//为点餐后的菜名增加点击事件监听，如果点击打印行，则打印行的数量减1，总价变化，如果数量为1则直接删除本行
$(document).on('click', '.show_row', function (e) {
    e.preventDefault();//阻止冒泡
    var $this = $(this);
    var $number = Number($this.find('[class="show_number"]').text());    //数量
    var $price = Number($this.find('[class="show_price"]').text());              //单价
    if ($number === 1) {
        $this.remove();
    } else {
        $number = $number - 1;
        var totalrices = $number * $price;
        $this.find('[class="show_number"]').text($number);
        $this.find('[class="show_totalPrices"]').text(totalrices);
    }
    var $tatalPrice = 0;
    $('.show_totalPrices').each(
        function () {
            $tatalPrice += Number($(this).text());
        });
    if ($tatalPrice == 0) {
        $('.totalPrice').parent().parent().children().remove();
//            $('.totalPrice_name').parent().remove();
//            $('.dispenser').parent().remove();
    } else {
        $('.totalPrice').text($tatalPrice);
    }
    $('.getMoney').get(0).focus();
});
//绑定实收事件，输入后新增找零节点,绑定了2个事件，分别是按键事件，以及失去焦点事件
$(document).on({
        keydown: function (e) {
            //如果按下enter键
            if ((e.which == 13)) {
                e.preventDefault();
                var $getMoney = Number($('.getMoney').val());
                var $totalPrice = Number($('.totalPrice').text());
                var $dispenser = $getMoney - $totalPrice;
                var $show_row = $('<ul class="show_row show_float_right"></ul>');
                var $dispenser_name = $('<li class="dispenser_name">找零:</li>');
                var $dispenser_row = $('<li class="dispenser">' + $dispenser + '</li>');
                if ($('.dispenser_name').length > 0) {
                    $('.dispenser').text($dispenser);
                }
                else {
                    $show_row.append($dispenser_name);
                    $show_row.append($dispenser_row);
                    $('.print_view_list').append($show_row);
                }
                $('.sure_btn').focus();
            }
        }
//                blur: function (e) {
//                    e.preventDefault();
//                    var $getMoney = Number($('.getMoney').val());
//                    var $totalPrice = Number($('.totalPrice').text());
//                    var $dispenser = $getMoney - $totalPrice;
//                    var $show_row = $('<ul class="show_row"></ul>');
//                    var $dispenser_name = $('<li class="dispenser_name">找零:</li>');
//                    var $dispenser_row = $('<li class="dispenser">' + $dispenser + '</li>');
//                    if ($('.dispenser_name').length > 0) {
//                        $('.dispenser').text($dispenser);
//                    }
//                    else {
//                        $show_row.append($dispenser_name);
//                        $show_row.append($dispenser_row);
//                        $('.print_view').append($show_row);
//                    }
//                }
    },
    '.getMoney'
);

getTime();
function getTime() {
    var time = new Date();
    $('.data').text(time.toLocaleDateString().replace(/\//g, "-") + ':' + Addling(time.getHours()) + ':' + Addling(time.getMinutes()) + ':' + Addling(time.getSeconds()));
    setTimeout(getTime, 1000);
}
//补0函数
function Addling(value, number) {
    if (number == null)
        number = 2;
    var result;
    switch (number) {
        case 2:
            result = number2();
            break;
        case 3:
            result = number3();
            break;
        case 4:
            result = number4();
            break;
        default:
            break;
    }
    function number2() {
        var result;
        (value < 10 && value >= 0) ? result = '0' + value : result = value;
        return result;
    }

    function number3() {
        var result;
        (value < 10 && value >= 0) ? result = '00' + value : ((value < 99 && value > 9) ? result = '0' + value : result = value);
        return result;
    }

    function number4() {
        var result;
        (value < 10 && value >= 0) ? result = '000' + value : ((value < 99 && value > 9) ? result = '00' + value : ((value < 999 && value > 99) ? result = '0' + value : result = value) );
        return result;
    }

    return result;
}

//更新订单号：订单号格式20160710001前8位为日期号后4位为顺序编号
function sure_btn() {
//订单号
    var time = new Date();
    var num = 1;
    var data = {};
    var list1 = {};
    var
    var i = 1;
    var id = time.toLocaleDateString().replace(/\//g, "") + Addling(num, 4);
    var totalPrice = $(".totalPrice").text();
    $('.show_list').each(function () {
        var name = $(this).find('[class="show_name"]').text();
        var number = $(this).find('[class="show_number"]').text();
        list1.name = name;
        list1.number = number;
    });
    data.id = id;
    data.total = totalPrice;
    data.list1 = list1;
    Data.unshift(data);

}
