/* Dudhichua shift wise entry
*
* Generic Copyright
*
* Plug-ins used: jQuery for now
* Author: Atul Pratap Singh (https://github.com/atuldch)
*/

var date = 'today';
var shift = 1;
var section = 1;
var coal_shovel_working_hours = [];
var ob_shovel_working_hours = [];
var coal_shovels_operating = [];
var coal_shovel_operator = [];
var ob_shovels_operating = [];
var ob_shovel_operator = [];
var coal_shovel_seam = [];
var ob_shovel_seam = [];

//JSON for data
var dataForPage = [
    {
        "sheetName": "Sheet1",
        "data": []
    }
];

function create_table() {
    $('#dumperwise_entry').fadeOut(100);
    coal_shovels_operating = [];
    coal_shovel_operator = [];
    ob_shovels_operating = [];
    ob_shovel_operator = [];
    coal_shovel_working_hours = [];
    ob_shovel_working_hours = [];
    coal_shovel_seam = [];
    ob_shovel_seam = [];

    var shovel_table_row = $('#shovel_table > tbody > tr');

    $(shovel_table_row).each(function(index, tr) {
        if ($('select[name="material_type[]"]').eq(index).val() === 'coal'
            && $('select[name="shovel_no[]"]').eq(index).val()
            && $('select[name="shovel_operator[]"]').eq(index).val()
        ) {
            coal_shovels_operating.push($('select[name="shovel_no[]"]').eq(index).val());
            coal_shovel_operator.push($('select[name="shovel_operator[]"]').eq(index).val());
            coal_shovel_working_hours.push($('input[name="shovel_working_hours[]"]').eq(index).val());
            coal_shovel_seam.push($('select[name="seam[]"]').eq(index).val());
        } else if ($('select[name="material_type[]"]').eq(index).val() === 'ob'
            && $('select[name="shovel_no[]"]').eq(index).val()
            && $('select[name="shovel_operator[]"]').eq(index).val()
        ) {
            ob_shovels_operating.push($('select[name="shovel_no[]"]').eq(index).val());
            ob_shovel_operator.push($('select[name="shovel_operator[]"]').eq(index).val());
            ob_shovel_working_hours.push($('input[name="shovel_working_hours[]"]').eq(index).val());
            ob_shovel_seam.push($('select[name="seam[]"]').eq(index).val());
        }
    });

    if(! coal_shovels_operating.length && ! ob_shovels_operating.length) {
        alert('No shovels entered to create dumper-wise table. At least one required!');
        return;
    }

    $('#dumper_table').find(".searchable").chosen('destroy').end();
    $('#dumper_table > tbody').find("tr:gt(0)").remove();

    var dumper_thead_tr = $('#dumper_table > thead > tr');
    var dumper_tbody_tr = $('#dumper_table > tbody > tr');

    $(dumper_thead_tr).each(function(index, tr) {
        $(tr).find("th:gt(2)").remove();
        for (var i = 0; i < coal_shovels_operating.length; i++) {
            if(coal_shovels_operating[i] && coal_shovel_operator[i]) {
                $("<th style='background-color: beige;' class='shovel_column'>" + coal_shovels_operating[i] + "<br>(Coal)</th>").insertAfter($(tr).find("th:last"));
            }
            if(i === coal_shovels_operating.length - 1) {
                $("<th style='background-color: beige;'>Dump<br>Location<br>(Coal)</th>").insertAfter($(tr).find("th:last"));
            }
        }
        for (i = 0; i < ob_shovels_operating.length; i++) {
            if(ob_shovels_operating[i] && ob_shovel_operator[i]) {
                $("<th style='background-color: beige;' class='shovel_column'>" + ob_shovels_operating[i] + "<br>(OB)</th>").insertAfter($(tr).find("th:last"));    
            }
            if(i === ob_shovels_operating.length - 1) {
                $("<th style='background-color: beige;'>Dump<br>Location<br>(OB)</th>").insertAfter($(tr).find("th:last"));
            }
        }
    });

    var totals_html = '<tr class=totalColumn>'
    + '<td>Total</td>'
    + '<td></td>'
    + '<td>0</td>';

    $(dumper_tbody_tr).each(function(index, tr) {
        $(tr).find("input,select").val('');
        $(tr).find("td:gt(2)").remove();
        for (var i = 0; i < coal_shovels_operating.length; i++) {
            if(coal_shovels_operating[i] && coal_shovel_operator[i]) {
                $(tr).append("<td><input name='" + coal_shovels_operating[i] + "_Coal_" + coal_shovel_operator[i] + "[]' class='shovel_column_value inp " + "sum" + (i+4) + "' required='required' maxlength='128' type='number' value='' min='0' data-rule-required='true' data-msg-required='Please enter a valid number'></td>");
                totals_html += '<td>0</td>';
            }
            if(i === coal_shovels_operating.length - 1) {
                $(tr).append("<td><select style='width: 110px;' name='coal_dump_location[]' class='searchable'>"
                + "<option value='' selected disabled hidden>Select Dump</option>"
                + "<option value='East Coal Yard'>East Coal Yard</option>"
                + "<option value='West Coal Yard'>West Coal Yard</option>"
                + "<option value='Crusher Yard'>Crusher Yard</option>"
                + "</select></td>");
                totals_html += '<td></td>';
            }
        }
        for (var i = 0; i < ob_shovels_operating.length; i++) {
            if(ob_shovels_operating[i] && ob_shovel_operator[i]) {
                $(tr).append("<td><input name='" + ob_shovels_operating[i] + "_OB_" + ob_shovel_operator[i] + "[]' class='shovel_column_value inp " + "sum" + (i + coal_shovels_operating.length + 5) + "' required='required' maxlength='128' type='number' value='' min='0' data-rule-required='true' data-msg-required='Please enter a valid number'></td>");
                totals_html += '<td>0</td>';
            }
            if(i === ob_shovels_operating.length - 1) {
                $(tr).append("<td><select style='width: 110px;' name='ob_dump_location[]' class='searchable'>"
                + "<option value='' selected disabled hidden>Select Dump</option>"
                + "<option value='OB Dump East'>OB Dump East</option>"
                + "<option value='OB Dump West'>OB Dump West</option>"
                + "<option value='Local OB Dump'>Local OB Dump</option>"
                + "</select></td>");
                totals_html += '<td></td>';
            }
        }
    });
    totals_html += '</tr>';
    $('#dumper_table > tbody').append(totals_html);
    bind_total_event();

    $('#dumperwise_entry').fadeIn(300);
    $('.edit').show();
    $('#dummy').show();
    $('#dumper_table').find(".searchable").chosen().change(setFocusOnNextElement);
    $('td > input').on('keydown', function(e) {
        if (e.which === 13) {
            var element = $(this).parent().next().children('input,select').eq(0);
            if(element.is('input')) {
                window.setTimeout(() => $(element).focus(), 0);
            } else if (element.is('select')) {
                window.setTimeout(() => $(element).trigger('chosen:activate'), 0);
            }
            return false;
        }
    });
}

