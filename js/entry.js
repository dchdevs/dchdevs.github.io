/* Dudhichua shift wise entry
*
* Generic Copyright
*
* Plug-ins used: jQuery hi hai abhi 
*/

var date = 'today';
var shift = 1;
var section = 1;
var shovel_working_hours = [];

//JSON for data
var dataForPage = [
    {
        "sheetName": "Sheet1",
        "data": []
    }
];

function create_table() {
    var coal_shovels_operating = [];
    var coal_shovel_operator = [];
    var ob_shovels_operating = [];
    var ob_shovel_operator = [];
    shovel_working_hours = [];

    var shovel_table_row = $('#shovel_table > tbody > tr');

    $(shovel_table_row).each(function(index, tr) {
        if ($('select[name="material_type[]"]').eq(index).val() === 'coal'
            && $('select[name="shovel_no[]"]').eq(index).val()
            && $('select[name="shovel_operator[]"]').eq(index).val()
        ) {
            coal_shovels_operating.push($('select[name="shovel_no[]"]').eq(index).val());
            coal_shovel_operator.push($('select[name="shovel_operator[]"]').eq(index).val());
            shovel_working_hours.push($('input[name="shovel_working_hours[]"]').eq(index).val());
        } else if ($('select[name="material_type[]"]').eq(index).val() === 'ob'
            && $('select[name="shovel_no[]"]').eq(index).val()
            && $('select[name="shovel_operator[]"]').eq(index).val()
        ) {
            ob_shovels_operating.push($('select[name="shovel_no[]"]').eq(index).val());
            ob_shovel_operator.push($('select[name="shovel_operator[]"]').eq(index).val());
            shovel_working_hours.push($('input[name="shovel_working_hours[]"]').eq(index).val());
        }
    });

    if(! coal_shovels_operating.length && ! ob_shovels_operating.length) {
        alert('No shovels to create table. Please fill at least 1 shovel row');
        return;
    }

    var dumper_tbody_tr = $('#dumper_table > tbody > tr');
    var dumper_thead_tr = $('#dumper_table > thead > tr');

    $('#dumper_table').find(".searchable").chosen('destroy').end();

    $(dumper_thead_tr).each(function(index, tr) {
        $(tr).find("th:gt(2)").remove();
        for (var i = 0; i < coal_shovels_operating.length; i++) {
            if(coal_shovels_operating[i] && coal_shovel_operator[i]) {
                $("<th>" + coal_shovels_operating[i] + "_Coal_" + coal_shovel_operator[i] + "</th>").insertAfter($(tr).find("th:last"));
            }
        }
        for (i = 0; i < ob_shovels_operating.length; i++) {
            if(ob_shovels_operating[i] && ob_shovel_operator[i]) {
                $("<th>" + ob_shovels_operating[i] + "_OB_" + ob_shovel_operator[i] + "</th>").insertAfter($(tr).find("th:last"));    
            }
        }
    });

    $(dumper_tbody_tr).each(function(index, tr) {
        $(tr).find("td:gt(2)").remove();
        for (var i = 0; i < coal_shovels_operating.length; i++) {
            if(coal_shovels_operating[i] && coal_shovel_operator[i]) {
                $(tr).append("<td><input name='coal_shovel_" + coal_shovels_operating[i]  + "_" + coal_shovel_operator[i] +  "[]' required='required' maxlength='128' type='number' value='' min='0' data-rule-required='true' data-msg-required='Please enter a valid number'></td>");
            }
        }
        for (var i = 0; i < ob_shovels_operating.length; i++) {
            if(ob_shovels_operating[i] && ob_shovel_operator[i]) {
                $(tr).append("<td><input name='ob_shovel_" + ob_shovels_operating[i]  + "_" + ob_shovel_operator[i] +  "[]' required='required' maxlength='128' type='number' value='' min='0' data-rule-required='true' data-msg-required='Please enter a valid number'></td>");
            }
        }
    });
    $('#dumperwise_entry').fadeIn(800);
    $('#dumper_table').find(".searchable").chosen();
}

function save_dumpers_get_excel() {
    //Create header
    dataForPage[0].data = [];
    var header = [];
    header.push({"text":"Date"});
    header.push({"text":"Shift"});
    header.push({"text":"Section"});

    var dumper_thead_th = $('#dumper_table > thead > tr > th');
    header.push({"text":$(dumper_thead_th).eq(0).html()});
    header.push({"text":$(dumper_thead_th).eq(1).html()});
    header.push({"text":"Shovel No."});
    header.push({"text":"Material Type"});
    header.push({"text":"Shovel Operator"});
    header.push({"text":"Working Hours (Shovel)"});
    header.push({"text":"Working Hours (Dumper)"});
    header.push({"text":"Production"});

    dataForPage[0].data.push(header);

    var dumper_thead_tr = $('#dumper_table > tbody > tr');
    $(dumper_thead_tr).each(function(index, tr) {
        var excelData = [];
        excelData.push({"text":new Date($('#date').val())});
        excelData.push({"text":parseInt($('#shift').val())});
        excelData.push({"text":$('#section').val()});
        excelData.push({"text":$(tr).children('td').eq(0).children('select, input').eq(0).val()});
        excelData.push({"text":parseInt($(tr).children('td').eq(1).children('select, input').eq(0).val())});
        var excelRowToInsert;
        var threeFields;
        $(tr).children('td').each(function(index, td) {
            if(index>2 && $(td).children('select, input').eq(0).val() !== '') {
                excelRowToInsert = [];
                excelRowToInsert = excelData.slice();
                threeFields = $(dumper_thead_th).eq(index).html().split('_');
                excelRowToInsert.push({"text": threeFields[0]});
                excelRowToInsert.push({"text": threeFields[1]});
                excelRowToInsert.push({"text": parseInt(threeFields[2])});
                excelRowToInsert.push({"text": parseFloat(shovel_working_hours[index-3])});
                excelRowToInsert.push({"text": parseFloat($(tr).children('td').eq(2).children('select, input').eq(0).val())});
                excelRowToInsert.push({"text": parseFloat($(td).children('select, input').eq(0).val())});
                dataForPage[0].data.push(excelRowToInsert);
            }
        });
    });
    var options = {
        fileName: $('#date').val() + "_Shift_" + $('#shift').val() + "_" + $('#section').val()
    };
    Jhxlsx.export(dataForPage, options);
}

$(document).ready(function() {
    $('.searchable').chosen();
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
    $('#date').val(today);

    $(".add_row1").on('click', function() {
        var table = $(this).parent().parent().find("table").first();
        $(table).find('select').chosen('destroy').end();
        $(table).find("tr").eq(1).clone().appendTo($(table));
        $(table).find('select').chosen();
        $('#dumperwise_entry').fadeOut(500);
    });
    $(".add_row2").on('click', function() {
        var table = $(this).parent().parent().find("table").first();
        $(table).find('select').chosen('destroy').end();
        $(table).find("tr").eq(1).clone().appendTo($(table)).find('input').val('');
        $(table).find('select').chosen();
    });
    $(".delete_row1").on('click', function() {
        var table = $(this).parent().parent().find("table").first();
        if ($(table).find("tr").length > 2) {
            $(table).find("tr").last().remove();
        }
        $('#dumperwise_entry').fadeOut(500);
    });
    $(".delete_row2").on('click', function() {
        var table = $(this).parent().parent().find("table").first();
        if ($(table).find("tr").length > 2) {
            $(table).find("tr").last().remove();
        }
    });
    $("#save_shovels").on('click', create_table);

    $("#save_dumpers").on('click', save_dumpers_get_excel);
});

