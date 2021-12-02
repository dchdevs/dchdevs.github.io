/* Dudhichua shift wise entry
*
* Generic Copyright
*
* Libraries used: jQuery, jspdf, html2canvas, html2pdf, jhxlsx
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
var material_code_coal = 4900000014;
var material_code_ob = 4900000011;
var process_order_purewa_coal = 60004129;
var process_order_turra_coal = 60004130;
var process_order_ob = 70003257;

function check_mandatory_fields() {
    var flag = false;
    $('#dumper_table select').each(function () {
        if (($(this).val() == ''
            || $(this).val() == null)
            && !$(this).hasClass('dump')
        ) {
            flag = true;
        }
    });
    $('#dumper_table input[name="dumper_working_hours[]"]').each(function () {
        if ($(this).val() == ''
            || $(this).val() == null
        ) {
            flag = true;
        }
    });
    return flag;
}

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

    $(shovel_table_row).each(function (index, tr) {
        if ($('select[name="material_type[]"]').eq(index).val() === 'Coal'
            && $('select[name="shovel_no[]"]').eq(index).val()
            && $('select[name="shovel_operator[]"]').eq(index).val()
            && $('select[name="seam[]"]').eq(index).val()
            && $('input[name="shovel_working_hours[]"]').eq(index).val()
        ) {
            coal_shovels_operating.push($('select[name="shovel_no[]"]').eq(index).val());
            coal_shovel_operator.push($('select[name="shovel_operator[]"]').eq(index).val());
            coal_shovel_working_hours.push($('input[name="shovel_working_hours[]"]').eq(index).val());
            coal_shovel_seam.push([$('select[name="seam[]"]').eq(index).val().split('|')[0], $('select[name="seam[]"]').eq(index).val().split('|')[1]]);
        } else if ($('select[name="material_type[]"]').eq(index).val() === 'OB'
            && $('select[name="shovel_no[]"]').eq(index).val()
            && $('select[name="shovel_operator[]"]').eq(index).val()
            && $('select[name="seam[]"]').eq(index).val()
            && $('input[name="shovel_working_hours[]"]').eq(index).val()
        ) {
            ob_shovels_operating.push($('select[name="shovel_no[]"]').eq(index).val());
            ob_shovel_operator.push($('select[name="shovel_operator[]"]').eq(index).val());
            ob_shovel_working_hours.push($('input[name="shovel_working_hours[]"]').eq(index).val());
            ob_shovel_seam.push([$('select[name="seam[]"]').eq(index).val().split('|')[0], $('select[name="seam[]"]').eq(index).val().split('|')[1]]);
        }
    });

    if (!coal_shovels_operating.length && !ob_shovels_operating.length) {
        alert('ERROR: Empty fields in SHOVEL TABLE!');
        return;
    }

    $('#dumper_table').find(".searchable").chosen('destroy').end();
    $('#dumper_table > tbody').find("tr:gt(0)").remove();

    var dumper_thead_tr = $('#dumper_table > thead > tr');
    var dumper_tbody_tr = $('#dumper_table > tbody > tr');

    $(dumper_thead_tr).each(function (index, tr) {
        $(tr).find("th:gt(2)").remove();
        for (var i = 0; i < coal_shovels_operating.length; i++) {
            if (coal_shovels_operating[i] && coal_shovel_operator[i]) {
                $("<th class='shovel_column'>" + coal_shovels_operating[i] + "<br>(Coal)</th>").insertAfter($(tr).find("th:last"));
            }
            if (i === coal_shovels_operating.length - 1) {
                $("<th>Dump Location<br>(Coal)</th>").insertAfter($(tr).find("th:last"));
            }
        }
        for (i = 0; i < ob_shovels_operating.length; i++) {
            if (ob_shovels_operating[i] && ob_shovel_operator[i]) {
                $("<th class='shovel_column'>" + ob_shovels_operating[i] + "<br>(OB)</th>").insertAfter($(tr).find("th:last"));
            }
            if (i === ob_shovels_operating.length - 1) {
                $("<th>Dump Location<br>(OB)</th>").insertAfter($(tr).find("th:last"));
            }
        }
    });

    var totals_html = '<tr class=totalColumn>'
        + '<td>Total Trips</td>'
        + '<td></td>'
        + '<td></td>';

    var total_quantity_html = '<tr class=totalQuantityColumn>'
        + '<td>Total Quantity</td>'
        + '<td></td>'
        + '<td></td>';

    $(dumper_tbody_tr).each(function (index, tr) {
        $(tr).find("input,select").val('');
        $(tr).find("td:gt(2)").remove();
        for (var i = 0; i < coal_shovels_operating.length; i++) {
            if (coal_shovels_operating[i] && coal_shovel_operator[i]) {
                $(tr).append("<td><input name='" + coal_shovels_operating[i] + "_Coal_" + coal_shovel_operator[i] + "[]' class='shovel_dumper_trip inp " + "sum" + (i + 4) + "' required='required' maxlength='128' type='number' value='' min='0' data-rule-required='true' data-msg-required='Please enter a valid number'></td>");
                totals_html += '<td>0</td>';
                total_quantity_html += '<td>0</td>';
            }
            if (i === coal_shovels_operating.length - 1) {
                $(tr).append("<td><select style='width: 110px;' name='coal_dump_location[]' class='searchable dump'>"
                    + "<option value='' selected disabled hidden>Select Dump</option>"
                    + "<option value='East Coal Yard'>East Coal Yard</option>"
                    + "<option value='West Coal Yard'>West Coal Yard</option>"
                    + "<option value='Crusher Yard'>Crusher Yard</option>"
                    + "</select></td>");
                totals_html += '<td></td>';
                total_quantity_html += '<td></td>';
            }
        }
        for (var i = 0; i < ob_shovels_operating.length; i++) {
            if (ob_shovels_operating[i] && ob_shovel_operator[i]) {
                var sum_offset = coal_shovels_operating.length ? (i + coal_shovels_operating.length + 5) : (i+4);
                $(tr).append("<td><input name='" + ob_shovels_operating[i] + "_OB_" + ob_shovel_operator[i] + "[]' class='shovel_dumper_trip inp " + "sum" + sum_offset + "' required='required' maxlength='128' type='number' value='' min='0' data-rule-required='true' data-msg-required='Please enter a valid number'></td>");
                totals_html += '<td>0</td>';
                total_quantity_html += '<td>0</td>';
            }
            if (i === ob_shovels_operating.length - 1) {
                $(tr).append("<td><select style='width: 110px;' name='ob_dump_location[]' class='searchable dump'>"
                    + "<option value='' selected disabled hidden>Select Dump</option>"
                    + "<option value='OB Dump East'>OB Dump East</option>"
                    + "<option value='OB Dump West'>OB Dump West</option>"
                    + "<option value='Local OB Dump'>Local OB Dump</option>"
                    + "</select></td>");
                totals_html += '<td></td>';
                total_quantity_html += '<td></td>';
            }
        }
    });
    totals_html += '</tr>';
    total_quantity_html += '</tr>';
    $('#dumper_table > tbody').append(totals_html);
    $('#dumper_table > tbody').append(total_quantity_html);
    bind_total_event();

    $('#dumperwise_entry').fadeIn(300);
    $('#dummy').show();
    $('#dumper_table').find(".searchable").chosen().change(setFocusOnNextElement);
    $('td > input').on('keydown', function (e) {
        if (e.which === 13) {
            var element = $(this).parent().next().children('input,select').eq(0);
            if (element.is('input')) {
                window.setTimeout(() => $(element).focus(), 0);
            } else if (element.is('select')) {
                window.setTimeout(() => $(element).trigger('chosen:activate'), 0);
            }
            return false;
        }
    });
}

function bind_total_event() {
    $('#dumper_table .shovel_dumper_trip').bind('keyup change', function () {
        calc_total(this);
    });
}

function calc_total(obj) {
    var $table = $(obj).closest('table');
    var total = 0;
    var total_quantity = 0;
    var thisNumber = $(obj).attr('class').slice(-1);

    if (!isNaN(thisNumber)) {
        $table.find('tr:not(.totalColumn) .sum' + thisNumber).each(function () {
            total += +$(this).val();
        });
        $table.find('tr:not(.totalColumn) .shovel_dumper_trip.sum' + thisNumber).each(function () {
            var trips = +$(this).val();
            var material_name = $(this).attr("name").split('_')[1];
            var dumper_number = $(this).parent().parent().children('td').eq(0).children('select, input').eq(0).val();
            if (dumper_number !== null) {
                var dumper_factor = get_dumper_factor(dumper_number, material_name);
                total_quantity += parseInt(trips) * parseInt(dumper_factor);
            }
        });
        $table.find('.totalColumn td:nth-child(' + thisNumber + ')').html(total);
        $table.find('.totalQuantityColumn td:nth-child(' + thisNumber + ')').html(total_quantity);
    }
}

function working_hour_distribution(dumper_working_hours, dumper_shovel_trips) {
    var working_hours = {};
    var total_trips = {};
    for (const key in dumper_shovel_trips) {
        //working_hours_array[key] = {};
        var total_dumper_trips = 0;
        for (const key1 in dumper_shovel_trips[key]) {
            total_dumper_trips += parseInt(dumper_shovel_trips[key][key1]);
        }
        total_trips[key] = total_dumper_trips;
    }
    for (const key in dumper_shovel_trips) {
        working_hours[key] = {};
        for (const key1 in dumper_shovel_trips[key]) {
            working_hours[key][key1] = (parseFloat(dumper_shovel_trips[key][key1]) / parseFloat(total_trips[key])) * parseFloat(dumper_working_hours[key]);
        }
    }
    return working_hours;
}

function get_pdf_report() {
    $('select').each(function(){
        $(this).after($('<span class="select-print">' 
            + $(this).find('option:selected').text() + '</span>'));
    });
    $('input[type="number"],input[type="date"]').each(function(){
        $(this).after($('<span class="select-print">' 
            + $(this).val() + '</span>'));
    });
    $('#print_time').text('Generated on: ' + new Date().toLocaleString());
    $("head").append("<link id='printcss' href='css/print.css' type='text/css' rel='stylesheet' />");
    var opt = {
        margin:       [0.2,0.1,0.2,0.1],
        filename:     $('#date').val() + "_Shift_" + $('#shift').val() + "_" + $('#section').val() + '.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(document.body).outputPdf().then(function(pdf) {
        $('#printcss').remove();
        $('.select-print').remove();
    }).save();
}

function get_sap_compatible_excel() {
    var check = check_mandatory_fields();
    if (check == true) {
        alert('ERROR: Empty fields in DUMPER TABLE!');
        return;
    }
    //Create header
    dataForPage[0].data = [];
    var header = [];
    header.push({ "text": "Plant" });
    header.push({ "text": "Materialcode" });
    header.push({ "text": "Process_Order" });
    header.push({ "text": "Production_Date" });
    header.push({ "text": "Shift" });
    header.push({ "text": "Seam" });
    header.push({ "text": "Bench" });
    header.push({ "text": "Shovel_Number" });
    header.push({ "text": "Shovel_Operator" });
    header.push({ "text": "Shovel_Operating_Time" });
    header.push({ "text": "Dumper_Number" });
    header.push({ "text": "Dumper_Operator" });
    header.push({ "text": "Dumper_Operating_Time" });
    header.push({ "text": "Dumper_Number_of_Trips" });
    header.push({ "text": "Dumper_Factor" });
    header.push({ "text": "Dumper_Tonnage" });
    header.push({ "text": "Dumper_Volume" });

    dataForPage[0].data.push(header);

    var dumper_thead_th = $('#dumper_table > thead > tr > th');

    //calculate dumper working hour distribution
    var dumper_working_hours = {};
    //load dumper-wise working hours
    $('#dumper_table input[name="dumper_working_hours[]"]').each(function () {
        if ($(this).val() !== '') {
            dumper_working_hours[$(this).parent().parent().children().first().children('select, input').eq(0).val()] = $(this).val();
        }
    });

    var dumper_shovel_trips = {};
    //load dumper to shovel-wise trips
    var dumper_tbody_tr = $('#dumper_table > tbody > tr');
    $(dumper_tbody_tr).each(function (index, tr) {
        var unique_dumper = $(tr).children('td').eq(0).children('select, input').eq(0).val();
        dumper_shovel_trips[unique_dumper] = {};
        $(tr).children('td').each(function (index1, td) {
            if ($(td).children('input').eq(0).hasClass('shovel_dumper_trip')
                && $(td).children('select, input').eq(0).val() !== ''
            ) {
                var unique_shovel = $(td).children('select, input').eq(0).attr("name");
                dumper_shovel_trips[unique_dumper][unique_shovel] = $(td).children('select, input').eq(0).val();
            }
        });
    });

    var dumper_working_hour_distribution = working_hour_distribution(dumper_working_hours, dumper_shovel_trips);

    //calculate shovel working hour distribution
    var shovel_working_hours = {};
    //load dumper-wise working hours
    $('#shovel_table input[name="shovel_working_hours[]"]').each(function () {
        if ($(this).val() !== '') {
            var threeF = $(this).parent().parent().children().first().children('select, input').eq(0).val()
                + '_' + $(this).parent().parent().children().eq(2).children('select, input').eq(0).val()
                + '_' + $(this).parent().parent().children().eq(1).children('select, input').eq(0).val()
                + '[]';

            shovel_working_hours[threeF] = $(this).val();
        }
    });

    var shovel_dumper_trips = {};
    //load dumper to shovel-wise trips
    $('#dumper_table tbody tr').first().find('td').each(function (index, td) {
        if ($(td).children('input').eq(0).hasClass('shovel_dumper_trip')) {
            var unique_shovel = $(td).children('select, input').eq(0).attr("name");
            shovel_dumper_trips[unique_shovel] = {};
            var dumper_columns = $('#dumper_table tr td:nth-child(' + (index + 1) + ')');
            $(dumper_columns).each(function (index1, td1) {
                if ($(td1).children('input').eq(0).hasClass('shovel_dumper_trip')
                    && $(td1).children('select, input').eq(0).val() !== ''
                ) {
                    var unique_dumper = $(td1).parent().children('td').eq(0).children('select, input').eq(0).val();
                    shovel_dumper_trips[unique_shovel][unique_dumper] = $(td1).children('select, input').eq(0).val();
                }
            });
        }
    });

    var shovel_working_hour_distribution = working_hour_distribution(shovel_working_hours, shovel_dumper_trips);


    $(dumper_thead_th).each(function (index, th) {
        if ($(th).hasClass("shovel_column")) {
            var excelData = [];
            excelData.push({ "text": $('#plant').val() });
            var excelRowToInsert;
            var threeFields;
            var dumper_columns = $('#dumper_table tr td:nth-child(' + (index + 1) + ')');
            $(dumper_columns).each(function (index1, td) {
                if ($(td).children('select, input').eq(0).is('input')
                    && $(td).children('select, input').eq(0).val() !== '') {
                    excelRowToInsert = [];
                    excelRowToInsert = excelData.slice();
                    threeFields = $(td).children('select, input').eq(0).attr("name").split('_');
                    if (threeFields[1] === 'Coal') {
                        excelRowToInsert.push({ "text": material_code_coal });
                    } else if (threeFields[1] === 'OB') {
                        excelRowToInsert.push({ "text": material_code_ob });
                    }
                    if (threeFields[1] === 'OB') {
                        excelRowToInsert.push({ "text": process_order_ob });
                    } else if (coal_shovel_seam[index - 3][1].indexOf('TURRA') > -1 && threeFields[1] === 'Coal') {
                        excelRowToInsert.push({ "text": process_order_turra_coal });
                    } else if (coal_shovel_seam[index - 3][1].indexOf('PUREVA') > -1 && threeFields[1] === 'Coal') {
                        excelRowToInsert.push({ "text": process_order_purewa_coal });
                    }
                    excelRowToInsert.push({ "text": new Date($('#date').val()) });
                    excelRowToInsert.push({ "text": $('#shift').val() });
                    if (threeFields[1] === 'Coal') {
                        excelRowToInsert.push({ "text": coal_shovel_seam[index - 3][0] });
                        excelRowToInsert.push({ "text": coal_shovel_seam[index - 3][1] });
                    } else if (threeFields[1] === 'OB') {
                        excelRowToInsert.push({ "text": ob_shovel_seam[index - 4 - coal_shovel_seam.length][0] });
                        excelRowToInsert.push({ "text": ob_shovel_seam[index - 4 - coal_shovel_seam.length][1] });
                    }
                    excelRowToInsert.push({ "text": threeFields[0] });
                    excelRowToInsert.push({ "text": parseInt(threeFields[2]) });
                    //shovel operating time
                    if (threeFields[1] === 'Coal') {
                        excelRowToInsert.push({ "text": parseInt(shovel_working_hour_distribution[$(td).children('select, input').eq(0).attr("name")][$(td).parent().children('td').eq(0).children('select, input').eq(0).val()] * 60) });
                    } else if (threeFields[1] === 'OB') {
                        excelRowToInsert.push({ "text": parseInt(shovel_working_hour_distribution[$(td).children('select, input').eq(0).attr("name")][$(td).parent().children('td').eq(0).children('select, input').eq(0).val()] * 60) });
                    }
                    excelRowToInsert.push({ "text": $(td).parent().children('td').eq(0).children('select, input').eq(0).val() });
                    excelRowToInsert.push({ "text": parseInt($(td).parent().children('td').eq(1).children('select, input').eq(0).val()) });
                    excelRowToInsert.push({ "text": parseInt(dumper_working_hour_distribution[$(td).parent().children('td').eq(0).children('select, input').eq(0).val()][$(td).children('select, input').eq(0).attr("name")] * 60) });
                    var trips = $(td).children('select, input').eq(0).val();
                    excelRowToInsert.push({ "text": parseInt(trips) });
                    var dumper_factor = get_dumper_factor($(td).parent().children('td').eq(0).children('select, input').eq(0).val(), threeFields[1]);
                    excelRowToInsert.push({ "text": parseInt(dumper_factor) });
                    var dumper_tonnage = trips * dumper_factor;
                    if (threeFields[1] === 'Coal') {
                        excelRowToInsert.push({ "text": parseInt(dumper_tonnage) });
                        excelRowToInsert.push({ "text": '' });
                    } else if (threeFields[1] === 'OB') {
                        excelRowToInsert.push({ "text": '' });
                        excelRowToInsert.push({ "text": parseInt(dumper_tonnage) });
                    }
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

function get_dumper_factor(dumper_number, material_type) {
    var df;
    /*
    CN-01 TO CN-36 FOR COAL=45 FOR OB 32
    C-SERIES & K/D SERIES COAL 40 & OB 27
    TX SERIES COAL 55 OB 37
    KM SERIES FOR COAL=45 FOR OB 32
    CAT SERIES COAL 75 OB 50
    */
    if (dumper_number.indexOf('CN-') > -1) {
        df = material_type == 'Coal' ? 45 : 32;
    } else if (dumper_number.indexOf('C-') > -1
        || dumper_number.indexOf('K-') > -1
        || dumper_number.indexOf('D-') > -1) {
        df = material_type == 'Coal' ? 40 : 27;
    } else if (dumper_number.indexOf('TX-') > -1) {
        df = material_type == 'Coal' ? 55 : 37;
    } else if (dumper_number.indexOf('KM-') > -1) {
        df = material_type == 'Coal' ? 45 : 32;
    } else if (dumper_number.indexOf('CAT-') > -1) {
        df = material_type == 'Coal' ? 70 : 50;
    }
    return df;
}

