$(document).on("ready",()=>{
class Data{
    constructor(){
        this.currentPersonnelId;
        this.currentLocationId;
        this.currentDepartmentId;
        this.section = "personnel";
    }
    setCurrentPersonnelId(id){
        if(typeof(Number(id)) == "number"){
            this.currentPersonnelId = Number(id);
        }
    }
    setCurrentDepartmentId(id){
        if(typeof(Number(id)) == "number"){
            this.currentDepartmentId = Number(id);
        }
    }
    setCurrentLocationId(id){
        if(typeof(Number(id)) == "number"){
            this.currentLocationId = Number(id);
        }
    }
    getCurrentPersonnelId() {return this.currentPersonnelId}
    getCurrentDepartmentId() {return this.currentDepartmentId}
    getCurrentLocationId() {return this.currentLocationId}
    setSection(section){
        switch(section){
            case "personnel":
                this.section = "personnel";
                break;
            case "department":
                this.section = "department";
                break;
            case "location":
                this.section = "location";
                break;
            default:
                console.log("Error: invalid section");
        }
    }
    getSection() {return this.section};
}

function updateAllTables(){
    getAllFiltered();
    getDeptsFiltered();
    getLocationInfo();
}

// Modal initialisation functions

function updatePersonnelModal(id){
    $.ajax({
        url: "libs/php/getPersonnelInfoById.php",
        type: 'POST',
        data: {
            id: id,
        },
        dataType: 'JSON',
        success: function(result){
            let employee = result.data[0];
            let name = employee.firstName + ' ' + employee.lastName;
            $("#employee-name").html(name);
            $("#employee-dept").html(employee.dept);
            $("#employee-loc").html(employee.location);
            $("#employee-email").html(employee.email);
            $("#employee-modal").modal('show');
            $.ajax({
                url: "libs/php/getAllDepartments.php",
                type: 'GET',
                dataType: 'JSON',
                success: function(result){
                    let departments = result.data;
                    createOptions("employee-form-dept", departments);
                    updatePersonnelPlaceholders(employee);
                    $("#employee-modal").modal('show');
                    $('body').addClass('modal-open');
                },
                error: function(err) {
                    console.log(err);
                }
            });
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function updateDepartmentModal(id){
    $.ajax({
        url: "libs/php/getDepartmentInfoById.php",
        type: 'POST',
        data: {
            id: id,
        },
        dataType: 'JSON',
        success: function(result){
            let dept = result.data[0];
            $("#department-name").html(dept.name);
            $("#department-loc").html(dept.location);
            $("#department-emp").html(dept.personnel);
            $("#department-modal").modal('show');
           $.ajax({
                url: "libs/php/getAllLocations.php",
                type: 'GET',
                dataType: 'JSON',
                success: function(result){
                    let locations = result.data;
                    createOptions("department-form-loc", locations);
                    updateDepartmentPlaceholders(dept);
                    $("#department-modal").modal('show');
                    $('body').addClass('modal-open');
                },
                error: function(err) {
                    console.log(err);
                }
            });

        },
        error: function(err) {
            console.log(err);
        }
    });
}
function updateLocationModal(id){
    $.ajax({
        url: "libs/php/getLocationInfoById.php",
        type: 'POST',
        data: {
            id: id,
        },
        dataType: 'JSON',
        success: function(result){
            if(result.data.length > 0){
                let loc = result.data;
                $("#location-name").html(loc[0].name);
                let table = $("#location-modal-depts");
                table.find("tr").remove();
                let total = 0;
                loc.forEach(dept=>{
                    total += Number(dept.personnel);
                    table.append('<tr><td>'
                    + dept.deptName
                    + '</td><td>'
                    + dept.personnel
                    + '</td></tr>');
                })
                table.append('<tr class="table-active"><th>Total</th><td>'
                + total
                + '</th></tr>');
                $("#location-modal").modal('show');
                $('body').addClass('modal-open');
                updateLocationPlaceholders(loc[0].name,loc[0].id);
            } else {
                $.ajax({
                    url: "libs/php/getLocationById.php",
                    type: 'POST',
                    data: {
                        id: id,
                    },
                    dataType: 'JSON',
                    success: function(result){
                        let loc = result.data[0];
                        $("#location-name").html(loc.name);
                        let table = $("#location-modal-depts");
                        table.find("tr").remove();
                        table.append('<tr><td>None</td><td>None</td></tr>');
                        table.append('<tr class="table-active"><th>Total</th><td>0</th></tr>');
                        $("#location-modal").modal('show');
                        $('body').addClass('modal-open');
                        updateLocationPlaceholders(loc.name,loc.id);
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
        }},
        error: function(err) {
            console.log(err);
        }
    });
}

function validateEmail(inputText){
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(inputText.match(mailformat)){
        return true;
    } else {
        return false;
        }
}

// GET main tables from database

function getAll(){
    $.ajax({
        url: "libs/php/getAll.php",
        type: 'GET',
        dataType: 'JSON',
        success: function(result){
            renderPersonnel(result.data);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function getDepartmentInfo(){
    $.ajax({
        url: "libs/php/getDepartmentInfo.php",
        type: 'GET',
        dataType: 'JSON',
        success: function(result){
            renderDepartments(result.data);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function getLocationInfo(){
    $.ajax({
        url: "libs/php/getLocationInfo.php",
        type: 'GET',
        dataType: 'JSON',
        success: function(result){
            renderLocations(result.data);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

// DELETE entries from database

function deletePersonnelById(id){
    $.ajax({
        url: "libs/php/deletePersonnelById.php",
        type: 'POST',
        data: {
            id: id,
        },
        dataType: 'JSON',
        success: function(result){
            getAllFiltered();
        },
        error: function(err) {
            console.log(err);
        }
    });
};
function deleteDepartmentById(id){
    $.ajax({
        url: "libs/php/getDepartmentInfoById.php",
        type: 'POST',
        data: {
            id: id,
        },
        dataType: 'JSON',
        success: function(result){
            if (result.data[0].personnel != 0){
                alert("Department cannot be deleted as it contains " + result.data[0].personnel + " employees.");
            } else if(confirm("Are you sure you want to remove " + result.data[0].name + " from Departments?")){
                    $.ajax({
                        url: "libs/php/deleteDepartmentByID.php",
                        type: 'POST',
                        data: {
                            id: id,
                        },
                        dataType: 'JSON',
                        success: function(result){
                            getAllFiltered();
                            getDeptsFiltered();
                            getLocationInfo();
                            $("#department-modal").modal('hide');
                            addCheckbox("options-departments");
                            addLocationsCheckbox("options-locations");
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    });
                };
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function deleteLocationById(id){
    $.ajax({
        url: "libs/php/getLocationDepartmentsById.php",
        type: 'POST',
        data: {
            id: id,
        },
        dataType: 'JSON',
        success: function(result){
            if (Number(result.data[0].departments) != 0){
                alert("Location cannot be deleted as it contains " + result.data[0].departments + " departments.");
            } else if (confirm("Are you sure you want to remove " + result.data[0].name +" from Locations?")){
                $.ajax({
                    url: "libs/php/deleteLocationById.php",
                    type: 'POST',
                    data: {
                        id: id,
                    },
                    dataType: 'JSON',
                    success: function(result){
                        getAllFiltered();
                        getLocationInfo();
                        getDeptsFiltered();
                        $("#location-modal").modal('hide');
                        addCheckbox("options-departments");
                        addLocationsCheckbox("options-locations");
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}

// CREATE new entries in database

function addLocation(name,departments){
    $.ajax({
        url: "libs/php/getLocationsWhere.php",
        type: 'POST',
        data: {
            attr: "name",
            value: name
        },
        dataType: 'JSON',
        success: function(result){
            let ready = true;
            if (result.data.length > 0){
                $("#new-location-required-name").html("Location name already in use");
                ready = false;
            }
            if(ready){
                $.ajax({
                    url: "libs/php/insertLocation.php",
                    type: 'POST',
                    data: {
                        name: name,
                    },
                    dataType: 'JSON',
                    success: function(result){
                        let id = result.data[0].id;
                        departments.forEach(dept=>{
                            updateDepartmentById(dept,null,id)
                        });
                        let name = result.data[0].name;
                        data.setCurrentLocationId(id);
                        getAllFiltered();
                        getLocationInfo();
                        getDeptsFiltered();
                        setTimeout(()=>{
                            $("#new-location-modal").modal('hide');
                            updateLocationModal(id);
                            $(".updated").css("display","none");
                            $(".info").css("display","block");
                            $(".form").css("display","none");
                            addCheckbox("options-departments");
                            addLocationsCheckbox("options-locations");
                        },500);
                        
                        
                       
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
        
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function addDepartment(name,locationId){
    $.ajax({
        url: "libs/php/getDepartmentsWhere.php",
        type: 'POST',
        data: {
            attr: "name",
            value: name,
        },
        dataType: 'JSON',
        success: function(result){
            let ready = true;
            if (result.data.length > 0){
                $("#new-department-required-name").html("Department name already in use");
                ready = false;
            }
            if (ready){
                $.ajax({
                    url: "libs/php/insertDepartment.php",
                    type: 'POST',
                    data: {
                        name: name,
                        locationId: locationId,
                    },
                    dataType: 'JSON',
                    success: function(result){
                        let id = result.data[0].id;
                        data.setCurrentDepartmentId(id);
                        getDeptsFiltered();
                        $("#new-department-modal").modal('hide');
                        updateDepartmentModal(id);
                        updateDepartmentPlaceholders(id);
                        $(".updated").css("display","none");
                        $(".info").css("display","block");
                        $(".form").css("display","none");
                        addCheckbox("options-departments");
                        addLocationsCheckbox("options-locations");
                       
                       
                        
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            }
            
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function addPersonnel(first,last,email,department){
    let ready = true;
    $.ajax({
        url: "libs/php/getPersonnelWhere.php",
        type: 'POST',
        data: {
            attr: "email",
            value: email,
        },
        dataType: 'JSON',
        success: function(result){
            if (result.data.length > 0){
                $("#new-employee-required-email").html("Email address already in database");
                ready = false;
            }
            if(ready){
                $.ajax({
                    url: "libs/php/insertPersonnel.php",
                    type: 'POST',
                    data: {
                        firstName: first,
                        lastName:last,
                        email: email,
                        departmentId: department,
                    },
                    dataType: 'JSON',
                    success: function(result){
                        getAllFiltered();
                        let id = Number(result.data[0].id);
                        $("#new-employee-modal").modal('hide');
                        updatePersonnelModal(id);
                        $(".updated").css("display","none");
                        $(".info").css("display","block");
                        $(".form").css("display","none"); 
                
                        
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
        };
    },
        error: function(err) {
            console.log(err);
        }
    });
    }

// UPDATE entries in database

function updateLocationById(id, name, departmentIds){
    departmentIds.forEach(deptId=>{
        updateDepartmentById(deptId,null,id);
    })
    $.ajax({
        url: "libs/php/updateLocationById.php",
        type: 'POST',
        data: {
            id: id,
            name: name,
        },
        dataType: 'JSON',
        success: function(result){
            updateLocationModal(id);
            updateAllTables();
            setTimeout(()=>{
                $('.form').css("display","none");
                $(".updated").css("display","block");
                $(".info").css("display","block");
                addCheckbox("options-departments");
                addLocationsCheckbox("options-locations");
            }, 50)
        },
        error: function(err) {
            console.log(err);
        }
    });

}
function updateDepartmentById(id, name=null, locationId){
    $.ajax({
        url: "libs/php/updateDepartmentById.php",
        type: 'POST',
        data: {
            name: name,
            id: id,
            locationId: locationId,
        },
        dataType: 'JSON',
        success: function(result){
            if(name){
                updateDepartmentModal(id);
                updateAllTables();
                setTimeout(()=>{
                    $('.form').css("display","none");
                    $(".updated").css("display","block");
                    $(".info").css("display","block");
                    addCheckbox("options-departments");
                    addLocationsCheckbox("options-locations");
                }, 500)
            }
            
        },
        error: function(err) {
            console.log(err);
        }
    });

}
function updatePersonnelById(id,first,last,email,department){
    $.ajax({
        url: "libs/php/updatePersonnelById.php",
        type: 'POST',
        data: {
            firstName: first,
            lastName: last,
            email: email,
            id: id,
            departmentId: department,
        },
        dataType: 'JSON',
        success: function(result){
            getAllFiltered();
            updatePersonnelModal(id);
            setTimeout(()=>{
                $('.form').css("display","none");
                $(".updated").css("display","block");
                $(".info").css("display","block");
            }, 500)
        },
        error: function(err) {
            console.log(err);
        }
    });
}


function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

function employeeSearch(){
    let term = $("#search-bar").val();
    let employees = data.getEmployees();
    let employeeMatches = [];
    employees.forEach(emp=>{
        let first = emp.getFirst();
        let last = emp.getLast();
        let name = first + " " + last;
        let dept = emp.getDept();
        let location = emp.getLocation();
        if (name.match(term) || name.includes(term) ||name.match(term.toLowerCase()) || name.includes(term.toLowerCase()) || dept.includes(term.toLowerCase())||name.match(toTitleCase(term)) || name.includes(toTitleCase(term)) || dept.includes(toTitleCase(term))||location.match(term) || location.includes(term) ||location.match(term.toLowerCase()) || location.includes(term.toLowerCase())){
            employeeMatches.push(emp);
        }
    renderEmployees(employeeMatches);
    })
}
function departmentSearch(){
    let term = $("#search-bar").val();
    let departments = data.getDepartments();
    let departmentMatches = [];
    departments.forEach(dept=>{
        let name = dept.getName();
        let location = dept.getLocationName();
        if (name.match(term) || name.includes(term) ||name.match(term.toLowerCase()) || name.includes(term.toLowerCase()) || location.match(term) || location.includes(term) || location.match(term.toLowerCase()) || location.includes(term.toLowerCase())){
            departmentMatches.push(dept);
        }
    renderDepartments(departmentMatches,data);
    })
}
function locationSearch(){
    let term = $("#search-bar").val();
    let locations = data.getLocations();
    let locationMatches = [];
    locations.forEach(loc=>{
        let name = loc.getName();
        if (name.match(term) || name.includes(term) ||name.match(term.toLowerCase()) || name.includes(term.toLowerCase())){
            locationMatches.push(loc);
        }
    renderLocations(locationMatches,data);
    })
}
function renderPersonnel(personnel){
    let table = $(".employee-table");
    table.find("tbody tr").remove();
    personnel.forEach(emp =>{
        let id = emp.id;
        table.append('<tr class="employee-row" id="employee'
        + id 
        + '">'
        + "<td>"
        + emp.lastName
        + "</td>"
        + "<td>"
        + emp.firstName
        + "</td>"
        + "<td>"
        + emp.email
        + "</td>"
        + "<td>"
        + emp.department
        + "</td>"
        + "<td>"
        + emp.location
        + "</td>"
        + "</tr>");
        id ++;
    });
    Sortable.initTable(table);
}
function renderDepartments(departments){
    let table = $(".departments-table");
    table.find("tbody tr").remove();
    departments.forEach(dept =>{
        table.append('<tr class="department-row" id="department'
        + dept.id
        + '">'
        + "<td>"
        + String(dept.id)
        + "</td>"
        + "<td>"
        + dept.name
        + "</td>"
        +"<td>"
        + dept.location
        + "</td>"
        +"<td>"
        + dept.personnel
        + "</td>"
        + "</tr>");
    });
    Sortable.initTable(table);
}
function renderLocations(locations){
    let table = $(".locations-table");
    table.find("tbody tr").remove();
    locations.forEach(loc =>{
        table.append('<tr class="department-row" id="location'
        + loc.id 
        + '">'
        + "<td>"
        + String(loc.id)
        + "</td>"
        + "<td>"
        + loc.name
        + "</td>"
        + "<td>"
        + loc.departments
        + "</td>"
        + "<td>"
        + loc.personnel
        + "</td>"
        + "</tr>");
    });
    Sortable.initTable(table);
}

function createOptions(elementId, array){
    let parent = document.getElementById(elementId);
    while(parent.hasChildNodes()){
        parent.removeChild(parent.firstChild);
    }
    array.forEach(data =>{
        let opt = data.name;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = Number(data.id);
        el.id = "option" + data.id;
        parent.appendChild(el);
    });
}


function updatePersonnelPlaceholders(personnelInfo){
    let emp = personnelInfo;
    $("#employee-form-name").val(emp.firstName);
    $("#employee-form-surname").val(emp.lastName);
    $("#employee-form-email").val(emp.email);
    $("#employee-form-dept").val(emp.deptId);
    $("#employee-form-loc").html(emp.location);
    $("#new-employee-required-email").html('');
    $("#new-employee-required-first").html('');
    $("#new-employee-required-last").html('');
    $("#new-employee-required-dept").html('');
    $("#update-employee-required-email").html('');
    $("#update-employee-required-first").html('');
    $("#update-employee-required-last").html('');
    $("#update-employee-required-dept").html('');
}
function updateDepartmentPlaceholders(departmentInfo){
    let dept = departmentInfo;
    $("#update-department-required-location").html("");
    $("#update-department-required-name").html("");
    $("#department-form-name").val(dept.name);
    $("#department-form-loc").val(dept.locId);
}
function updateLocationPlaceholders(name,id){
    $("#location-form-name").val(name); 
    addCheckbox("location-form-depts",id)
}
function addLocationsCheckbox(targetElement){
    targetElement = document.getElementById(targetElement);
    while(targetElement.hasChildNodes()){
        targetElement.removeChild(targetElement.firstChild);
    }
    $.ajax({
        url: "libs/php/getLocationInfo.php",
        type: 'GET',
        dataType: 'JSON',
        success: function(result){
            let locArray = result.data;
            locArray.forEach(loc=>{
                let label = document.createElement("label");
                let opt = loc.name;
                label.setAttribute("for", opt);
                label.innerHTML = opt;
                targetElement.append(label);
                let el = document.createElement("input");
                el.type = "checkbox";
                el.name = opt;
                el.value = loc.id;
                el.id = loc.id;
                targetElement.append(el);
                let br = document.createElement('br');
                targetElement.append(br);
            });
            $("#options-departments").find(':checkbox').prop("checked",true);
            $("#options-locations").find(':checkbox').prop("checked",true);  
        },
        error: function(err) {
            console.log(err);
        }
    });
}


function addCheckbox(targetElement,locationId=null) {
    targetElement = document.getElementById(targetElement);
    while(targetElement.hasChildNodes()){
        targetElement.removeChild(targetElement.firstChild);
    }
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: 'GET',
        dataType: 'JSON',
        success: function(result){
            let departments = result.data;
            if(locationId){
                $.ajax({
                    url: "libs/php/getLocationInfoById.php",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        id: locationId,
                    },
                    success: function(result){
                        let locationInfo = result.data;
                        let deptArray = [];
                        locationInfo.forEach(dept=>{
                            let name = dept.deptName;
                            deptArray.push(name);
                        })
                        departments.forEach(dept=>{ 
                            let label = document.createElement("label");
                            let opt = dept.name;
                            label.setAttribute("for", opt);
                            label.innerHTML = opt;
                            targetElement.append(label);
                            let el = document.createElement("input");
                            el.type = "checkbox";
                            if (deptArray.includes(dept.name)){
                                el.setAttribute("checked",true);
                            }
                            el.name = opt;
                            el.value = dept.id;
                            el.id = dept.id;
                            targetElement.append(el);
                            let br = document.createElement('br');
                            targetElement.append(br);
                        });
                        $("#options-departments").find(':checkbox').prop("checked",true);
                        $("#options-locations").find(':checkbox').prop("checked",true);
                        
                    },
                    error: function(err) {
                        console.log(err);
                    }
                });
            } else {
                departments.forEach(dept=>{ 
                    let label = document.createElement("label");
                    let opt = dept.name;
                    label.setAttribute("for", opt);
                    label.innerHTML = opt;
                    targetElement.append(label);
                    let el = document.createElement("input");
                    el.type = "checkbox";
                    el.name = opt;
                    el.value = dept.id;
                    el.id = dept.id;
                    targetElement.append(el);
                    let br = document.createElement('br');
                    targetElement.append(br);
                });
                $("#options-departments").find(':checkbox').prop("checked",true);
                $("#options-locations").find(':checkbox').prop("checked",true);
            }  
        },
        error: function(err) {
            console.log(err);
        }
    });
};

//Watch for closing modals
$('.modal').on('hidden.bs.modal', function () {
    //If there are any visible
    if($(".modal:visible").length > 0) {
        //Slap the class on it (wait a moment for things to settle)
        setTimeout(function() {
            $('body').addClass('modal-open');
        },200)
    }
});

/* Tab animations */
$(".employees").on("click",(e)=>{
    $("#search-bar").val('');
    getAllFiltered();
    data.setSection("personnel");
    $("#filter-button").css("display","");
    $(".main-table").css("background-color","#097572");
    $(".locations").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".departments").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".employees").css({"margin-bottom":"-2px","z-index":"3000","border-left":"2px solid #cccccc"});
    $(".employee-div").css("display","block");
    $(".departments-div").css("display","none");
    $(".locations-div").css("display","none");
    $("#search-bar").attr("placeholder","Search personnel");
});
$(".departments").on("click",(e)=>{
    $("#search-bar").val('');
    data.setSection("department");
    getDeptsFiltered();
    $("#filter-button").css("display","");
    $(".main-table").css("background-color","#32a8a4");
    $(".locations").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".employees").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".departments").css({"margin-bottom":"-2px","z-index":"3000","border-left":"2px solid #cccccc"});
    $(".employee-div").css("display","none");
    $(".departments-div").css("display","block");
    $(".locations-div").css("display","none");
    $("#search-bar").attr("placeholder","Search departments");
});
$(".locations").on("click",(e)=>{
    $("#search-bar").val('');
    data.setSection("location");
    getLocationInfo();
    $("#filter-button").css("display","none");
    $(".main-table").css("background-color","#99bfbe");
    $(".employees").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".departments").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".locations").css({"margin-bottom":"-2px","z-index":"3000","border-left":"2px solid #cccccc"});
    $(".employee-div").css("display","none");
    $(".departments-div").css("display","none");
    $(".locations-div").css("display","block");
    $("#search-bar").attr("placeholder","Search locations");
});

$(".employee-body").on("click",(e)=>{
    $(".updated").css("display","none");
    $(".info").css("display","block");
    $(".form").css("display","none");  
    let id = e.toElement.parentElement.id;
    id = id.replace("employee","");
    data.setCurrentPersonnelId(id);
    updatePersonnelModal(id);
});
$(".dept-body").on("click",(e)=>{
    $(".updated").css("display","none");
    $(".info").css("display","block");
    $(".form").css("display","none");  
    let id = e.toElement.parentElement.id;
    id = id.replace("department","");
    data.setCurrentDepartmentId(id);
    updateDepartmentModal(id);
});
$(".loc-body").on("click",(e)=>{
    $(".updated").css("display","none");
    $(".info").css("display","block");
    $(".form").css("display","none");  
    let id = e.toElement.parentElement.id;
    id = id.replace("location","");
    data.setCurrentLocationId(id);
    updateLocationModal(id);
   
})
$(".edit").on("click",(e)=>{
    $(".info").css("display","none");
    $(".form").css("display","block");
    $(".updated").css("display","none");
})
$(".back").on("click",(e)=>{
    e.preventDefault();
    $(".info").css("display","block");
    $(".form").css("display","none");
    $(".updated").css("display","none");
})
$("#add-button").on("click",(e)=>{
    switch (data.getSection()){
        case "personnel":
            $("#new-employee-required-email").html('');
            $("#new-employee-required-first").html('');
            $("#new-employee-required-last").html('');
            $("#new-employee-required-dept").html('');
            $("#update-employee-required-email").html('');
            $("#update-employee-required-first").html('');
            $("#update-employee-required-last").html('');
            $("#update-employee-required-dept").html('');
            $.ajax({
                url: "libs/php/getAllDepartments.php",
                type: 'GET',
                dataType: 'JSON',
                success: function(result){
                    createOptions("new-employee-form-dept", result.data);
                    $("#new-employee-modal").modal('show');
                },
                error: function(err) {
                    console.log(err);
                }
            });
            break;
        case "department":
            $("#update-department-required-location").html("");
            $("#update-department-required-name").html("");
            $("#new-department-required-location").html("");
            $("#new-department-required-name").html("");
            $.ajax({
                url: "libs/php/getAllLocations.php",
                type: 'GET',
                dataType: 'JSON',
                success: function(result){
                    createOptions("new-department-form-loc", result.data);
                    $("#new-department-modal").modal('show');
                },
                error: function(err) {
                    console.log(err);
                }
            });

            break;
        case "location":
            addCheckbox("new-location-form-depts");
            $("#update-location-required-name").html('');
            $("#new-location-required-name").html('');
            $("#new-location-modal").modal('show');
            break;
    }
})
// Search functionality

function search(section) {
    // Declare variables
    let tableEl;
    switch(section){
        case "personnel":
            tableEl = "employee-table";
            break;
        case "department":
            tableEl = "department-table";
            break;
        case "location":
            tableEl = "location-table";
            break;
    }
    var input, filter, table, tableRows, td, i, txtValue;
    input = document.getElementById("search-bar");
    filter = input.value.toUpperCase();
    filter = filter.split(" ");
    filter = filter.join("");
    table = document.getElementById(tableEl);
    tableRows = table.getElementsByTagName("tr");
    for (i = 1 ; i < tableRows.length ; i++){
        let tableTds = tableRows[i].getElementsByTagName("td");
        let flag = false;
        for (let td of tableTds){
            let txtValue = td.innerText || td.textContent;
            txtValue = txtValue.toUpperCase();
            if (txtValue.includes(filter) || filter.includes(txtValue)){
                flag = true;
                tableRows[i].style.display = "";
            }
        }
        if (flag == false){
            tableRows[i].style.display = "none";
        }
    }
}



// Global data object
let data = new Data;

$(window).on("load",()=>{
    getDepartmentInfo();
    getLocationInfo();
    getAll();
    addCheckbox("options-departments");
    addLocationsCheckbox("options-locations");
    $(".preloader").fadeOut("slow");

})
$("#filter-button").on("click",(e)=>{
    if (data.getSection()=="personnel"){
        $("#filter-modal").modal("show");
    } else {
        $("#filter-departments-modal").modal("show");
    }
   
})


// DELETE click events

$("#delete-employee").on("click",(e)=>{
    let id = data.getCurrentPersonnelId();
    $.ajax({
        url: "libs/php/getPersonnelById.php",
        type: 'POST',
        data: {
            id: id,
        },
        dataType: 'JSON',
        success: function(result){
            let personnel = result.data[0];
            if(confirm("Are you sure you want to remove " + personnel.firstName + " " + personnel.lastName +"?")){
                deletePersonnelById(id);
                $("#employee-modal").modal('hide');
            } 
        },
        error: function(err) {
            console.log(err);
        }
    });
})
$("#delete-department").on("click",(e)=>{
    let id = data.getCurrentDepartmentId();
    deleteDepartmentById(id);
})
$("#delete-location").on("click",(e)=>{
    let id = data.getCurrentLocationId();
    deleteLocationById(id);
})
$("#options-form").on("change",(e)=>{
    getAllFiltered();
})
$("#department-options").on("change",(e)=>{
    getDeptsFiltered();
})
// UPDATE click events

$("#submit-employee-update").on("click",(e)=>{
    e.preventDefault();
    let id = data.getCurrentPersonnelId();
    let formArray = $("#update-employee").serializeArray();
    let first = formArray[0].value;
    let last = formArray[1].value;
    let dept = formArray[2].value;
    let email = formArray[3].value;
    let ready = true;
    if (first == ''){
        $("#update-employee-required-first").html("Please enter first name.");
        ready = false;
    }
    if (last == ''){
        $("#update-employee-required-last").html("Please enter first surname.");
        ready = false;
    } 
    if (!dept){
        $("#update-employee-required-dept").html("Please select department.");
        ready = false;
    }
    if (!validateEmail(email)){
        $("#update-employee-required-email").html("Please enter a valid email address.");
        ready = false;
    } 
    if (ready){
        first = first.charAt(0).toUpperCase() + first.substr(1).toLowerCase();
        last = last.charAt(0).toUpperCase() + last.substr(1).toLowerCase();
        updatePersonnelById(id,first,last,email,dept);
        $("#update-employee-required-email").html('');
        $("#update-employee-required-first").html('');
        $("#update-employee-required-last").html('');
        $("#update-employee-required-dept").html('');
    }
})
$("#all-locations").on('click',(e)=>{
    e.preventDefault();
    let checkboxes = $("#options-locations").find(":checkbox");
    if (checkboxes.prop("checked")){
        checkboxes.prop("checked",false).change();
        $("#all-locations").html("Select all");
    } else{
        checkboxes.prop("checked",true).change();
        $("#all-locations").html("Deselect all");
    }
})
$("#all-departments").on('click',(e)=>{
    e.preventDefault();
    let checkboxes = $("#options-departments").find(":checkbox");
    if (checkboxes.prop("checked")){
        $("#all-departments").html("Select all");
        checkboxes.prop("checked",false).change();
    } else{
        checkboxes.prop("checked",true).change();
        $("#all-departments").html("Deselect all");
    }
})
function getAllFiltered(){
    let deptsArray = $("#options-departments").serializeArray();
    let sqlQry = 'SELECT p.id, p.lastName, p.firstName, p.email, d.id AS deptId, d.name as department, l.id AS locId, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE d.name = "fakeDepartmentName"';
    deptsArray.forEach(dept=>{
        let string = ' OR d.id = ' + dept.value;
        sqlQry = sqlQry + string;
    });
    sqlQry = sqlQry + ' ORDER BY p.lastName, p.firstName, d.name, l.name';
    $.ajax({
        url: "libs/php/getFilter.php",
        type: "POST",
        data: {
            query: sqlQry,
        },
        dataType: 'JSON',
        success: function(result){
            renderPersonnel(result.data);
        },
        error: function(err){
            console.log(err);
        }
    })
}
function getDeptsFiltered(){
    let locArray = $("#options-locations").serializeArray();
    let sqlQry = 'SELECT d.id, d.name, COUNT(p.id) AS personnel, l.name AS location FROM department d LEFT JOIN personnel p ON (d.id = p.departmentID) LEFT JOIN location l ON (d.locationID = l.id) WHERE l.id = 999999';
    locArray.forEach(loc=>{
        let string = ' OR l.id = ' + loc.value;
        sqlQry = sqlQry + string;
    });
    sqlQry = sqlQry + ' GROUP BY d.id';
    $.ajax({
        url: "libs/php/getFilter.php",
        type: "POST",
        data: {
            query: sqlQry,
        },
        dataType: 'JSON',
        success: function(result){
            renderDepartments(result.data);
        },
        error: function(err){
            console.log(err);
        }
    })
}

$("#submit-department-update").on("click",(e)=>{
    e.preventDefault();
    let id = data.getCurrentDepartmentId();
    let formArray = $("#update-department").serializeArray();
    let name = formArray[0].value;
    let location = formArray[1].value;
    let ready = true;
    if (name == ''){
        $("#update-department-required-name").html("Please enter department name.");
        ready = false;
    }
    if (!location){
        $("#update-department-required-location").html("Please select location.");
        ready = false;
    }
    if (ready){
        name = name.split(' ');
        let newName = [];
        name.forEach(word=>{
            word = word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
            newName.push(word);
        })
        name = newName.join(' ');
        updateDepartmentById(id,name,location);
        $("#update-department-required-location").html("");
        $("#update-department-required-name").html("");
    }
})
$("#submit-update-location").on("click",(e)=>{
    e.preventDefault();
    let id = data.getCurrentLocationId();
    let formArray = $("#update-location").serializeArray();
    let name = formArray[0].value;
    let ready = true;
    let newDepartments = [];
    for(let i=1 ; i< formArray.length ; i++){
        newDepartments.push(Number(formArray[i].value));
    }
    if (name == ''){
        $("#update-location-required-name").html("Please enter location name.");
        ready = false;
    }
    $.ajax({
        url: "libs/php/getLocationInfoById.php",
        type: 'POST',
        data: {
            id: id,
        },
        dataType: 'JSON',
        success: function(result){
            if (result.data.length > 0){
                let departments = [];
                result.data.forEach(entry=>{
                    departments.push(Number(entry.deptId));
                })
                let count = 0;
                departments.forEach(dept=>{
                    if (!newDepartments.includes(dept)){
                        count ++;
                    }
                })
                if (count != 0){
                    ready = false;
                    alert("Departments can only be assigned, not removed");
                }
            }
            if(ready) {
                updateLocationById(id,name,newDepartments);
                $("#update-location-required-name").html('');
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
})

// CREATE entry click events

$("#submit-new-employee").on("click",(e)=>{
    e.preventDefault();
    let formArray = $("#new-employee").serializeArray();
    let first = formArray[0].value;
    let last = formArray[1].value;
    let dept = formArray[2].value;
    let email = formArray[3].value;
    let ready = true;
    if (first == ''){
        $("#new-employee-required-first").html("Please enter first name.");
        ready = false;
    }
    if (last == ''){
        $("#new-employee-required-last").html("Please enter first surname.");
        ready = false;
    } 
    if (!dept){
        $("#new-employee-required-dept").html("Please select department.");
        ready = false;
    }
    if (!validateEmail(email)){
        $("#new-employee-required-email").html("Please enter a valid email address.");
        ready = false;
    } 
    if (ready){
        first = first.charAt(0).toUpperCase() + first.substr(1).toLowerCase();
        last = last.charAt(0).toUpperCase() + last.substr(1).toLowerCase();
        addPersonnel(first,last,email,dept);
        $("#new-employee")[0].reset();
        $("#new-employee-required-email").html('');
        $("#new-employee-required-first").html('');
        $("#new-employee-required-last").html('');
        $("#new-employee-required-dept").html('');
    }
})
$("#submit-new-department").on("click",(e)=>{
    e.preventDefault();
    let formArray = $("#new-department").serializeArray();
    let name = formArray[0].value;
    let locationId = formArray[1].value;
    let ready = true;
    if (name == ''){
        $("#new-department-required-name").html("Please enter department name.");
        ready = false;
    }
    if (!locationId){
        $("#new-department-required-location").html("Please select location.");
        ready = false;
    }
    if (ready){
        name = name.split(' ');
        let newName = [];
        name.forEach(word=>{
            word = word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
            newName.push(word);
        })
        name = newName.join(' ');
        addDepartment(name,locationId);
        $("#new-department-required-location").html("");
        $("#new-department-required-name").html("");
        $("#new-department")[0].reset();
    }
})
$("#submit-new-location").on("click",(e)=>{
    e.preventDefault();
    let formArray = $("#new-location").serializeArray();
    let name = formArray[0].value;
    let newDepartments = [];
    for(let i=1 ; i< formArray.length ; i++){
        newDepartments.push(Number(formArray[i].value));
    }
    let ready = true;
    if (name == ''){
        $("#new-location-required-name").html("Please enter location Name.");
        ready = false;
    }
    if (ready){
            addLocation(name,newDepartments);
            $("#new-location")[0].reset();
            $("#update-location-required-name").html('');
    }
})
$("#search-bar").on("keyup",(e)=>{
    search(data.getSection());
})
$("#employee-form-dept").on("change",(e)=>{
    let select = e.target;
    let departmentSel = $(select).find(":selected");
    if (departmentSel.length != 0){
    let departmentId = Number(departmentSel[0].attributes[0].value);
    let department = getDepartmentById(departmentId);
    let locationId = department.getLocationId();
    let location = getLocationById(locationId);
    let locationName = location.getName();
    $("#employee-form-loc").html(locationName);
    }
})
$("#new-employee-form-dept").on("change",(e)=>{
    let select = e.target;
    let departmentSel = $(select).find(":selected");
    let departmentId = Number(departmentSel[0].attributes[0].value);
    $.ajax({
        url: "libs/php/getDepartmentInfoById.php",
        type: "POST",
        dataType: 'JSON',
        data: {
            id: departmentId,
        },
        success: (result)=>{
            let locName = result.data[0].location;
            $("#new-employee-form-loc").html(locName);
        }
    })
});
})