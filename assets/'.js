function CalculateFirstPipeDepth(th) {
    let TableHeightEle = document.getElementById('TableHeight');
    let PipeLengthEle = document.getElementById('DrillingRodLength');
    if (TableHeightEle.value == "") {
        TableHeightEle.focus()
    }
    else if (PipeLengthEle.value == "") {
        PipeLengthEle.focus();
    }
    else if (th.value == "") {
        PipeLengthEle.focus();
    }
    let FirstDepth = (parseFloat(PipeLengthEle.value) + parseFloat(th.value)) - parseFloat(TableHeightEle.value);
    let table = document.getElementById('Formationlog');
    table.rows[1].cells[3].querySelector('input').value = FirstDepth.toFixed(2);
}
function CalculateRate(th) {
    let time = th.value;
    let depth = th.parentNode.parentNode.querySelector('.welldepth').value;
    let rate = (depth / time).toFixed(2);
    th.parentNode.parentNode.querySelector('.rate').value = rate;
}

function Formationloglogaddrow(name) {
    let table = document.getElementById(name);
    let rowcount = table.rows.length;
    let columncount = table.rows[1].cells.length;
    let row = table.insertRow(rowcount);
    let count = parseInt(table.rows[rowcount - 1].cells[2].innerHTML);
    let TopRowDateTime = table.rows[rowcount - 1].cells[1].querySelector('input').value;

    for (let i = 0; i < columncount; i++) {
        if (i == 0) {
            let column = row.insertCell(i);
            column.classList.add('d-none');
        }
        else if (i == 1) {
            let column = row.insertCell(i);
            column.innerHTML = table.rows[1].cells[i].innerHTML;
            column.querySelector('input').value = TopRowDateTime;
        }
        else if (i == columncount - 1) {
            let column = row.insertCell(i);
            column.classList.add("text-center")
            column.innerHTML = table.rows[1].cells[i].innerHTML;
        }
        else if (i == 2) {
            let column = row.insertCell(i);
            column.classList.add("text-center")

            column.innerHTML = count + 1;
        }
        else {
            let column = row.insertCell(i);
            column.innerHTML = table.rows[1].cells[i].innerHTML;
        }

    }
    table.rows[rowcount].cells[4].querySelector('input').focus();
    let PipeLength = document.getElementById('DrillingRodLength').value;
    if (PipeLength != "") {
        table.rows[rowcount].cells[3].querySelector('input').value = (parseFloat(table.rows[rowcount - 1].cells[3].querySelector('input').value) + parseFloat(PipeLength)).toFixed(2);
    }  
}

function Formationloglogdeleterow(i, name) {
    let index = i.parentNode.parentNode.rowIndex;
    if (index != 1) {
        let table = document.getElementById(name);
        table.deleteRow(index)
        let rowslen = table.rows.length;
        for (i = 2; i<rowslen; i++) {
            table.rows[i].cells[2].innerText = i;
        }
    }
    else {
        toastr.info("First Row Can't be deleted")
    }


}