function save_dumpers_get_excel_old() {
    //Create header
    dataForPage[0].data = [];
    var header = [];
    header.push({ "text": "Date" });
    header.push({ "text": "Shift" });
    header.push({ "text": "Section" });

    var dumper_thead_th = $('#dumper_table > thead > tr > th');
    header.push({ "text": $(dumper_thead_th).eq(0).html() });
    header.push({ "text": $(dumper_thead_th).eq(1).html() });
    header.push({ "text": "Shovel No." });
    header.push({ "text": "Material Type" });
    header.push({ "text": "Shovel Operator" });
    header.push({ "text": "Seam" });
    header.push({ "text": "Working Hours (Shovel)" });
    header.push({ "text": "Working Hours (Dumper)" });
    header.push({ "text": "Production" });
    header.push({ "text": "Dump Location" });

    dataForPage[0].data.push(header);

    var dumper_tbody_tr = $('#dumper_table > tbody > tr');
    $(dumper_tbody_tr).each(function (index, tr) {
        var excelData = [];
        excelData.push({ "text": new Date($('#date').val()) });
        excelData.push({ "text": $('#shift').val() });
        excelData.push({ "text": $('#section').val() });
        excelData.push({ "text": $(tr).children('td').eq(0).children('select, input').eq(0).val() });
        excelData.push({ "text": parseInt($(tr).children('td').eq(1).children('select, input').eq(0).val()) });
        var excelRowToInsert;
        var threeFields;
        $(tr).children('td').each(function (index1, td) {
            if (index1 > 2
                && $(td).children('select, input').eq(0).is('input')
                && $(td).children('select, input').eq(0).val() !== ''
            ) {
                excelRowToInsert = [];
                excelRowToInsert = excelData.slice();
                threeFields = $(td).children('select, input').eq(0).attr("name").split('_');
                excelRowToInsert.push({ "text": threeFields[0] });
                excelRowToInsert.push({ "text": threeFields[1] });
                excelRowToInsert.push({ "text": parseInt(threeFields[2]) });
                var dump_location;
                if (threeFields[1] === 'Coal') {
                    excelRowToInsert.push({ "text": coal_shovel_seam[index1 - 3] });
                    excelRowToInsert.push({ "text": parseFloat(coal_shovel_working_hours[index1 - 3]) });
                    dump_location = $('select[name="coal_dump_location[]"]').eq(index).val();
                } else if (threeFields[1] === 'OB') {
                    excelRowToInsert.push({ "text": "OVERBURDEN" });
                    excelRowToInsert.push({ "text": parseFloat(ob_shovel_working_hours[index1 - 4 - coal_shovel_working_hours.length]) });
                    dump_location = $('select[name="ob_dump_location[]"]').eq(index).val();
                }
                excelRowToInsert.push({ "text": parseFloat($(tr).children('td').eq(2).children('select, input').eq(0).val()) });
                excelRowToInsert.push({ "text": parseFloat($(td).children('select, input').eq(0).val()) });
                excelRowToInsert.push({ "text": dump_location });
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
    if (element.is('input')) {
        window.setTimeout(() => $(element).focus(), 0);
    } else if (element.is('select')) {
        window.setTimeout(() => $(element).trigger('chosen:activate'), 0);
    }
    return false;
}

function updateSeam() {
    var options = '';
    if ($(this).val() == 'Coal') {
        options = "<option value='' selected disabled hidden>Select Seam</option> \
        <option value='PUREVA-TOP-COAL|PUREVA-TOP-COAL-EAST'>Purewa Top - East</option> \
        <option value='PUREVA-TOP-COAL|PUREVA-TOP-COAL-WEST'>Purewa Top - West</option> \
        <option value='PUREVA-BOTM-COAL|PUREVA-BOTM-COAL-EAST'>Purewa Bottom - East</option> \
        <option value='PUREVA-BOTM-COAL|PUREVA-BOTM-COAL-WEST'>Purewa Bottom - West</option> \
        <option value='TURRA COAL|TURRA COAL-EAST'>Turra - East</option> \
        <option value='TURRA COAL|TURRA COAL-WEST'>Turra - West</option>";
    } else if ($(this).val() == 'OB') {
        options = "<option value='' selected disabled hidden>Select Seam</option> \
        <option value='OVERBURDEN|OVERBURDEN-Turra Band'>OB - Turra Band</option> \
        <option value='OVERBURDEN|OVERBURDEN-SM Band'>OB - SM Band</option> \
        <option value='OVERBURDEN|OVERBURDEN-B/W PUR TOP & BOT-WEST'>OB - Above Purewa Bottom - West</option> \
        <option value='OVERBURDEN|OVERBURDEN-B/W PUR TOP & BOT-EAST'>OB - Above Purewa Bottom - East</option>";
    }
    $(this).parent().next().children('select').chosen('destroy').end();
    $(this).parent().next().children('select').eq(0).empty().append(options);
    $(this).parent().next().children('select').eq(0).chosen().change(setFocusOnNextElement);
}

$(document).ready(function () {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    $('#date').val(today);

    $('.searchable').chosen().change(setFocusOnNextElement);

    $('#shovel_table select[name="material_type[]"]').on('change', updateSeam);

    $(".add_row1").on('click', function () {
        var table = $(this).parent().parent().find("table").first();
        $(table).find('select').chosen('destroy').end();
        $(table).find("tr").eq(1).clone().appendTo($(table));
        $(table).find('select').chosen().change(setFocusOnNextElement);
        $('#shovel_table select[name="material_type[]"]').on('change', updateSeam);
        $('#dumperwise_entry').fadeOut(100);
    });
    $(".add_row2").on('click', function () {
        var table = $(this).parent().parent().find("table").first();
        $(table).find('select').chosen('destroy').end();
        $(table).find("tr").eq(1).clone().insertAfter($('#dumper_table > tbody > tr').eq($('#dumper_table > tbody > tr').length - 3)).find('input').val('');
        bind_total_event();
        $(table).find('select').chosen().change(setFocusOnNextElement);
        $('td > input').on('keydown', function (e) {
            if (e.which === 13) {
                var element = $(this).parent().next().children('input,select').eq(0);
                if (element.is('input')) {
                    window.setTimeout(() => $(element).focus(), 0);
                } else if (element.is('select')) {
                    window.setTimeout(() => $(element).trigger('chosen:activate'), 0);
                }
                return false;
            }
        });
    });
    $(".delete_row1").on('click', function () {
        var table = $(this).parent().parent().find("table").first();
        if ($(table).find("tr").length > 2) {
            $(table).find("tr").last().remove();
        }
        $('#dumperwise_entry').fadeOut(100);
    });
    $(".delete_row2").on('click', function () {
        var table = $(this).parent().parent().find("table").first();
        if ($(table).find("tr").length > 4) {
            $(table).find("tr").eq(-3).remove();
            $('#dumper_table tr:not(.totalColumn) input').each(function () {
                calc_total(this);
            });
        }
    });

    $("#save_shovels").on('click', create_table);

    $("form#shovels").on('change', function () {
        $('#dumperwise_entry').fadeOut(100);
    });

    $('#re_edit_shovels').on('click', function () {
        $('#dummy').hide();
    });

    $("#save_dumpers").on('click', save_dumpers_get_excel_old);

    $("#save_dumpers_1").on('click', get_sap_compatible_excel);

    $("#pdf_report").on('click', get_pdf_report);
});