```javascript
/* =========================================================
   HRMS360 - JAVASCRIPT
   ========================================================= */


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

const menuItems = document.querySelectorAll(".menu-item");
const sections = document.querySelectorAll(".page-section");

const pageTitles = {
    dashboard: {
        title: "Dashboard",
        subtitle: "Welcome back! Here's what's happening today."
    },

    employees: {
        title: "Employees",
        subtitle: "Manage your organization's employees."
    },

    attendance: {
        title: "Attendance",
        subtitle: "Track employee attendance and working hours."
    },

    leave: {
        title: "Leave Management",
        subtitle: "Manage employee leave requests and balances."
    },

    recruitment: {
        title: "Recruitment",
        subtitle: "Manage job openings and candidates."
    },

    onboarding: {
        title: "Onboarding",
        subtitle: "Track onboarding activities for new employees."
    },

    performance: {
        title: "Performance",
        subtitle: "Track employee goals and performance reviews."
    },

    payroll: {
        title: "Payroll",
        subtitle: "Manage employee salary information and payslips."
    },

    expenses: {
        title: "Expenses",
        subtitle: "Manage employee expense claims."
    },

    reports: {
        title: "Reports",
        subtitle: "View and download HR reports."
    },

    settings: {
        title: "Settings",
        subtitle: "Configure your HRMS portal."
    }
};


function showSection(sectionId) {

    sections.forEach(section => {
        section.classList.remove("active-section");
    });

    menuItems.forEach(item => {
        item.classList.remove("active");
    });

    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
        targetSection.classList.add("active-section");
    }

    const activeMenu = document.querySelector(
        `.menu-item[data-section="${sectionId}"]`
    );

    if (activeMenu) {
        activeMenu.classList.add("active");
    }

    if (pageTitles[sectionId]) {

        document.getElementById("pageTitle").textContent =
            pageTitles[sectionId].title;

        document.getElementById("pageSubtitle").textContent =
            pageTitles[sectionId].subtitle;
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    /* Close mobile sidebar */

    document.getElementById("sidebar").classList.remove("open");
}


menuItems.forEach(item => {

    item.addEventListener("click", function(event) {

        event.preventDefault();

        const section = this.dataset.section;

        showSection(section);

    });

});


/* =========================================================
   DASHBOARD "VIEW ALL" LINKS
   ========================================================= */

document.querySelectorAll("[data-section-link]").forEach(button => {

    button.addEventListener("click", function() {

        const section = this.dataset.sectionLink;

        showSection(section);

    });

});


/* =========================================================
   CURRENT DATE
   ========================================================= */

function updateDate() {

    const dateElement = document.getElementById("currentDate");

    if (!dateElement) {
        return;
    }

    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    dateElement.textContent =
        today.toLocaleDateString("en-IN", options);
}


updateDate();


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

const mobileMenu = document.getElementById("mobileMenu");

if (mobileMenu) {

    mobileMenu.addEventListener("click", function() {

        document
            .getElementById("sidebar")
            .classList.toggle("open");

    });

}


/* =========================================================
   ATTENDANCE CHART
   ========================================================= */

const attendanceCanvas =
    document.getElementById("attendanceChart");


if (attendanceCanvas && typeof Chart !== "undefined") {

    new Chart(attendanceCanvas, {

        type: "line",

        data: {

            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep"
            ],

            datasets: [

                {
                    label: "Present",

                    data: [
                        91,
                        89,
                        92,
                        90,
                        94,
                        93,
                        91,
                        95,
                        89
                    ],

                    borderWidth: 2,

                    tension: 0.4,

                    fill: false
                },

                {
                    label: "Absent",

                    data: [
                        5,
                        6,
                        4,
                        6,
                        3,
                        4,
                        5,
                        3,
                        7
                    ],

                    borderWidth: 2,

                    tension: 0.4,

                    fill: false
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "bottom",

                    labels: {
                        boxWidth: 10,
                        font: {
                            size: 10
                        }
                    }
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100,

                    ticks: {
                        callback: function(value) {
                            return value + "%";
                        },

                        font: {
                            size: 10
                        }
                    },

                    grid: {
                        color: "#eef2f7"
                    }

                },

                x: {

                    ticks: {
                        font: {
                            size: 10
                        }
                    },

                    grid: {
                        display: false
                    }

                }

            }

        }

    });

}


/* =========================================================
   EMPLOYEE MODAL
   ========================================================= */

const employeeModal =
    document.getElementById("employeeModal");

const addEmployeeBtn =
    document.getElementById("addEmployeeBtn");


if (addEmployeeBtn) {

    addEmployeeBtn.addEventListener("click", function() {

        employeeModal.classList.add("show");

    });

}


/* =========================================================
   LEAVE MODAL
   ========================================================= */

const leaveModal =
    document.getElementById("leaveModal");

const applyLeaveBtn =
    document.getElementById("applyLeaveBtn");


if (applyLeaveBtn) {

    applyLeaveBtn.addEventListener("click", function() {

        leaveModal.classList.add("show");

    });

}


/* =========================================================
   CLOSE MODALS
   ========================================================= */

document.querySelectorAll("[data-close]").forEach(button => {

    button.addEventListener("click", function() {

        const modalId = this.dataset.close;

        const modal = document.getElementById(modalId);

        if (modal) {
            modal.classList.remove("show");
        }

    });

});


/* Close modal when clicking outside */

document.querySelectorAll(".modal-overlay").forEach(overlay => {

    overlay.addEventListener("click", function(event) {

        if (event.target === overlay) {

            overlay.classList.remove("show");

        }

    });

});


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(function() {

        toast.classList.remove("show");

    }, 3000);
}


/* =========================================================
   ADD EMPLOYEE
   ========================================================= */

const employeeForm =
    document.getElementById("employeeForm");


if (employeeForm) {

    employeeForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const firstName =
            document.getElementById("firstName").value.trim();

        const lastName =
            document.getElementById("lastName").value.trim();

        const department =
            document.getElementById("department").value;

        const designation =
            document.getElementById("designation").value.trim();

        const joiningDate =
            document.getElementById("joiningDate").value;


        if (!firstName || !lastName || !department || !designation) {

            showToast("Please fill all required fields.");

            return;

        }


        const employeeName =
            `${firstName} ${lastName}`;

        const initials =
            (firstName.charAt(0) + lastName.charAt(0))
            .toUpperCase();


        const employeeTableBody =
            document.getElementById("employeeTableBody");


        const newRow =
            document.createElement("tr");


        let formattedDate = joiningDate;

        if (joiningDate) {

            const date =
                new Date(joiningDate);

            formattedDate =
                date.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                });

        }


        newRow.innerHTML = `

            <td>

                <div class="employee-cell">

                    <div class="table-avatar">
                        ${initials}
                    </div>

                    <div>

                        <strong>
                            ${employeeName}
                        </strong>

                        <small>
                            EMP${Math.floor(Math.random() * 900 + 100)}
                        </small>

                    </div>

                </div>

            </td>


            <td>
                ${department}
            </td>


            <td>
                ${designation}
            </td>


            <td>
                ${formattedDate}
            </td>


            <td>

                <span class="status active">
                    Active
                </span>

            </td>


            <td>

                <button class="action-button">

                    <i class="fa-solid fa-ellipsis"></i>

                </button>

            </td>
        `;


        employeeTableBody.appendChild(newRow);


        employeeForm.reset();

        employeeModal.classList.remove("show");


        showToast(
            `${employeeName} added successfully.`
        );


        /* Update employee count */

        const totalEmployees =
            document.getElementById("totalEmployees");

        if (totalEmployees) {

            const current =
                parseInt(totalEmployees.textContent);

            totalEmployees.textContent =
                current + 1;

        }

    });

}


/* =========================================================
   LEAVE FORM
   ========================================================= */

const leaveForm =
    document.getElementById("leaveForm");


if (leaveForm) {

    leaveForm.addEventListener("submit", function(event) {

        event.preventDefault();

        leaveForm.reset();

        leaveModal.classList.remove("show");

        showToast(
            "Leave request submitted successfully."
        );

    });

}


/* =========================================================
   EMPLOYEE SEARCH
   ========================================================= */

const employeeSearch =
    document.getElementById("employeeSearch");


if (employeeSearch) {

    employeeSearch.addEventListener("input", function() {

        const searchValue =
            this.value.toLowerCase();

        const rows =
            document.querySelectorAll(
                "#employeeTableBody tr"
            );


        rows.forEach(row => {

            const text =
                row.textContent.toLowerCase();

            if (text.includes(searchValue)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });

}


/* =========================================================
   DEPARTMENT FILTER
   ========================================================= */

const departmentFilter =
    document.getElementById("departmentFilter");


if (departmentFilter) {

    departmentFilter.addEventListener("change", function() {

        const selectedDepartment =
            this.value.toLowerCase();

        const rows =
            document.querySelectorAll(
                "#employeeTableBody tr"
            );


        rows.forEach(row => {

            const rowDepartment =
                row.children[1]
                    .textContent
                    .trim()
                    .toLowerCase();


            if (
                selectedDepartment === "" ||
                rowDepartment === selectedDepartment
            ) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });

}


/* =========================================================
   GLOBAL SEARCH
   ========================================================= */

const globalSearch =
    document.getElementById("globalSearch");


if (globalSearch) {

    globalSearch.addEventListener("input", function() {

        const searchValue =
            this.value.toLowerCase().trim();


        if (!searchValue) {
            return;
        }


        const employeeSection =
            document.getElementById("employees");


        const employeeRows =
            document.querySelectorAll(
                "#employeeTableBody tr"
            );


        let found = false;


        employeeRows.forEach(row => {

            const text =
                row.textContent.toLowerCase();


            if (text.includes(searchValue)) {

                found = true;

            }

        });


        if (found) {

            showSection("employees");

            if (employeeSearch) {

                employeeSearch.value =
                    searchValue;

                employeeSearch.dispatchEvent(
                    new Event("input")
                );

            }

        }

    });

}


/* =========================================================
   LEAVE APPROVE / REJECT
   ========================================================= */

document.addEventListener("click", function(event) {

    if (
        event.target.classList.contains("approve") ||
        event.target.closest(".approve")
    ) {

        const button =
            event.target.closest(".approve");

        const row =
            button.closest("tr");

        const status =
            row.querySelector(".status");

        status.textContent = "Approved";

        status.className =
            "status approved";

        button.remove();

        const rejectButton =
            row.querySelector(".reject");

        if (rejectButton) {
            rejectButton.remove();
        }

        showToast(
            "Leave request approved."
        );

    }


    if (
        event.target.classList.contains("reject") ||
        event.target.closest(".reject")
    ) {

        const button =
            event.target.closest(".reject");

        const row =
            button.closest("tr");

        const status =
            row.querySelector(".status");

        status.textContent = "Rejected";

        status.className =
            "status rejected";

        button.remove();

        const approveButton =
            row.querySelector(".approve");

        if (approveButton) {
            approveButton.remove();
        }

        showToast(
            "Leave request rejected."
        );

    }

});


/* =========================================================
   NOTIFICATION BUTTON
   ========================================================= */

const notificationButton =
    document.querySelector(".notification-btn");


if (notificationButton) {

    notificationButton.addEventListener("click", function() {

        showToast(
            "You have 3 new notifications."
        );

    });

}


/* =========================================================
   REPORT BUTTONS
   ========================================================= */

document.querySelectorAll(".report-card .outline-button")
    .forEach(button => {

        button.addEventListener("click", function() {

            showToast(
                "Report generation is available in the prototype."
            );

        });

    });


/* =========================================================
   INITIALIZATION
   ========================================================= */

console.log(
    "HRMS360 frontend loaded successfully."
);
```