function bind_total_event() {
    $('#dumper_table tr:not(.totalColumn) input').bind('keyup change', function() {
        calc_total(this);
    });
}

function calc_total(obj) {
    var $table = $(obj).closest('table');
    var total = 0;
    var thisNumber = $(obj).attr('class').slice(-1);

    if(! isNaN(thisNumber)) {
        $table.find('tr:not(.totalColumn) .sum' + thisNumber).each(function() {
            total += +$(this).val();
        });
        $table.find('.totalColumn td:nth-child('+ thisNumber + ')').html(total);
    }
}

function get_sap_compatible_excel() {
    //Create header
    dataForPage[0].data = [];
    var header = [];
    header.push({"text":"Plant"});
    header.push({"text":"Materialcode"});
    header.push({"text":"Process_Order"});
    header.push({"text":"Production_Date"});
    header.push({"text":"Shift"});
    header.push({"text":"Seam"});
    header.push({"text":"Bench"});
    header.push({"text":"Shovel_Number"});
    header.push({"text":"Shovel_Operator"});
    header.push({"text":"Shovel_Operating_Time"});
    header.push({"text":"Dumper_Number"});
    header.push({"text":"Dumper_Operator"});
    header.push({"text":"Dumper_Operating_Time"});
    header.push({"text":"Dumper_Number_of_Trips"});
    header.push({"text":"Dumper_Factor"});
    header.push({"text":"Dumper_Tonnage"});

    dataForPage[0].data.push(header);

    var dumper_thead_th = $('#dumper_table > thead > tr > th');
    $(dumper_thead_th).each(function(index, th) {
        if ($(th).hasClass("shovel_column")) {
            var excelData = [];
            excelData.push({"text":$('#plant').val()});
            excelData.push({"text":$('#material_code').val()});
            excelData.push({"text":$('#process_order').val()});
            excelData.push({"text":new Date($('#date').val())});
            excelData.push({"text":$('#shift').val()});
            var excelRowToInsert;
            var threeFields;
            var dumper_columns = $('#dumper_table tr td:nth-child(' + (index + 1) + ')');
            $(dumper_columns).each(function(index1, td) {
                if ($(td).children('select, input').eq(0).is('input') 
                && $(td).children('select, input').eq(0).val() !== '') {
                    excelRowToInsert = [];
                    excelRowToInsert = excelData.slice();
                    threeFields = $(td).children('select, input').eq(0).attr("name").split('_');
                    if (threeFields[1] === 'Coal') {
                        excelRowToInsert.push({"text": coal_shovel_seam[index-3]});
                    } else if (threeFields[1] === 'OB') {
                        excelRowToInsert.push({"text": ob_shovel_seam[index-4-coal_shovel_seam.length]});
                    }
                    excelRowToInsert.push({"text": threeFields[0]});
                    excelRowToInsert.push({"text": threeFields[0]});
                    excelRowToInsert.push({"text": parseInt(threeFields[2])});
                    //shovel operating time
                    if (threeFields[1] === 'Coal') {
                        excelRowToInsert.push({"text": parseFloat(coal_shovel_working_hours[index-3])});
                    } else if (threeFields[1] === 'OB') {
                        excelRowToInsert.push({"text": parseFloat(ob_shovel_working_hours[index-4-coal_shovel_working_hours.length])});
                    }
                    excelData.push({"text":$(td).parent().children('td').eq(0).children('select, input').eq(0).val()});
                    excelData.push({"text":parseInt($(td).parent().children('td').eq(1).children('select, input').eq(0).val())});
                    excelData.push({"text":parseInt($(td).parent().children('td').eq(2).children('select, input').eq(0).val())});
                    excelData.push({"text":parseInt($(td).children('select, input').eq(0).val())});

                    dataForPage[0].data.push(excelRowToInsert);
                }
            });
        }
    });

    var options = {
        fileName: $('#date').val() + "_Shift_" + $('#shift').val() + "_" + $('#section').val()
    };
    Jhxlsx.export(dataForPage, options);

}

