<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Bootstrap CSS -->
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <link href="css/select2.min.css" rel="stylesheet">
        <link rel="icon" type="image/png" href="images/favicon.png">
        <title>DCH Data Entry</title>
    </head>
    <body>
        <div id="entry">
                <h1 class="fs-title">Shift Wise Entry</h1>
                <h3 class="fs-subtitle"></h3>
                <label>----------------Select Shift and Section:----------------</label>
                <div>
                    <br>
                    <table id="despatch_0">
                        <tr>
                            <th>Date.</th>
                            <th>Shift</th>
                            <th>Section</th>
                        </tr>
                        <tr>
                            <td>
                                <input id="date" required="required" type="date" value="<?php echo date('Y-m-d');?>" placeholder="" data-rule-required="true" data-msg-required="Please enter a valid date">
                            </td>
                            <td>
                                <select id="shift" style="width: 120px !important;" class="parties_dropdown" >
                                    <option value='1'> Shift 1</option>
                                    <option value='2'> Shift 2</option>
                                    <option value='3'> Shift 3</option>
                                </select>
                            </td>
                            <td>
                                <select id="section" style="width: 120px !important;" class="parties_dropdown" >
                                    <option value='east'> East</option>
                                    <option value='west'> West</option>
                                </select>
                            </td>                                    
                        </tr>
                    </table>
                    <br>
                    <br>
                </div>
                <label>----------------Select operating shovels:----------------</label>
                <div>
                    <br>
                    <div style="float:left; margin:0 15px 0 0;">
                        <input type="button" value="Add Row" class="add_row" />
                    </div>
                    <div style="float:left; margin:0 15px 0 0;">
                        <input type="button" value="Delete Row" class="delete_row" />
                    </div>
                    <br>
                    <br>
                    <table id="shovel_table">
                        <thead>
                        <tr>
                            <th>Shovel No.</th>
                            <th>Shovel Operator</th>
                            <th>Material</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <select style="width: 120px !important;" name="shovel_no[]" class="parties_dropdown" >
                                    <option value='1'>Shovel 1</option>
                                    <option value='2'>Shovel 2</option>
                                    <option value='3'>Shovel 3</option>
                                    <option value='4'>Shovel 4</option>
                                </select>
                            </td>
                            <td>
                                <select style="width: 120px !important;" name="shovel_operator[]" class="parties_dropdown" >
                                    <option value='1'>Operator 1</option>
                                    <option value='2'>Operator 2</option>
                                    <option value='3'>Operator 3</option>
                                    <option value='4'>Operator 4</option>
                                </select>
                            </td>
                            <td>
                                <select style="width: 120px !important;" name="material_type[]" class="parties_dropdown" >
                                    <option value='coal'>COAL</option>
                                    <option value='ob'> OB</option>
                                </select>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <br>
                    <div style="float:left; margin:0 15px 0 0;">
                        <input type="button" value="Save" id="save_shovels" />
                    </div>
                    <br>
                    <br>
                </div>
                <label>----------------Dumper wise data:----------------</label>
                <div>
                    <br>
                    <div style="float:left; margin:0 15px 0 0;">
                        <input type="button" value="Add Row" class="add_row" />
                    </div>
                    <div style="float:left; margin:0 15px 0 0;">
                        <input type="button" value="Delete Row" class="delete_row" />
                    </div>
                    <br>
                    <br>
                    <form id='pageData'>
                    <table id="dumper_table">
                        <thead>
                        <tr>
                            <th>Dumper No.</th>
                            <th>Dumper Operator</th>
                            <th id='coal_header'>Coal Shovel</th>
                            <th id='ob_header'>OB Shovel</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <select style="width: 120px !important;" name="dumper_no[]" class="parties_dropdown" >
                                    <option value='26315119'>26315119</option>
                                    <option value='26020966'>26020966</option>
                                </select>
                            </td>
                            <td>
                                <select style="width: 200px !important;" name="dumper_operator[]" class="parties_dropdown" >
                                    <option value='26315119'>ACHHEWAR KUMAR</option>
                                    <option value='26020966'>AMAL  BISWAS</option>
                                </select>
                            </td>
                            <td>
                                <input name="coal_shovel[]" required="required" maxlength="128" type="number" value="" min="0" placeholder="" data-rule-required="true" data-msg-required="Please enter a valid number">
                            </td>
                            <td>
                                <input name="ob_shovel[]" required="required" maxlength="128" type="number" value="" min="0" placeholder="" data-rule-required="true" data-msg-required="Please enter a valid number">
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <br>
                    <div style="float:left; margin:0 15px 0 0;">
                        <input type="button" value="Save" id="save_dumpers" />
                    </div>
                    </form>
                    <br>
                    <br>
                </div>
        </div>

        <script src="js/jquery-3.6.0.js"></script>
        <script src="js/jquery-ui.js"></script>
        <script src="js/jquery.validate.min.js"></script>
        <script src="js/select2.min.js"></script>
        <script type="module" src="js/entry.js"></script>
    </body>
</html>