function DeepWellLogForm() {

    let ExecuteBool = true;
    let type = $('#DeepWellLog_button').text();
    let BoreholeNumber = $('#DeepwellBoreholeNumber').val();
    let boreholeId = $('#boreholeId').text();
    let DateStart = $('#DateStart').val();
    let DateEnd = $('#DateEnd').val();
    let Driller_units = $('#Driller_units').val();
    let TableHeight = $('#TableHeight').val();
    let DrillingRodLength = $('#DrillingRodLength').val();
    let DrillBitLength = $('#DrillBitLength').val();
    let DeepwellFile = $('#DeepwellFile').val();
    let userid = document.getElementById('userid').innerText;
    let userName = document.getElementById('username').innerText;


    if (BoreholeNumber == "") {
        $("#DeepwellBoreholeNumber").focus();
        ExecuteBool = false;
    }
    if (boreholeId == "") {
        ExecuteBool = false;
        toastr.info("Please Fill Identification and Location Form")
        Icon_Identification();
    }
    if (DateStart == "") {
        $("#DateStart").focus();
        $("#DateStartValue").removeClass("d-none");
        $("#DateStartValue").addClass("d-block");
        ExecuteBool = false;
    }
    else {
        $("#DateStartValue").addClass("d-none");
    }
    if (DateEnd == "") {
        $("#DateEnd").focus();
        $("#DateEndValue").removeClass("d-none");
        $("#DateEndValue").addClass("d-block");
        ExecuteBool = false;
    }
    else {
        $("#DateEndValue").addClass("d-none");
    }
    if (Driller_units == "") {
        $("#Driller_units").focus();
        $("#Driller_unitsValue").removeClass("d-none");
        $("#Driller_unitsValue").addClass("d-block");
        ExecuteBool = false;
    }
    else {
        $("#Driller_unitsValue").addClass("d-none");
    }
    if (TableHeight == "") {
        $("#TableHeight").focus();
        $("#TableHeightValue").removeClass("d-none");
        $("#TableHeightValue").addClass("d-block");
        ExecuteBool = false;
    }
    else {
        $("#TableHeightValue").addClass("d-none");
    }
    if (DrillingRodLength == "") {
        $("#DrillingRodLength").focus();
        $("#DrillingRodLengthValue").removeClass("d-none");
        $("#DrillingRodLengthValue").addClass("d-block");
        ExecuteBool = false;
    }
    else {
        $("#DrillingRodLengthValue").addClass("d-none");
    }
    if (DrillBitLength == "") {
        $("#DrillBitLength").focus();
        $("#DrillBitLengthValue").removeClass("d-none");
        $("#DrillBitLengthValue").addClass("d-block");
        ExecuteBool = false;
    }
    else {
        $("#DrillBitLengthValue").addClass("d-none");
    }
    if (DeepwellFile == "") {
        $("#DeepwellFile").focus();
        $("#DeepwellFileValue").removeClass("d-none");
        $("#DeepwellFileValue").addClass("d-block");
        ExecuteBool = false;
    }
    else {
        $("#DeepwellFileValue").addClass("d-none");
    }
    let alldata = [];
    let table = document.getElementById('Formationlog');
    let rowcount = table.rows.length;
    let columncount = table.rows[1].cells.length;
    for (let i = 1; i < rowcount; i++) {
        let rowlist = [];
        for (let j = 0; j < columncount - 1; j++) {

            if (j == 0 || j == 2) {
                let columnvalue = table.rows[i].cells[j].textContent;
                rowlist.push(columnvalue)

            }
            else if (j == (columncount - 2)) {
                let columnvalue = table.rows[i].cells[j].querySelector('input').value;
                rowlist.push(columnvalue)
            }
            else {
                let columnvalue = table.rows[i].cells[j].querySelector('input').value;
                rowlist.push(columnvalue)
                if (columnvalue == "") {
                    let validatediv = table.rows[i].cells[j].querySelector('div');
                    if (validatediv) {
                        validatediv.classList.remove("d-none");
                        validatediv.classList.add("d-block");
                        ExecuteBool = false;
                    }
                }
                else {
                    let validatediv = table.rows[i].cells[j].querySelector('div');
                    if (validatediv) {
                        validatediv.classList.add("d-none");
                    }
                }
            }



        }
        alldata.push(rowlist);

    }
    let FormationLogTable = alldata.map(([drillerDeepWellLogId,DateAndTime,DrillPipeNo, Depth,Minutes,Rate,Log,Activity,Comments]) => {
        return { drillerDeepWellLogId, DateAndTime, DrillPipeNo, Depth, Minutes, Rate, Log, Activity, Comments }
    });


    if (ExecuteBool) {
        var fileUpload = $("#DeepwellFile").get(0);
        var file = fileUpload.files;
        var fileData = new FormData();
        fileData.append(file[0].name, file[0]);
        fileData.append('op', 'Save_Fileupload');
        fileData.append('type', type); 

        var s = function (msg) {
            console.log(msg)
            if (msg != "") {
                var data = {
                    'op': 'save_DeepWellLogForm',
                    "type": type,
                    "boreholeId": boreholeId,
                    "BoreholeNumber": BoreholeNumber,
                    "DateStart": DateStart,
                    "DateEnd": DateEnd,
                    "Driller_units": Driller_units,
                    "TableHeight": TableHeight,
                    "DrillingRodLength": DrillingRodLength,
                    "DrillBitLength": DrillBitLength,
                    "DeepwellReportPath": msg,
                    "FormationLogTable": FormationLogTable,
                    "userid": userid,
                    "userName":userName
                };
               
                var success = function (msg) {
                    console.log(msg)
                    if (msg == "Saved") {
                        toastr.success("Details Saved Successfully")
                        GetDeepwellLogFormData($('#boreholeId').text());
                        document.getElementById('SpinnerLoadingDiv').classList.add('visually-hidden');

                    }
                    else if (msg == "Updated") {
                        toastr.success("Details Updated Successfully");
                        GetDeepwellLogFormData($('#boreholeId').text());
                        document.getElementById('SpinnerLoadingDiv').classList.add('visually-hidden');

                    }
                    else if (msg == "SavedAndUpdated") {
                        toastr.success("Details Updated Successfully");
                        GetDeepwellLogFormData($('#boreholeId').text());
                        document.getElementById('SpinnerLoadingDiv').classList.add('visually-hidden');

                    }
                    else {
                        document.getElementById('SpinnerLoadingDiv').classList.add('visually-hidden');
                    }
                    
                }
                
                $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
                document.getElementById('SpinnerLoadingDiv').classList.remove('visually-hidden');
                HandlerPostmethodUsingJson_DeepWell(data, success);
            }
            

        }
        $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
        document.getElementById('SpinnerLoadingDiv').classList.remove('visually-hidden');
        HandlerPostmethod_filesave(fileData, s);
    }
}


