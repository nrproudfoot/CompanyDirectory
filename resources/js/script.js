$(document).on("ready",()=>{
class Options{
    constructor(){
        this.section = "employees"
    }
    setSection(section){
        if (section == "employees" || section == "departments" || section == "locations"){
            this.section = section;
        }
    }
    getSection(){
        return this.section;
    }
}
class Employee{
    constructor(id,first,last,email,dept,location){
        if (typeof(Number(id))=="number"){
            this.id = Number(id);
        }
        if (typeof(first) == "string"){
            this.firstName = first;
        };
        if (typeof(last) == "string"){
            this.lastName = last;
        };
        if (validateEmail(email)){
            this.email = email;
        }
        if (typeof(dept) == "string"){
            this.department = dept;
        };
        if (typeof(location) == "string"){
            this.location = location;
        };
    }
    updateEmployee(first,last,email,dept,location){
        if (first && typeof(first) == "string"){
            this.setFirst(first);
        };
        if(last && typeof(last) == "string"){
            this.setLast(last);
        };
        if (email && validateEmail(email)){
            this.setEmail(email);
        };
        if (dept && typeof(dept) == "string"){
            this.setDept(dept);
        };
        if (location && typeof(location) == "string"){
            this.setLocation(location);
        };
    }
    setFirst(name){
        if (typeof(name) == "string"){
            this.firstName = name;
        };
    }
    setLast(name){
        if (typeof(name) == "string"){
            this.lastName = name;
        };
    }
    setEmail(email){
        if (validateEmail(email)){
            this.email = email;
        }
    }
    setDept(dept){
        if (dept && typeof(dept) == "string"){
            this.department = dept;
        };
    }
    setLocation(location){
        if (location && typeof(location) == "string"){
            this.location = location;
        };
    }
    getFirst(){
        return this.firstName;
    }
    getLast(){
        return this.lastName;
    }
    getEmail(){
        return this.email;
    }
    getDept(){
        return this.department;
    }
    getLocation(){
        return this.location;
    }
    getId(){
        return this.id;
    }
    getDeptId(){
        let departments = data.getDepartments();
        let id;
        departments.forEach(dept=>{
            if (dept.getName() == this.getDept()){
                id = dept.getId();
            }
        });
        return id;
    }
    getLocationId(){
        let locations = data.getLocations();
        let id;
        locations.forEach(loc=>{
            if (loc.getName() == this.getLocation()){
                id = loc.getId();
            };
        });
        return id;
    }
}
class Department{
    constructor(id,name,locationID,locationName=null){
        if (typeof(Number(id)) == "number"){
            this.id = Number(id);
        }
        if (typeof(name) == "string"){
            this.name= name;
        }
        if (typeof(Number(locationID)) == "number"){
            this.locationId = Number(locationID);
        }
        if (typeof(locationName) == "string"){
            this.locationName = locationName;
        }
    }
    setName(name){
        if (typeof(name) == "string"){
            this.name= name;
        }
    }
    getName(){
        return this.name;
    }
    getId(){
        return this.id;
    }
    setLocationId(id){
        if (typeof(Number(id)) == "number"){
            this.locationId = Number(id);
        }
    }
    getLocationId(){
        return this.locationId;
    }
    setLocationName(name){
        if (typeof(name) == "string"){
            this.locationName = name;
        }
    }
    getLocationName(){
        if (this.locationName){
            return this.locationName;
        }
        else {
            let location = getLocationById(this.locationId);
            let locationName = location.getName();
            this.setLocationName(locationName);
            return locationName;
        }
    }
}
class Location{
    constructor(id,name){
        if (typeof(Number(id)) == "number"){
            this.id = Number(id);
        }
        if (typeof(name) == "string"){
            this.name= name;
        }
    }
    setName(name){
        if (typeof(name) == "string"){
            this.name= name;
        }
    }
    getName(){
        return this.name;
    }
    getId(){
        return this.id;
    }
}
class Data{
    constructor(){
        this.employees = [];
        this.departments = [];
        this.locations = [];
        this.currentEmployee;
        this.currentDepartment;
        this.currentLocation;
    }
    setEmployees(employees){
            this.employees = employees;
    }
    getEmployees(){
        return this.employees;
    }
    setDepartments(departments){
        this.departments = departments;
    }
    getDepartments(){
        return this.departments;
    }
    setLocations(locations){
        this.locations = locations;
    }
    getLocations(){
        return this.locations;
    }
    getLocationById(id){
        let locs = this.getLocations();
        let location;
        locs.forEach(loc =>{
            if (loc.getId() == id){
                location = loc;
            }
        });
        return location;
    }
    setCurrentEmployee(employee){
        this.currentEmployee = employee;
    }
    getCurrentEmployee(){
        return this.currentEmployee;
    }
    setCurrentDepartment(department){
        this.currentDepartment =department;
    }
    getCurrentDepartment(){
        return this.currentDepartment;
    }
    setCurrentLocation(location){
        this.currentLocation = location;
    }
    getCurrentLocation(){
        return this.currentLocation;
    }
}
function updateModal(object){
    if (object instanceof Employee){
        createOptions("employee-form-dept", data.getDepartments());
        let personnel = object;
        let first = personnel.getFirst();
        let last = personnel.getLast();
        let name = first + " " + last;
        $("#employee-name").html(name);
        $("#employee-dept").html(personnel.getDept());
        $("#employee-loc").html(personnel.getLocation());
        $("#employee-email").html(personnel.getEmail());
        updateFormPlaceholders(personnel);

    } else if (object instanceof Department){
        let department = object;
        let employees = data.getEmployees();
        let count = 0;
        employees.forEach(emp=>{
            if(Number(emp.getDeptId()) == Number(department.getId())){
                count ++;
            }
        });
        $("#department-name").html(department.getName());
        $("#department-loc").html(department.getLocationName());
        $("#department-emp").html(count);
        if (data.getCurrentLocation()){
            addLocationDepts(data.getCurrentLocation().getId());
        }
    } else if (object instanceof Location){
        let location = object;
        addLocationDepts(location.getId());
        $("#location-name").html(location.getName());
    }
    
}

function validateEmail(inputText){
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(inputText.match(mailformat)){
        return true;
    } else {
        return false;
        }
}

function getAll(data,id=null){
    $.ajax({
        url: "libs/php/getAll.php",
        type: 'GET',
        dataType: 'JSON',
        success: function(result){
            let employeesArray = [];
            result.data.forEach(p => {
                let employee = new Employee(p.id,p.firstName,p.lastName,p.email,p.department,p.location);
                employeesArray.push(employee);
            })
            data.setEmployees(employeesArray);
            renderEmployees(data.getEmployees());
            if (data.getDepartments() && data.getLocations()){
                renderDepartments(data.getDepartments(),data);
                renderLocations(data.getLocations(),data);
            }
            if (id){
                let employee = getEmployeeById(id);
                data.setCurrentEmployee(employee);
            };
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function getAllDepartments(data){
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: 'GET',
        dataType: 'JSON',
        success: function(result){
            let departmentsArray = [];
            result.data.forEach(p => {
                let department = new Department(p.id,p.name,p.locationID);
                departmentsArray.push(department);
            })
            data.setDepartments(departmentsArray);
            if(data.getLocations()){
                renderDepartments(data.getDepartments(),data);
                renderLocations(data.getLocations(),data);
            }
            renderEmployees(data.getEmployees());
            createOptions('employee-form-dept', data.getDepartments());
            createOptions('new-employee-form-dept', data.getDepartments());
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function getAllLocations(data){
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: 'GET',
        dataType: 'JSON',
        success: function(result){
            let locationsArray = [];
            result.data.forEach(p => {
                let location = new Location(p.id,p.name);
                locationsArray.push(location);
            })
            data.setLocations(locationsArray);
            renderLocations(data.getLocations(),data);
            createOptions('new-department-form-loc', data.getLocations());
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function getDepartmentsWhere(attr,value,callback){
    $.ajax({
        url: "libs/php/getDepartmentsWhere.php",
        type: 'POST',
        data: {
            attr: attr,
            value: value,
        },
        dataType: 'JSON',
        success: function(result){
            callback(result);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function deletePersonnelById(id){
    $.ajax({
        url: "libs/php/deletePersonnelById.php",
        type: 'POST',
        data: {
            id: id,
        },
        dataType: 'JSON',
        success: function(result){
            getAll(data);
        },
        error: function(err) {
            console.log(err);
        }
    });
};
function deleteDepartmentById(id){
    $.ajax({
        url: "libs/php/getPersonnelWhere.php",
        type: 'POST',
        data: {
            attr: "department",
            value: id,
        },
        dataType: 'JSON',
        success: function(result){
            if (result.data.length != 0){
                let count= result.data.length;
                alert("Department cannot be delete as it contains " + count + " employees.");
            } else if(confirm("Are you sure you want to remove " + getDepartmentById(id).getName() + " from Departments?")){
                    $.ajax({
                        url: "libs/php/deleteDepartmentByID.php",
                        type: 'POST',
                        data: {
                            id: id,
                        },
                        dataType: 'JSON',
                        success: function(result){
                            getAll(data);
                            getAllLocations(data);
                            getAllDepartments(data);
                            $("#department-modal").modal('hide');
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
        url: "libs/php/getDepartmentsWhere.php",
        type: 'POST',
        data: {
            attr: "location",
            value: id,
        },
        dataType: 'JSON',
        success: function(result){
            if (result.data.length != 0){
                let count= result.data.length;
                alert("Location cannot be delete as it contains " + count + " departments.");
            } else if (confirm("Are you sure you want to remove " + getLocationById(id).getName() + " from Locations?")){
                $.ajax({
                    url: "libs/php/deleteLocationById.php",
                    type: 'POST',
                    data: {
                        id: id,
                    },
                    dataType: 'JSON',
                    success: function(result){
                        getAll(data);
                        getAllLocations(data);
                        getAllDepartments(data);
                        $("#location-modal").modal('hide');
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
function addLocation(name,departments){
    $.ajax({
        url: "libs/php/insertLocation.php",
        type: 'POST',
        data: {
            name: name,
        },
        dataType: 'JSON',
        success: function(result){
            let id = result.data[0].id;
            departments.forEach(deptId=>{
                let dept = getDepartmentById(deptId);
                let name = dept.getName();
                let locationId = id;
                updateDepartmentById(dept,name,locationId);
            })
            let name = result.data[0].name;
            data.setCurrentLocation(new Location(id,name));
            getAll(data);
            getAllLocations(data);
            getAllDepartments(data);
            updateModal(data.getCurrentLocation());
            updateFormPlaceholders(data.getCurrentLocation());
            $(".updated").css("display","none");
            $(".info").css("display","block");
            $(".form").css("display","none");
            $("#new-location-modal").modal('hide');
            $("#location-modal").modal('show');
            renderLocations(data.getLocations());
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function addDepartment(name,locationId){
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
            let name = result.data[0].name;
            let locationId = Number(result.data[0].locationID);
            let location = getLocationById(locationId).getName();
            let newDepartment = new Department(id,name,locationId,location);
            data.setCurrentDepartment(newDepartment);
            getAllDepartments(data);
            updateModal(newDepartment);
            updateFormPlaceholders(newDepartment);
            $(".updated").css("display","none");
            $(".info").css("display","block");
            $(".form").css("display","none");
            $("#new-department-modal").modal('hide');
            $("#department-modal").modal('show');
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function addPersonnel(first,last,email,department){
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
            getAll(data);
            let id = Number(result.data[0].id);
            let dept = getDepartmentById(department);
            let location = dept.getLocationName();
            let deptName = dept.getName();
            data.setCurrentEmployee(new Employee(id,first,last,email,deptName,location));
            updateModal(data.getCurrentEmployee());
            $(".updated").css("display","none");
            $(".info").css("display","block");
            $(".form").css("display","none"); 
            $("#new-employee-modal").modal('hide');
            $("#employee-modal").modal('show');
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function getEmployeeById(id){
    let employees = data.getEmployees();
    let employee;
    employees.forEach(emp=>{
        if (emp.getId() == id){
            employee = emp;
        }
    });
    return employee;
}
function getDepartmentById(id){
    let departments = data.getDepartments();
    let department;
    departments.forEach(dept =>{
        if(dept.getId() == id){
            department = dept;
        }
    });
    return department;
}
function getLocationById(id){
    let locations = data.getLocations();
    let location;
    locations.forEach(loc=>{
        if(loc.getId() == id){
            location = loc;
        }
    });
    return location;
}

function updateLocationById(location, name, departmentIds){
    location.setName(name);
    departmentIds.forEach(id=>{
        let department = getDepartmentById(id);
        let name = department.getName();
        let locationId = location.getId();
        updateDepartmentById(department,name,locationId);
    })
    $.ajax({
        url: "libs/php/updateLocationById.php",
        type: 'POST',
        data: {
            id: location.getId(),
            name: name,
        },
        dataType: 'JSON',
        success: function(result){
            getAll(data);
            getAllLocations(data);
            getAllDepartments(data);
            setTimeout(()=>{
                if (data.getLocations()){
                    renderLocations(data.getLocations(),data);
                };
                data.setCurrentLocation(new Location(result.data.result[0].id,result.data.result[0].name));
                updateModal(new Location(result.data.result[0].id,result.data.result[0].name));
                $('.form').css("display","none");
                $(".updated").css("display","block");
                $(".info").css("display","block");
            }, 50)
        },
        error: function(err) {
            console.log(err);
        }
    });

}
function updateDepartmentById(department, name, locationId){
    department.setName(name);
    department.setLocationId(locationId);
    let locationName;
    data.getLocations().forEach(loc=>{
        if (loc.getId() == locationId){
            locationName = loc.getName();
        }
    })
    department.setLocationName(locationName);
    $.ajax({
        url: "libs/php/updateDepartmentById.php",
        type: 'POST',
        data: {
            name: name,
            id: department.getId(),
            locationId: locationId,
        },
        dataType: 'JSON',
        success: function(result){
            getAll(data);
            let id = result.data.result[0].id;
            let name = result.data.result[0].name;
            let locationId = Number(result.data.result[0].locationID);
            let location = getLocationById(locationId).getName();
            let department = new Department(id,name,locationId,location);
            updateModal(department);
            if (data.getLocations()){
                renderLocations(data.getLocations(),data);
            }
            setTimeout(()=>{
                $('.form').css("display","none");
                $(".updated").css("display","block");
                $(".info").css("display","block");
            }, 50)
        },
        error: function(err) {
            console.log(err);
        }
    });

}
function updatePersonnelById(employee,first,last,email,department){
    employee.setFirst(first);
    employee.setLast(last);
    employee.setEmail(email);
    employee.setDept(department);
    let departments = data.getDepartments();
    let deptId;
    departments.forEach(dept =>{
        if (dept.getName() == employee.getDept()){
            deptId = dept.getId();
        }
    });

    $.ajax({
        url: "libs/php/updatePersonnelById.php",
        type: 'POST',
        data: {
            firstName: employee.getFirst(),
            lastName: employee.getLast(),
            email: employee.getEmail(),
            id: employee.getId(),
            departmentId: department,
        },
        dataType: 'JSON',
        success: function(result){
            getAll(data);
            let id = Number(result.data.result[0].id);
            let first = result.data.result[0].firstName;
            let last = result.data.result[0].lastName;
            let email = result.data.result[0].email;
            let deptId = Number(result.data.result[0].departmentID);
            let dept = getDepartmentById(deptId);
            let location = dept.getLocationName();
            let deptName = dept.getName();
            let employee = new Employee(id,first,last,email,deptName,location);
            updateModal(employee);
            setTimeout(()=>{
                $('.form').css("display","none");
                $(".updated").css("display","block");
                $(".info").css("display","block");
            }, 50)
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
        console.log(location);
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
function renderEmployees(employees){
    let table = $(".employee-table");
    table.find("tbody tr").remove();
    employees.forEach(emp =>{
        let id = emp.getId();
        table.append('<tr class="employee-row" id="employee'
        + id 
        + '">'
        + "<td>"
        + emp.getLast()
        + "</td>"
        + "<td>"
        + emp.getFirst()
        + "</td>"
        + "<td>"
        + emp.getEmail()
        + "</td>"
        + "<td>"
        + emp.getDept()
        + "</td>"
        + "<td>"
        + emp.getLocation()
        + "</td>"
        + "</tr>");
        id ++;
    });
    Sortable.initTable(table);
}
function renderDepartments(departments,data){
    let table = $(".departments-table");
    table.find("tbody tr").remove();
    let employees = data.getEmployees();
    departments.forEach(dept =>{
        let count = 0;
        let loc;
        if(data.getLocations()){
            loc = dept.getLocationName();
        } else {
            loc = '';
        }
        employees.forEach(emp=>{
            if(emp.getDept() == dept.getName()){
                count ++;
            }
        })
        table.append('<tr class="department-row" id="department'
        + dept.getId()
        + '">'
        + "<td>"
        + String(dept.getId())
        + "</td>"
        + "<td>"
        + dept.getName()
        + "</td>"
        +"<td>"
        + loc
        + "</td>"
        +"<td>"
        + String(count)
        + "</td>"
        + "</tr>");
    });
    Sortable.initTable(table);
}
function renderLocations(locations,data){
    let table = $(".locations-table");
    table.find("tbody tr").remove();
    let departments = data.getDepartments();
    let employees = data.getEmployees();
    locations.forEach(loc =>{
        let deptCount = 0;
        let empCount = 0;
        departments.forEach(dept=>{
            if(dept.getLocationId() == loc.getId()){
                deptCount ++;
                employees.forEach(emp=>{
                    if(emp.getDeptId() == dept.getId()){
                        empCount ++;
                    }
                })
            }
        });
        table.append('<tr class="department-row" id="location'
        + loc.getId() 
        + '">'
        + "<td>"
        + String(loc.getId())
        + "</td>"
        + "<td>"
        + loc.getName()
        + "</td>"
        + "<td>"
        + String(deptCount)
        + "</td>"
        + "<td>"
        + String(empCount)
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
        let opt = data.getName();
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = Number(data.getId());
        el.id = "option" + data.getId();
        parent.appendChild(el);
    });
}

function getFullName(employee){
    let first = employee.getFirst();
    let last = employee.getLast();
    return first + " " + last;
}

    function updateFormPlaceholders(object){
        if (object instanceof Employee){
            let employee = object;
            $("#employee-form-name").val(employee.getFirst());
            $("#employee-form-surname").val(employee.getLast());
            $("#employee-form-email").val(employee.getEmail());
            $("#employee-form-dept").val(employee.getDeptId());
            $("#employee-form-loc").html(employee.getLocation());
            $("#new-employee-required-email").html('');
            $("#new-employee-required-first").html('');
            $("#new-employee-required-last").html('');
            $("#new-employee-required-dept").html('');
            $("#update-employee-required-email").html('');
            $("#update-employee-required-first").html('');
            $("#update-employee-required-last").html('');
            $("#update-employee-required-dept").html('');
        } else if (object instanceof Department){
            let department = object;
            $("#update-department-required-location").html("");
            $("#update-department-required-name").html("");
            $("#department-form-name").val(department.getName());
            $("#department-form-loc").val(department.getLocationId());
    
        } else if (object instanceof Location){
            let location = object;
            let departments = data.getDepartments();
            let locDepts = [];
            departments.forEach(dept => {
                if (dept.getLocationId() == location.getId()){
                    locDepts.push(dept);
                }
            });
            $("input:checkbox").prop('checked', false);
            locDepts.forEach(dept =>{
                let id = "#" + dept.getId();
                $(id).prop("checked",true);
            })
            $("#location-form-name").val(location.getName());
        }   
    }



function addCheckbox(targetElement,locations = null) {
    let departments = data.getDepartments();
    targetElement = document.getElementById(targetElement);
    while(targetElement.hasChildNodes()){
        targetElement.removeChild(targetElement.firstChild);
    }
    departments.forEach(dept=>{ 
        let label = document.createElement("label");
        let opt = dept.getName();
        label.setAttribute("for", opt);
        label.innerHTML = opt;
        targetElement.append(label);
        let el = document.createElement("input");
        el.type = "checkbox";
        if (locations && locations.includes(dept.getName())){
            el.setAttribute("checked");
        }
        el.name = opt;
        el.value = dept.getId();
        el.id = dept.getId();
        targetElement.append(el);
        let br = document.createElement('br');
        targetElement.append(br);
    })
};
function addLocationDepts(locId){
    getDepartmentsWhere("location",locId,(result)=>{
        let departments = result.data;
        let location = document.getElementById("location-depts");
        $("#location-depts").empty();
        departments.forEach(dept=>{
            let li = document.createElement("li");
            let text = dept.name;
            li.innerHTML = text;
            location.append(li);
    })
    })
}
/* Global options and data objects */
let options = new Options();
let data = new Data();

/* Tab animations */
$(".employees").on("click",(e)=>{
    $("#search-bar").val('');
    renderEmployees(data.getEmployees(),data);
    $(".main-table").css("background-color","#097572");
    $(".locations").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".departments").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".employees").css({"margin-bottom":"-2px","z-index":"3000","border-left":"2px solid #cccccc"});
    $(".employee-div").css("display","block");
    $(".departments-div").css("display","none");
    $(".locations-div").css("display","none");
    $("#search-bar").attr("placeholder","Search personnel");
    options.setSection("employees");
});
$(".departments").on("click",(e)=>{
    $("#search-bar").val('');
    if (data.getDepartments() && data.getLocations()){
        renderDepartments(data.getDepartments(),data);
    };
    $(".main-table").css("background-color","#32a8a4");
    $(".locations").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".employees").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".departments").css({"margin-bottom":"-2px","z-index":"3000","border-left":"2px solid #cccccc"});
    $(".employee-div").css("display","none");
    $(".departments-div").css("display","block");
    $(".locations-div").css("display","none");
    $("#search-bar").attr("placeholder","Search departments");
    options.setSection("departments");
});
$(".locations").on("click",(e)=>{
    $("#search-bar").val('');
    if (data.getLocations()){
        renderLocations(data.getLocations(),data);
    };
    $(".main-table").css("background-color","#99bfbe");
    $(".employees").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".departments").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".locations").css({"margin-bottom":"-2px","z-index":"3000","border-left":"2px solid #cccccc"});
    $(".employee-div").css("display","none");
    $(".departments-div").css("display","none");
    $(".locations-div").css("display","block");
    $("#search-bar").attr("placeholder","Search locations");
    options.setSection("locations");
});

$(".employee-body").on("click",(e)=>{
    $(".updated").css("display","none");
    $(".info").css("display","block");
    $(".form").css("display","none");  
    let id = e.toElement.parentElement.id;
    id = id.replace("employee","");
    let employee = getEmployeeById(id);
    data.setCurrentEmployee(employee);
    updateModal(employee);
    $("#employee-modal").modal('show');
});
$(".dept-body").on("click",(e)=>{
    $(".updated").css("display","none");
    $(".info").css("display","block");
    $(".form").css("display","none");  
    let id = e.toElement.parentElement.id;
    id = id.replace("department","");
    let department = getDepartmentById(id);
    data.setCurrentDepartment(department);
    let locid = department.getLocationId();
    let location = getLocationById(locid);
    createOptions("department-form-loc", data.getLocations());
    updateFormPlaceholders(department);
    updateModal(department);
    $("#department-modal").modal('show');
});
$(".loc-body").on("click",(e)=>{
    $(".updated").css("display","none");
    $(".info").css("display","block");
    $(".form").css("display","none");  
    let id = e.toElement.parentElement.id;
    id = id.replace("location","");
    let location = getLocationById(id);
    data.setCurrentLocation(location);
    addLocationDepts(location.getId());
    addCheckbox("location-form-depts");
    updateFormPlaceholders(location);
    $("#location-name").html(location.getName())
    $("#location-modal").modal('show');
})
$(".edit").on("click",(e)=>{
    createOptions('department-form-loc', data.getLocations());
    createOptions("new-employee-form-dept", data.getDepartments());
    updateFormPlaceholders(data.getCurrentDepartment());
    updateFormPlaceholders(data.getCurrentLocation());
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
    switch (options.getSection()){
        case "employees":
            $("#new-employee-required-email").html('');
            $("#new-employee-required-first").html('');
            $("#new-employee-required-last").html('');
            $("#new-employee-required-dept").html('');
            $("#update-employee-required-email").html('');
            $("#update-employee-required-first").html('');
            $("#update-employee-required-last").html('');
            $("#update-employee-required-dept").html('');
            createOptions("new-employee-form-dept", data.getDepartments());
            $("#new-employee-modal").modal('show');
            break;
        case "departments":
            $("#update-department-required-location").html("");
            $("#update-department-required-name").html("");
            $("#new-department-required-location").html("");
            $("#new-department-required-name").html("");
            $("#new-department-modal").modal('show');
            break;
        case "locations":
            createOptions('new-department-form-loc', data.getLocations());
            addCheckbox("new-location-form-depts");
            $("#update-location-required-name").html('');
            $("#new-location-required-name").html('');
            $("#new-location-modal").modal('show');
            break;
    }
})


$(window).on("load",()=>{
   
    getAll(data);
    getAllDepartments(data);
    getAllLocations(data);
    $(".preloader").fadeOut("slow");
})
$("#delete-employee").on("click",(e)=>{
    let employee = data.getCurrentEmployee();
    if(confirm("Are you sure you want to remove " + employee.getFirst() + " " + employee.getLast() +"?")){
        let id = employee.getId();
        deletePersonnelById(id);
        $("#employee-modal").modal('hide');
    }
})
$("#delete-department").on("click",(e)=>{
    let department = data.getCurrentDepartment();
    deleteDepartmentById(department.getId());
})
$("#delete-location").on("click",(e)=>{
    let location = data.getCurrentLocation();
    deleteLocationById(location.getId());
})
$("#submit-employee-update").on("click",(e)=>{
    e.preventDefault();
    let employee = data.getCurrentEmployee();
    let formArray = $("#update-employee").serializeArray();
    let first = formArray[0].value;
    let last = formArray[1].value;
    let dept = formArray[2].value;
    let email = formArray[3].value;
    let id = employee.getId();
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
        updatePersonnelById(employee,first,last,email,dept);
        $("#update-employee-required-email").html('');
        $("#update-employee-required-first").html('');
        $("#update-employee-required-last").html('');
        $("#update-employee-required-dept").html('');
    }
})
$("#submit-department-update").on("click",(e)=>{
    e.preventDefault();
    let department = data.getCurrentDepartment();
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
        updateDepartmentById(department,name,location);
        $("#update-department-required-location").html("");
        $("#update-department-required-name").html("");
    }
})
$("#submit-update-location").on("click",(e)=>{
    e.preventDefault();
    let location = data.getCurrentLocation();
    let allDepartments = data. getDepartments();
    let departments = [];
    allDepartments.forEach(dept=>{
        if (dept.getLocationId() == location.getId()){
            departments.push(dept.getId());
        }
    })
    let formArray = $("#update-location").serializeArray();
    let name = formArray[0].value;
    let newDepartments = [];
    for(let i=1 ; i< formArray.length ; i++){
        newDepartments.push(Number(formArray[i].value));
    }
    let ready = true;
    let count =0;
    departments.forEach(dept=>{
        if (!newDepartments.includes(dept)){
            count ++;
        }
    })
    if (name == ''){
        $("#update-location-required-name").html("Please enter location name.");
        ready = false;
    }
    if (ready){
        if(count != 0){
            alert("Departments can only be added not removed. Reassign or delete department to remove from Location");
            updateFormPlaceholders(location);
        } else if (confirm("Are you sure you want update the " + location.getName() + " location?")){
            updateLocationById(location,name,newDepartments);
            $("#update-location-required-name").html('');
        }
    }  
})
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
    employeeSearch($("#search-bar").val());
    departmentSearch($("#search-bar").val());
    locationSearch($("#search-bar").val());
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
    let department = getDepartmentById(departmentId);
    let locationId = department.getLocationId();
    let location = getLocationById(locationId);
    let locationName = location.getName();
    $("#new-employee-form-loc").html(locationName);
})
})