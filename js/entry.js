/* Dudhichua shift wise entry
*
* Generic Copyright
*
* Plug-ins used: jQuery hi hai abhi 
*/

var date = 'today';
var shift = 1;
var section = 1;

//JSON for data
var dataForPage = [
    {
        "sheetName": "Sheet1",
        "data": []
    }
];

$(document).ready(function() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
    $('#date').val(today);

    $(".add_row").on('click', function() {
        var table = $(this).parent().parent().find("table").first();
        $(table).append($(table).find("tr").eq(1).clone());
    });
    $(".delete_row").on('click', function() {
        var table = $(this).parent().parent().find("table").first();
        if ($(table).find("tr").length > 2) {
            $(table).find("tr").last().remove();
        }
    });
    $("#save_shovels").on('click', function() {
        var coal_shovels_operating = [];
        var coal_shovel_operator = [];
        var ob_shovels_operating = [];
        var ob_shovel_operator = [];

        var shovel_table_row = $('#shovel_table > tbody > tr');

        $(shovel_table_row).each(function(index, tr) {
            if ($('select[name="material_type[]"]').eq(index).val() === 'coal') {
                coal_shovels_operating.push($('select[name="shovel_no[]"]').eq(index).val());
                coal_shovel_operator.push($('select[name="shovel_operator[]"]').eq(index).val());
            } else {
                ob_shovels_operating.push($('select[name="shovel_no[]"]').eq(index).val());
                ob_shovel_operator.push($('select[name="shovel_operator[]"]').eq(index).val());
            }
        });

        var dumper_tbody_tr = $('#dumper_table > tbody > tr');
        var dumper_thead_tr = $('#dumper_table > thead > tr');

        $(dumper_thead_tr).each(function(index, tr) {
            $(tr).find("th:gt(1)").remove();
            for (var i = 0; i < coal_shovels_operating.length; i++) {
                $("<th>" + coal_shovels_operating[i] + "(Coal) Op. " + coal_shovel_operator[i] + "</th>").insertAfter($(tr).find("th:last"));
            }
            for (i = 0; i < ob_shovels_operating.length; i++) {
                $("<th>" + ob_shovels_operating[i] + "(OB) Op. " + ob_shovel_operator[i] + "</th>").insertAfter($(tr).find("th:last"));
            }
        });

        $(dumper_tbody_tr).each(function(index, tr) {
            $(tr).find("td:gt(1)").remove();
            for (var i = 0; i < coal_shovels_operating.length; i++) {
                $(tr).append("<td><input name='coal_shovel_" + coal_shovels_operating[i]  + "_" + coal_shovel_operator[i] +  "[]' required='required' maxlength='128' type='number' value='' min='0' data-rule-required='true' data-msg-required='Please enter a valid number'></td>");
            }
            for (var i = 0; i < ob_shovels_operating.length; i++) {
                $(tr).append("<td><input name='ob_shovel_" + ob_shovels_operating[i]  + "_" + ob_shovel_operator[i] +  "[]' required='required' maxlength='128' type='number' value='' min='0' data-rule-required='true' data-msg-required='Please enter a valid number'></td>");
            }
        });
    });

    $("#save_dumpers").on('click', function() {
        //Create header
        dataForPage[0].data = [];
        var header = [];
        header.push({"text":"Date"});
        header.push({"text":"Shift"});
        header.push({"text":"Section"});

        var dumper_thead_th = $('#dumper_table > thead > tr > th');
        $(dumper_thead_th).each(function(index, th) {
            header.push({"text":$(th).html()});
        });
        dataForPage[0].data.push(header);

        var dumper_thead_tr = $('#dumper_table > tbody > tr');
        $(dumper_thead_tr).each(function(index, tr) {
            var excelData = [];
            excelData.push({"text":$('#date').val()});
            excelData.push({"text":$('#shift').val()});
            excelData.push({"text":$('#section').val()});
            $(tr).children('td').each(function() {
                excelData.push({"text": $(this).children('select, input').eq(0).val()});
            });
            dataForPage[0].data.push(excelData);
        });
        console.log(dataForPage);
        var options = {
            fileName: $('#date').val() + "_dumper_wise_production"
        };
        Jhxlsx.export(dataForPage, options);
    });
    $("#save_shovels").trigger('click');
});