function GetDeepwellLogFormData(BID) {
    var data = { 'op': 'save_DeepWellLogForm', 'type': "AllData", 'boreholeId': BID };
    var s = function (msg) {
      
        if (Array.isArray(msg)) {
            if (msg.length > 0) {
                FillDeepwellLogForm(msg);
            }


        }
        else if (msg == "NoData") {
            document.getElementById('DeepWellLog_button').innerText = "Save";
            $("#FormationlogRefresh").load(window.location.href + " #Formationlog");
            BhLogBoolArray.push(false);
            return;
        }

    };
    $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
    HandlerPostmethodUsingJson_Hydro(data, s);


}



function FillDeepwellLogForm(msg) {
    if (msg.length > 0) {
 
        document.getElementById('DateStart').value = msg[0].DateStart_str;
        document.getElementById('DateEnd').value = msg[0].DateEnd_str;
        document.getElementById('Driller_units').value = msg[0].Driller_units;
        document.getElementById('TableHeight').value = msg[0].TableHeight;
        document.getElementById('DrillingRodLength').value = msg[0].DrillingRodLength;
        document.getElementById('DrillBitLength').value = msg[0].DrillBitLength;
        document.getElementById('DeepWellLog_button').innerText = "Update";

        // removing rows if more than a default row 
        var table1 = document.getElementById("Formationlog");
        let tb1_Rowcount = table1.rows.length;
        if (tb1_Rowcount > 2) {
            for (del = 2; del < tb1_Rowcount; del++) { table1.deleteRow(2) }
        }
        //formation log table data binding

        for (ind = 0; ind < msg[0].FormationLogTable.length; ind++) {
            if (ind == 0) {
                let cell1 = table1.rows[1].cells[0];
                cell1.classList.add('d-none');
                cell1.innerText = msg[0].FormationLogTable[ind].drillerDeepWellLogId;
                let cell2 = table1.rows[1].cells[1];
                cell2.querySelector('input').value = msg[0].FormationLogTable[ind].DateAndTime_str;
                let cell3 = table1.rows[1].cells[2];
                cell3.innerText= msg[0].FormationLogTable[ind].DrillPipeNo;
                let cell4 = table1.rows[1].cells[3];
                cell4.querySelector('input').value = msg[0].FormationLogTable[ind].Depth;
                msg[0].FormationLogTable[ind].Depth
                let cell5 = table1.rows[1].cells[4];
                cell5.querySelector('input').value = msg[0].FormationLogTable[ind].Minutes;
                let cell6 = table1.rows[1].cells[5];
                cell6.querySelector('input').value = msg[0].FormationLogTable[ind].Rate;
                let cell7 = table1.rows[1].cells[6];
                cell7.querySelector('input').value = msg[0].FormationLogTable[ind].Log;
                let cell8 = table1.rows[1].cells[7];
                cell8.querySelector('input').value = msg[0].FormationLogTable[ind].Activity;
                let cell9 = table1.rows[1].cells[8];
                cell9.querySelector('input').value = msg[0].FormationLogTable[ind].Comments;
                let cell10 = table1.rows[1].cells[9].classList.add("d-none");//hiding delete button
            }
            else {
                let row = table1.insertRow(ind + 1);
                let cell1 = row.insertCell(0);
                cell1.classList.add('d-none');
                cell1.innerText = msg[0].FormationLogTable[ind].drillerDeepWellLogId;
                let cell2 = row.insertCell(1);
                cell2.innerHTML = table1.rows[1].cells[1].innerHTML;
                cell2.querySelector('input').value = msg[0].FormationLogTable[ind].DateAndTime_str ;
                let cell3 = row.insertCell(2);
                cell3.innerText = msg[0].FormationLogTable[ind].DrillPipeNo;
                let cell4 = row.insertCell(3);
                cell4.innerHTML = table1.rows[1].cells[3].innerHTML;
                cell4.querySelector('input').value = msg[0].FormationLogTable[ind].Depth;
                let cell5 = row.insertCell(4);
                cell5.innerHTML = table1.rows[1].cells[4].innerHTML;
                cell5.querySelector('input').value = msg[0].FormationLogTable[ind].Minutes;
                let cell6 = row.insertCell(5);
                cell6.innerHTML = table1.rows[1].cells[5].innerHTML;
                cell6.querySelector('input').value = msg[0].FormationLogTable[ind].Rate;
                let cell7 = row.insertCell(6);
                cell7.innerHTML = table1.rows[1].cells[6].innerHTML;
                cell7.querySelector('input').value = msg[0].FormationLogTable[ind].Log;
                let cell8 = row.insertCell(7);
                cell8.innerHTML = table1.rows[1].cells[7].innerHTML;
                cell8.querySelector('input').value = msg[0].FormationLogTable[ind].Activity;
                let cell9 = row.insertCell(8);
                cell9.innerHTML = table1.rows[1].cells[8].innerHTML;
                cell9.querySelector('input').value = msg[0].FormationLogTable[ind].Comments;
                let cell10 = row.insertCell(9);

            }

        }

        BhLogBoolArray.push(true);
    }

    DepthTimeFun()
}


function DepthTimeFun() {
    var DepthTimeList = [];
    let table = document.getElementById('Formationlog');
    let rowcount = table.rows.length;
    let columncount = table.rows[1].cells.length;
    for (let i = 1; i < rowcount; i++) {
        let rowlist = {Depth:"",Minutes:""};

        for (let j = 0; j < columncount - 1; j++) {

            if (j == 3) {
                let columnvalue = table.rows[i].cells[j].querySelector('input').value;
                rowlist.Depth = columnvalue

            }
            else if (j == 4) {
                let columnvalue = table.rows[i].cells[j].querySelector('input').value;
                rowlist.Minutes = columnvalue

            }
           
        }

        DepthTimeList.push(rowlist);

    }
    chart.data = [];
    chart.data = DepthTimeList;
    document.getElementById('DepthTimeGraph').classList.remove('d-none');
    document.getElementById('DepthTimeGraph').classList.add('d-blcok');
}


function HandlerPostmethodUsingJson_DeepWell(d,s) {
    d = JSON.stringify(d);
    d = encodeURIComponent(d);
    $.ajax({
        type: "GET",
        url: "BHHandler.axd?json=",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: d,
        async: true,
        cache: true,
        success: s,
        Error: function (e) { console.log(e) }
    });
}


