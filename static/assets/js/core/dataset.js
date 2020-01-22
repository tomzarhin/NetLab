var idExp = JSON.parse(window.localStorage.getItem("idExp"));
var idTask = JSON.parse(window.localStorage.getItem("idTask"));
var experiments = JSON.parse(window.localStorage.getItem("experiments"));
var idExpArray = experiments.findIndex(x => x.id === parseInt(idExp));
var idTaskArray = experiments[idExpArray].task.findIndex(x => x.task_id === parseInt(idTask))
var datasetToBayes = JSON.parse(JSON.stringify(experiments[idExpArray].task[idTaskArray].dataset));
var dataset = experiments[idExpArray].task[idTaskArray].dataset;
var checkboxes;
var colsArr = experiments[idExpArray].task[idTaskArray].datasetcols.split(",");
var datasetWithPrior = JSON.parse(JSON.stringify(experiments[idExpArray].task[idTaskArray].dataset));
var checkboxes1 = [];
var checkboxes2 = [];

function getDataFromjexcel() { //put dataset from excel in from_data variable for sending to the server
    var form_data = new FormData();
    form_data.append('dataset', JSON.stringify(jexcelSpreadSheet.getData()));
    form_data.append('datasetcols', JSON.stringify(jexcelSpreadSheet.getHeaders()));
    return (form_data);
}

function sendWithPrior() { //Responsible for arranging the Bayesian network variability in the set according to the order we want
    if (checkboxes.length == colsArr.length) {
        for (i = 0; i < checkboxes.length; i++) {
            for (j = 0; j < datasetToBayes.length; j++)
                datasetWithPrior[j][i] = jexcelSpreadSheet.getValueFromCoords((jexcelSpreadSheet.getHeaders().split(",")).indexOf(checkboxes[i]), j);
        }
        jexcelSpreadSheet.setData(datasetWithPrior);
        for (i = 0; i < checkboxes.length; i++)
            jexcelSpreadSheet.setHeader(i, checkboxes[i]);
    } else {
        alerty.toasts("Please choose all variables")
    }
}

function makeCheckboxes(str, cat) {
    var checkbox = document.getElementById(cat);
    var arr = str;
    var returnStr = "";
    for (i = 0; i < arr.length; i++) {
        if (cat == "category1")
            returnStr += '<input type="checkbox" onchange="addToTable1(this)" name="theCheckbox" value="' + arr[i] + '" />' + arr[i] + "<br>";
        if (cat == "category2")
            returnStr += '<input type="checkbox" onchange="addToTable2(this)" name="theCheckbox" value="' + arr[i] + '" />' + arr[i] + "<br>";

    }
    checkbox.innerHTML = returnStr;
}

function addToTable1(checkboxElem) { //Adds variables to the Reasons category
    if (checkboxElem.checked) {
        if (checkboxes2.indexOf(checkboxElem.value) == -1)
            checkboxes1.push(checkboxElem.value);
        else {
            alerty.toasts("Unable to choose 2 values from 2 tables.")
            checkboxElem.checked = false;
        }
    } else {
        var index = checkboxes1.indexOf(checkboxElem.value);
        checkboxes1.splice(index, 1);
    }
}

function addToTable2(checkboxElem) { //Adds variables to the Results category
    if (checkboxElem.checked) {
        if (checkboxes1.indexOf(checkboxElem.value) == -1)
            checkboxes2.push(checkboxElem.value);
        else {
            alerty.toasts("Unable to choose 2 values from 2 tables.")
            checkboxElem.checked = false;
        }

    } else {
        var index = checkboxes2.indexOf(checkboxElem.value);
        checkboxes2.splice(index, 1);
    }
}

function setGroupByMethod() { //Arranges the group by a particular method, average median, or custom value
    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    const calcMedian = arr => { //Calculate the median of an array
        const mid = Math.floor(arr.length / 2),
            nums = [...arr].sort((a, b) => a - b);
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    };
    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    var title = document.getElementById("comboCols").value;
    var method = document.getElementById("norOrMed").value;
    var index = colsArr.indexOf(title);
    var medianOrAverageOrCustom;

    if (method == "median") {
        medianOrAverageOrCustom = calcMedian((arrayColumn(dataset, index)).map(Number));
        CheckIfHighOrLowFromValue(index, medianOrAverageOrCustom);
    } else if (method == "average") {
        medianOrAverageOrCustom = average((arrayColumn(dataset, index)).map(Number));
        CheckIfHighOrLowFromValue(index, medianOrAverageOrCustom);
    } else if (method == "custom value") {
        alerty.prompt('Set your custom value', {
                inputType: 'text',
                inputPlaceholder: 'fill the blank',
                inputValue: '',
                cancelLabel: 'Cancel',
                okLabel: 'Confirm'
            },
            function(value) {
                CheckIfHighOrLowFromValue(index, value);
            },
            function() {})
    } else {
        for (var i = 0; i < datasetToBayes.length; i++)
            datasetToBayes[i][index] = dataset[i][index];
        jexcelSpreadSheet.setColumnData(index, arrayColumn(datasetToBayes, index));
    }
}

function CheckIfHighOrLowFromValue(index, medianOrAverageOrCustom) {
    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    for (var i = 0; i < dataset.length; i++) {
        if (parseInt(dataset[i][index]) <= medianOrAverageOrCustom)
            datasetToBayes[i][index] = "0";
        else
            datasetToBayes[i][index] = "1";
    }
    jexcelSpreadSheet.setColumnData(index, arrayColumn(datasetToBayes, index));
}

