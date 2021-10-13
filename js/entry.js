/* Dudhichua shift wise entry
*
* Generic Copyright
*
* Plug-ins used: jQuery hi hai abhi 
*/

var date = 'today';
var shift = 1;
var section = 1;
var coal_shovel_working_hours = [];
var ob_shovel_working_hours = [];

//JSON for data
var dataForPage = [
    {
        "sheetName": "Sheet1",
        "data": []
    }
];

function create_table() {
    $('#dumperwise_entry').fadeOut(100);
    var coal_shovels_operating = [];
    var coal_shovel_operator = [];
    var ob_shovels_operating = [];
    var ob_shovel_operator = [];
    coal_shovel_working_hours = [];
    ob_shovel_working_hours = [];

    var shovel_table_row = $('#shovel_table > tbody > tr');

    $(shovel_table_row).each(function(index, tr) {
        if ($('select[name="material_type[]"]').eq(index).val() === 'coal'
            && $('select[name="shovel_no[]"]').eq(index).val()
            && $('select[name="shovel_operator[]"]').eq(index).val()
        ) {
            coal_shovels_operating.push($('select[name="shovel_no[]"]').eq(index).val());
            coal_shovel_operator.push($('select[name="shovel_operator[]"]').eq(index).val());
            coal_shovel_working_hours.push($('input[name="shovel_working_hours[]"]').eq(index).val());
        } else if ($('select[name="material_type[]"]').eq(index).val() === 'ob'
            && $('select[name="shovel_no[]"]').eq(index).val()
            && $('select[name="shovel_operator[]"]').eq(index).val()
        ) {
            ob_shovels_operating.push($('select[name="shovel_no[]"]').eq(index).val());
            ob_shovel_operator.push($('select[name="shovel_operator[]"]').eq(index).val());
            ob_shovel_working_hours.push($('input[name="shovel_working_hours[]"]').eq(index).val());
        }
    });

    if(! coal_shovels_operating.length && ! ob_shovels_operating.length) {
        alert('No shovels entered to create dumper-wise table. At least one required!');
        return;
    }

    var dumper_thead_tr = $('#dumper_table > thead > tr');
    var dumper_tbody_tr = $('#dumper_table > tbody > tr');

    $('#dumper_table').find(".searchable").chosen('destroy').end();
    $('#dumper_table > tbody').find("tr:gt(0)").remove();

    $(dumper_thead_tr).each(function(index, tr) {
        $(tr).find("th:gt(1)").remove();
        for (var i = 0; i < coal_shovels_operating.length; i++) {
            if(coal_shovels_operating[i] && coal_shovel_operator[i]) {
                $("<th>" + coal_shovels_operating[i] + "<br>(Coal)</th>").insertAfter($(tr).find("th:last"));
            }
        }
        for (i = 0; i < ob_shovels_operating.length; i++) {
            if(ob_shovels_operating[i] && ob_shovel_operator[i]) {
                $("<th>" + ob_shovels_operating[i] + "<br>(OB)</th>").insertAfter($(tr).find("th:last"));    
            }
        }
    });

    $(dumper_tbody_tr).each(function(index, tr) {
        $(tr).find("input,select").val('');
        $(tr).find("td:gt(1)").remove();
        for (var i = 0; i < coal_shovels_operating.length; i++) {
            if(coal_shovels_operating[i] && coal_shovel_operator[i]) {
                $(tr).append("<td><input name='" + coal_shovels_operating[i] + "_Coal_" + coal_shovel_operator[i] + "[]' class='inp' required='required' maxlength='128' type='number' value='' min='0' data-rule-required='true' data-msg-required='Please enter a valid number'></td>");
            }
        }
        for (var i = 0; i < ob_shovels_operating.length; i++) {
            if(ob_shovels_operating[i] && ob_shovel_operator[i]) {
                $(tr).append("<td><input name='" + ob_shovels_operating[i] + "_OB_" + ob_shovel_operator[i] + "[]' class='inp' required='required' maxlength='128' type='number' value='' min='0' data-rule-required='true' data-msg-required='Please enter a valid number'></td>");
            }
        }
    });
    $('#dumperwise_entry').fadeIn(300);
    $('.edit').show();
    $('#dummy').show();
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
    header.push({"text":"Production"});

    dataForPage[0].data.push(header);

    var dumper_tbody_tr = $('#dumper_table > tbody > tr');
    $(dumper_tbody_tr).each(function(index, tr) {
        var excelData = [];
        excelData.push({"text":new Date($('#date').val())});
        excelData.push({"text":parseInt($('#shift').val())});
        excelData.push({"text":$('#section').val()});
        excelData.push({"text":$(tr).children('td').eq(0).children('select, input').eq(0).val()});
        excelData.push({"text":parseInt($(tr).children('td').eq(1).children('select, input').eq(0).val())});
        var excelRowToInsert;
        var threeFields;
        $(tr).children('td').each(function(index, td) {
            if(index>1 && $(td).children('select, input').eq(0).val() !== '') {
                excelRowToInsert = [];
                excelRowToInsert = excelData.slice();
                threeFields = $(td).children('select, input').eq(0).attr("name").split('_');
                excelRowToInsert.push({"text": threeFields[0]});
                excelRowToInsert.push({"text": threeFields[1]});
                excelRowToInsert.push({"text": parseInt(threeFields[2])});
                if (threeFields[1] === 'Coal') {
                    excelRowToInsert.push({"text": parseFloat(coal_shovel_working_hours[index-2])});
                } else if (threeFields[1] === 'OB') {
                    excelRowToInsert.push({"text": parseFloat(ob_shovel_working_hours[index-2-coal_shovel_working_hours.length])});
                }
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
        $('#dumperwise_entry').fadeOut(100);
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
        $('#dumperwise_entry').fadeOut(100);
    });
    $(".delete_row2").on('click', function() {
        var table = $(this).parent().parent().find("table").first();
        if ($(table).find("tr").length > 2) {
            $(table).find("tr").last().remove();
        }
    });
    $("#save_shovels").on('click', create_table);

    $("form#shovels").on('change', function() {
        $('#dumperwise_entry').fadeOut(100);
    });

    $('#re_edit_shovels').on('click', function() {
        $('#dummy').hide();
        $('.edit').hide();
    });

    $("#save_dumpers").on('click', save_dumpers_get_excel);
});

