// ===============================
// HRMS LOGIN
// ===============================

function login() {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (email === "admin@hrms.com" && password === "admin123") {

        document.getElementById("loginPage").classList.add("hidden");

        document.getElementById("app").classList.remove("hidden");

        showNotification("Welcome to HRMS!");

    } else {

        alert(
            "Invalid login.\n\n" +
            "Demo Login:\n" +
            "Email: admin@hrms.com\n" +
            "Password: admin123"
        );

    }
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    document.getElementById("app").classList.add("hidden");

    document.getElementById("loginPage").classList.remove("hidden");

    document.getElementById("loginEmail").value = "";

    document.getElementById("loginPassword").value = "";

}


// ===============================
// PAGE NAVIGATION
// ===============================

function showPage(pageId, button) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function(item) {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    updatePageTitle(pageId);
}


function showPageByName(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    updatePageTitle(pageId);
}


// ===============================
// PAGE TITLES
// ===============================

function updatePageTitle(pageId) {

    const titles = {

        dashboard: [
            "Dashboard",
            "Overview of your HR activities"
        ],

        employees: [
            "Employees",
            "Manage employee information"
        ],

        attendance: [
            "Attendance",
            "Track employee attendance"
        ],

        leave: [
            "Leave Management",
            "Manage employee leave requests"
        ],

        holidays: [
            "Holidays",
            "Company holiday calendar"
        ],

        documents: [
            "Documents",
            "Manage HR documents"
        ],

        reports: [
            "Reports",
            "HR analytics and reports"
        ],

        settings: [
            "Settings",
            "Manage HRMS preferences"
        ]

    };


    if (titles[pageId]) {

        document.getElementById("pageTitle").textContent =
            titles[pageId][0];

        document.getElementById("pageSubtitle").textContent =
            titles[pageId][1];

    }

}


// ===============================
// CURRENT DATE
// ===============================

function displayCurrentDate() {

    const date = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    const currentDate =
        document.getElementById("currentDate");

    if (currentDate) {

        currentDate.textContent =
            date.toLocaleDateString("en-IN", options);

    }

}


// ===============================
// EMPLOYEE DATA
// ===============================

let employees = [

    {
        id: "EMP001",
        firstName: "Arun",
        lastName: "Kumar",
        email: "arun@company.com",
        department: "Sales",
        designation: "Sales Executive",
        joiningDate: "2025-05-10",
        status: "Active"
    },

    {
        id: "EMP002",
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya@company.com",
        department: "HR",
        designation: "HR Executive",
        joiningDate: "2025-03-15",
        status: "Active"
    },

    {
        id: "EMP003",
        firstName: "Ravi",
        lastName: "Patel",
        email: "ravi@company.com",
        department: "IT",
        designation: "Software Developer",
        joiningDate: "2024-11-20",
        status: "Active"
    },

    {
        id: "EMP004",
        firstName: "Sneha",
        lastName: "Reddy",
        email: "sneha@company.com",
        department: "Finance",
        designation: "Finance Executive",
        joiningDate: "2025-01-12",
        status: "Active"
    }

];


// ===============================
// EMPLOYEE TABLE
// ===============================

function renderEmployees(list = employees) {

    const table =
        document.getElementById("employeeTable");

    if (!table) return;

    table.innerHTML = "";


    list.forEach(function(employee) {

        const initials =
            employee.firstName.charAt(0) +
            employee.lastName.charAt(0);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="employee-name">

                    <div class="employee-avatar">
                        ${initials}
                    </div>

                    <div>

                        <strong>
                            ${employee.firstName}
                            ${employee.lastName}
                        </strong>

                        <small
                            style="display:block;color:#6b7280;">
                            ${employee.email}
                        </small>

                    </div>

                </div>

            </td>

            <td>${employee.id}</td>

            <td>${employee.department}</td>

            <td>${employee.designation}</td>

            <td>${formatDate(employee.joiningDate)}</td>

            <td>

                <span class="status status-active">
                    ${employee.status}
                </span>

            </td>

        `;


        table.appendChild(row);

    });

}


// ===============================
// SEARCH EMPLOYEES
// ===============================

function searchEmployees() {

    const search =
        document.getElementById("employeeSearch")
        .value
        .toLowerCase();


    const filtered =
        employees.filter(function(employee) {

            return (

                employee.firstName
                    .toLowerCase()
                    .includes(search)

                ||

                employee.lastName
                    .toLowerCase()
                    .includes(search)

                ||

                employee.email
                    .toLowerCase()
                    .includes(search)

                ||

                employee.department
                    .toLowerCase()
                    .includes(search)

            );

        });


    renderEmployees(filtered);

}


// ===============================
// FILTER EMPLOYEES
// ===============================

function filterEmployees(department) {

    if (department === "all") {

        renderEmployees(employees);

        return;

    }


    const filtered =
        employees.filter(function(employee) {

            return employee.department === department;

        });


    renderEmployees(filtered);

}


// ===============================
// ADD EMPLOYEE MODAL
// ===============================

function openEmployeeModal() {

    document
        .getElementById("employeeModal")
        .classList.add("