function save_dumpers_get_excel_old() {
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
    header.push({"text":"Seam"});
    header.push({"text":"Working Hours (Shovel)"});
    header.push({"text":"Working Hours (Dumper)"});
    header.push({"text":"Production"});
    header.push({"text":"Dump Location"});

    dataForPage[0].data.push(header);

    var dumper_tbody_tr = $('#dumper_table > tbody > tr');
    $(dumper_tbody_tr).each(function(index, tr) {
        var excelData = [];
        excelData.push({"text":new Date($('#date').val())});
        excelData.push({"text":$('#shift').val()});
        excelData.push({"text":$('#section').val()});
        excelData.push({"text":$(tr).children('td').eq(0).children('select, input').eq(0).val()});
        excelData.push({"text":parseInt($(tr).children('td').eq(1).children('select, input').eq(0).val())});
        var excelRowToInsert;
        var threeFields;
        $(tr).children('td').each(function(index1, td) {
            if(index1 > 2
                && $(td).children('select, input').eq(0).is('input') 
                && $(td).children('select, input').eq(0).val() !== ''
            ) {
                excelRowToInsert = [];
                excelRowToInsert = excelData.slice();
                threeFields = $(td).children('select, input').eq(0).attr("name").split('_');
                excelRowToInsert.push({"text": threeFields[0]});
                excelRowToInsert.push({"text": threeFields[1]});
                excelRowToInsert.push({"text": parseInt(threeFields[2])});
                var dump_location;
                if (threeFields[1] === 'Coal') {
                    excelRowToInsert.push({"text": coal_shovel_seam[index1-3]});
                    excelRowToInsert.push({"text": parseFloat(coal_shovel_working_hours[index1-3])});
                    dump_location = $('select[name="coal_dump_location[]"]').eq(index).val();
                } else if (threeFields[1] === 'OB') {
                    excelRowToInsert.push({"text": "OVERBURDEN"});
                    excelRowToInsert.push({"text": parseFloat(ob_shovel_working_hours[index1-4-coal_shovel_working_hours.length])});
                    dump_location = $('select[name="ob_dump_location[]"]').eq(index).val();
                }
                excelRowToInsert.push({"text": parseFloat($(tr).children('td').eq(2).children('select, input').eq(0).val())});
                excelRowToInsert.push({"text": parseFloat($(td).children('select, input').eq(0).val())});
                excelRowToInsert.push({"text": dump_location});
                dataForPage[0].data.push(excelRowToInsert);
            }
        });
    });
    var options = {
        fileName: $('#date').val() + "_Shift_" + $('#shift').val() + "_" + $('#section').val()
    };
    Jhxlsx.export(dataForPage, options);
}

