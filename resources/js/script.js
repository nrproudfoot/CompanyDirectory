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
    constructor(first,last,email,dept,location){
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
        if (typeof(first) == "string"){
            this.firstName = first;
        };
    }
    setLast(name){
        if (typeof(last) == "string"){
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
}
class Department{
    constructor(id,name,locationID){
        if (typeof(Number(id)) == "number"){
            this.id = Number(id);
        }
        if (typeof(name) == "string"){
            this.name= name;
        }
        if (typeof(Number(locationID)) == "number"){
            this.locationId = Number(locationID);
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
    setLocationID(id){
        if (typeof(Number(id)) == "number"){
            this.locationID = Number(id);
        }
    }
    getLocationId(){
        return this.locationID;
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
}


function validateEmail(inputText){
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(inputText.match(mailformat)){
        return true;
    } else {
        alert("You have entered an invalid email address!");
        return false;
        }
}

function getAll(data){
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/getAll.php",
        type: 'GET',
        dataType: 'JSON',
        success: function(result){
            let employeesArray = [];
            result.data.forEach(p => {
                console.log(p);
                let employee = new Employee(p.firstName,p.lastName,p.email,p.department,p.location);
                employeesArray.push(employee);
            })
            data.setEmployees(employeesArray);
            renderEmployees(data);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function getAllDepartments(data){
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/getAllDepartments.php",
        type: 'GET',
        dataType: 'JSON',
        success: function(result){
            let departmentsArray = [];
            result.data.forEach(p => {
                let department = new Department(p.id,p.name,p.locationID);
                departmentsArray.push(department);
            })
            data.setDepartments(departmentsArray);
            renderDepartments(data);
            createDeptOptions(data);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function getAllLocations(data){
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/getAllLocations.php",
        type: 'GET',
        dataType: 'JSON',
        success: function(result){
            let locationsArray = [];
            result.data.forEach(p => {
                let location = new Location(p.id,p.name);
                locationsArray.push(location);
            })
            data.setLocations(locationsArray);
            renderLocations(data);
            createLocOptions(data);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
function renderEmployees(data){
    let employees = data.getEmployees();
    let table = $(".employee-table");
    table.find("tbody tr").remove();
    let id = 0;
    employees.forEach(emp =>{
        table.append('<tr class="employee-row" id="employee'
        + id 
        + '">'
        + "<td>"
        + emp.getFirst()
        + "</td>"
        + "<td>"
        + emp.getLast()
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
    })
}
function renderDepartments(data){
    let departments = data.getDepartments();
    let table = $(".departments-table");
    table.find("tbody tr").remove();
    let id = 0;
    departments.forEach(dept =>{
        table.append('<tr class="department-row" id="department'
        + id 
        + '">'
        + "<td>"
        + dept.getId()
        + "</td>"
        + "<td>"
        + dept.getName()
        + "</td>"
        + "</tr>");
        id ++;
    })
}
function renderLocations(data){
    let locations = data.getLocations();
    let table = $(".locations-table");
    table.find("tbody tr").remove();
    let id = 0;
    locations.forEach(loc =>{
        table.append('<tr class="department-row" id="location'
        + id 
        + '">'
        + "<td>"
        + loc.getId()
        + "</td>"
        + "<td>"
        + loc.getName()
        + "</td>"
        + "</tr>");
        id ++;
    })
}
function createDeptOptions(data){
    let departments = document.getElementById("employee-form-dept");
    let deptData = data.getDepartments();
    console.log(deptData);
    for (let i = 0; i < deptData.length ; i++){
        let opt = deptData[i].getName();
       // let val = deptData[i].getId();
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        departments.appendChild(el);
    };
}
function createLocOptions(data){
    let locations = document.getElementById("employee-form-loc");
    let locData = data.getLocations();
    console.log(locData);
    for (let i = 0; i <locData.length ; i++){
        let opt = locData[i].getName();
       // let val = locData[i].getId();
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        locations.appendChild(el);
    };
}
function getFullName(employee){
    let first = employee.getFirst();
    let last = employee.getLast();
    return first + " " + last;
}

function updateFormPlacehoders(employee){
    $("#employee-form-name").attr("placeholder",getFullName(employee));
    $("#employee-form-email").attr("placeholder", employee.getEmail());
    $("#employee-form-dept").val(employee.getDept());
    $("#employee-form-loc").val(employee.getLocation());
    console.log(employee.getLocation(), employee.getDept());
}

/* Global options and data objects */
let options = new Options();
let data = new Data();

/* Tab animations */
$(".employees").on("click",(e)=>{
    $(".main-table").css("background-color","#097572");
    $(".locations").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".departments").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".employees").css({"margin-bottom":"-2px","z-index":"3000","border-left":"2px solid #cccccc"});
    $(".employee-div").css("display","block");
    $(".departments-div").css("display","none");
    $(".locations-div").css("display","none");
    options.setSection("employees");
});
$(".departments").on("click",(e)=>{
    $(".main-table").css("background-color","#32a8a4");
    $(".locations").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".employees").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".departments").css({"margin-bottom":"-2px","z-index":"3000","border-left":"2px solid #cccccc"});
    $(".employee-div").css("display","none");
    $(".departments-div").css("display","block");
    $(".locations-div").css("display","none");
    options.setSection("departments");
});
$(".locations").on("click",(e)=>{
    $(".main-table").css("background-color","#99bfbe");
    $(".employees").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".departments").css({"margin-bottom":"0px","z-index":"1","border-left":"2px solid #777777"});
    $(".locations").css({"margin-bottom":"-2px","z-index":"3000","border-left":"2px solid #cccccc"});
    $(".employee-div").css("display","none");
    $(".departments-div").css("display","none");
    $(".locations-div").css("display","block");
    options.setSection("locations");
});

$(".employee-body").on("click",(e)=>{
    let id = e.toElement.parentElement.id;
    id = id.replace("employee","");
    let employees = data.getEmployees();
    let employee = employees[id];
    let first = employee.getFirst();
    let last = employee.getLast();
    let name = first + " " + last;
    console.log(name);
    updateFormPlacehoders(employee);
    $("#employee-name").html(name);
    $("#employee-dept").html(employee.getDept());
    $("#employee-loc").html(employee.getLocation());
    $("#employee-email").html(employee.getEmail());
    $("#employee-modal").modal('show');
});
$(".edit").on("click",(e)=>{
    $(".info").css("display","none");
    $(".form").css("display","block");
})
$("#back").on("click",(e)=>{
    $(".info").css("display","block");
    $(".form").css("display","none");
})

$(window).on("load",()=>{
    getAll(data);
    getAllDepartments(data);
    getAllLocations(data);
})