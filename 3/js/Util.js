function Util() {
    return function() {
        //off
         //on
        var that = {
            'getArrayItems' : function(arr, num) {
                //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
                var temp_array = new Array();
                for (var i = 0; i < arr.length; i++) {
                    temp_array.push(arr[i]);
                }
                //取出的数值项,保存在此数组
                var return_array = new Array();
                for (var i = 0, n = num; i < n; i++) {
                    //判断如果数组还有可以取出的元素,以防下标越界
                    if (temp_array.length > 0) {
                        //在数组中产生一个随机索引
                        var arrIndex = Math.floor(Math.random() * temp_array.length);
                        //将此随机索引的对应的数组元素值复制出来
                        return_array[i] = temp_array[arrIndex];
                        //然后删掉此索引的数组元素,这时候temp_array变为新的数组
                        temp_array.splice(arrIndex, 1);
                    }
                    else {
                        break;
                    }
                }
                return return_array;
            }
        };
        var init = function() {
        }
        init();
        return that;
    }()
}