function reset() {
    document.getElementById("norOrMed").selectedIndex = 0;
}

function changeFlagValue() {
    var checkBox = document.getElementById("dontKnowTheArrangement");
    if (checkBox.checked == true) {
        checkBox.value = "block";
    } else {
        checkBox.value = "none";
    }
}

$(document).ready(function() {

    // Get the modals
    var bayesianModal = document.getElementById("bayesianModal");
    var clusteringModal = document.getElementById("clusteringModal");

    // Get the button that opens the modal
    var bayesianModalButton = document.getElementById("bayesianModalButton");
    var clusteringModalButton = document.getElementById("clusteringModalButton");

    // Get the <span> element that closes the modal
    var spanClustering = document.getElementsByClassName("close")[0];
    var spanBayes = document.getElementsByClassName("close")[1];

    var colsArr = experiments[idExpArray].task[idTaskArray].datasetcols.split(",");
    var select = document.getElementById("comboCols");
    for (var i = 0; i < colsArr.length; i++) {
        var option = colsArr[i];
        var element = document.createElement("option");
        element.textContent = option;
        element.value = option;
        select.appendChild(element);
    }
    var headArray = experiments[idExpArray].task[idTaskArray].datasetcols.split(",");
    jexcelSpreadSheet = jexcel(document.getElementById('spreadsheet1'), { //get data from array to excel view
        colHeaders: headArray,
        loadingSpin: true,
        data: experiments[idExpArray].task[idTaskArray].dataset,
        csvHeaders: false,
        tableOverflow: true,
        lazyLoading: true,
    });

    window.localStorage.setItem("dataset_clustering", JSON.stringify(experiments[idExpArray].task[idTaskArray].dataset));
    window.localStorage.setItem("dataset_clustering_cols", JSON.stringify(jexcelSpreadSheet.getHeaders()));

    $('#goK2').click(function() { //ask from the server to produce bayesian network model
        if ((document.getElementById("numberOfParents").value) != null)
            window.localStorage.setItem("numberOfParents", JSON.stringify(document.getElementById("numberOfParents").value));
        else
            window.localStorage.setItem("numberOfParents", JSON.stringify("opt"));
        window.localStorage.setItem("numberOfVars", JSON.stringify(colsArr.length));
        checkboxes = checkboxes1.concat(checkboxes2);
        if (checkboxes.length == 0 || checkboxes.length == colsArr.length) {
            document.getElementById("loadingbar").style.visibility = 'visible';
            if (checkboxes.length == colsArr.length)
                sendWithPrior();
            var form_data = new FormData();
            form_data = getDataFromjexcel();
            form_data.append('numberOfParents', document.getElementById("numberOfParents").value);
            form_data.append('dontKnowTheArrangement', document.getElementById("dontKnowTheArrangement").value);
            $.ajax({
                    type: 'POST',
                    url: '/goK2',
                    data: form_data,
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function(data) {
                        console.log('Success!');
                    },
                })
                .done(function(data) {
                    if (data.error) {
                        confirm(data.error);
                    }
                    window.localStorage.setItem("dataset_k2", JSON.stringify(data.dataset_k2));
                    window.localStorage.setItem("categories", JSON.stringify(data.categories));
                    window.localStorage.setItem("cpt_list", JSON.stringify(data.cpt_list));
                    window.localStorage.setItem("element_categories", JSON.stringify(data.element_categories))
                    location.href = "../pages/bayesGraph.html";
                });
        } else
            alerty.toasts("Please choose clasification for entire variables");
    });
    $('#goKmeans').click(function() { //ask from the server to produce clustering model
        document.getElementById("loadingbar").style.visibility = 'visible';
        var form_data = new FormData();
        form_data = getDataFromjexcel();
        form_data.append('clusteringNum', document.getElementById("clusteringNum").value);
        $.ajax({
                type: 'POST',
                url: '/goKmeans',
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                success: function(data) {
                    console.log('Success!');
                },
            })
            .done(function(data) {
                if (data.error) {
                    confirm(data.error);
                }
                window.localStorage.setItem("dataset_clustering", JSON.stringify(data.inputArray));
                window.localStorage.setItem("kmeansLabels", JSON.stringify(data.kmeansLabels));
                window.localStorage.setItem("dataset_clustering_cols", JSON.stringify(jexcelSpreadSheet.getHeaders()));
                window.localStorage.setItem("elbowValue", JSON.stringify(data.elbowValue));
                window.localStorage.setItem("silhouetteValue", JSON.stringify(data.silhouetteValue));

                location.href = "../pages/clusterGraph.html";

            });
    });
    // When the user clicks the button, open the modal
    bayesianModalButton.onclick = function() {
        bayesianModal.style.display = "block";
        colsArr = jexcelSpreadSheet.getHeaders().split(",");
        makeCheckboxes(colsArr, "category1");
        makeCheckboxes(colsArr, "category2");
    }
    clusteringModalButton.onclick = function() {
        clusteringModal.style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
    spanClustering.onclick = function() {
        clusteringModal.style.display = "none";
    }
    spanBayes.onclick = function() {
        bayesianModal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == bayesianModal) {
            bayesianModal.style.display = "none";
        }
        if (event.target == clusteringModal) {
            clusteringModal.style.display = "none";
        }
    }
});