function setFocusOnNextElement() {
    var element = $(this).parent().next().children('input,select').eq(0);
    if(element.is('input')) {
        window.setTimeout(() => $(element).focus(), 0);
    } else if (element.is('select')) {
        window.setTimeout(() => $(element).trigger('chosen:activate'), 0);
    }
    return false;
}

$(document).ready(function() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
    $('#date').val(today);
    
    $('.searchable').chosen().change(setFocusOnNextElement);

    $(".add_row1").on('click', function() {
        var table = $(this).parent().parent().find("table").first();
        $(table).find('select').chosen('destroy').end();
        $(table).find("tr").eq(1).clone().appendTo($(table));
        $(table).find('select').chosen().change(setFocusOnNextElement);
        $('#dumperwise_entry').fadeOut(100);
    });
    $(".add_row2").on('click', function() {
        var table = $(this).parent().parent().find("table").first();
        $(table).find('select').chosen('destroy').end();
        $(table).find("tr").eq(1).clone().insertAfter($('#dumper_table > tbody > tr').eq($('#dumper_table > tbody > tr').length -2)).find('input').val('');
        bind_total_event();
        $(table).find('select').chosen().change(setFocusOnNextElement);
        $('td > input').on('keydown', function(e) {
            if (e.which === 13) {
                var element = $(this).parent().next().children('input,select').eq(0);
                if(element.is('input')) {
                    window.setTimeout(() => $(element).focus(), 0);
                } else if (element.is('select')) {
                    window.setTimeout(() => $(element).trigger('chosen:activate'), 0);
                }
                return false;
            }
        });
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
        if ($(table).find("tr").length > 3) {
            $(table).find("tr").eq(-2).remove();
            $('#dumper_table tr:not(.totalColumn) input').each(function () {
                calc_total(this);
            });
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

    $("#save_dumpers").on('click', save_dumpers_get_excel_old);
    $("#save_dumpers_1").on('click', get_sap_compatible_excel);
});