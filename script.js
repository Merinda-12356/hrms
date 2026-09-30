```javascript
/* =========================================
   HRMS360
   Main JavaScript
   Frontend Only
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       ELEMENTS
       ===================================== */

    const navItems = document.querySelectorAll(".nav-item");
    const pageSections = document.querySelectorAll(".page-section");
    const pageTitle = document.getElementById("pageTitle");
    const pageSubtitle = document.getElementById("pageSubtitle");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebar = document.getElementById("sidebar");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");


    /* =====================================
       PAGE INFORMATION
       ===================================== */

    const pageInformation = {

        dashboard: {
            title: "Dashboard",
            subtitle: "Welcome to HRMS360"
        },

        employees: {
            title: "Employees",
            subtitle: "Manage your organization's employees."
        },

        attendance: {
            title: "Attendance",
            subtitle: "Monitor daily employee attendance."
        },

        leave: {
            title: "Leave Management",
            subtitle: "Manage employee leave requests."
        },

        recruitment: {
            title: "Recruitment",
            subtitle: "Manage your recruitment pipeline."
        },

        onboarding: {
            title: "Onboarding",
            subtitle: "Track new employee onboarding."
        },

        performance: {
            title: "Performance",
            subtitle: "Track employee performance and reviews."
        },

        payroll: {
            title: "Payroll",
            subtitle: "Manage employee payroll information."
        },

        expenses: {
            title: "Expenses",
            subtitle: "Manage employee expense claims."
        },

        reports: {
            title: "Reports & Analytics",
            subtitle: "View HR insights and organizational reports."
        },

        settings: {
            title: "Settings",
            subtitle: "Configure your HRMS portal."
        }

    };


    /* =====================================
       SHOW TOAST
       ===================================== */

    function showToast(message) {

        if (!toast || !toastMessage) {
            return;
        }

        toastMessage.textContent = message;

        toast.classList.add("show");

        setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);

    }


    /* =====================================
       OPEN PAGE
       ===================================== */

    function openPage(pageName) {

        const targetPage = document.getElementById(pageName);

        if (!targetPage) {
            console.warn("Page not found:", pageName);
            return;
        }


        /* Hide all pages */

        pageSections.forEach(function (section) {

            section.classList.remove("active");

        });


        /* Show selected page */

        targetPage.classList.add("active");


        /* Remove active state */

        navItems.forEach(function (item) {

            item.classList.remove("active");

        });


        /* Add active state */

        const activeNav = document.querySelector(
            `.nav-item[data-page="${pageName}"]`
        );

        if (activeNav) {

            activeNav.classList.add("active");

        }


        /* Update header */

        if (pageInformation[pageName]) {

            pageTitle.textContent =
                pageInformation[pageName].title;

            pageSubtitle.textContent =
                pageInformation[pageName].subtitle;

        }


        /* Update browser URL */

        history.replaceState(
            null,
            "",
            "#" + pageName
        );


        /* Close mobile sidebar */

        if (sidebar) {

            sidebar.classList.remove("open");

        }


        /* Scroll to top */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================
       SIDEBAR NAVIGATION
       ===================================== */

    navItems.forEach(function (item) {

        item.addEventListener("click", function (event) {

            event.preventDefault();

            const pageName =
                this.getAttribute("data-page");

            if (pageName) {

                openPage(pageName);

            }

        });

    });


    /* =====================================
       INTERNAL PAGE LINKS
       ===================================== */

    const pageLinks =
        document.querySelectorAll("[data-page-link]");


    pageLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const pageName =
                this.getAttribute("data-page-link");

            if (pageName) {

                openPage(pageName);

            }

        });

    });


    /* =====================================
       MOBILE MENU
       ===================================== */

    if (mobileMenu) {

        mobileMenu.addEventListener("click", function () {

            sidebar.classList.toggle("open");

        });

    }


    /* =====================================
       DATE & TIME
       ===================================== */

    function updateDateTime() {

        const dateElement =
            document.getElementById("currentDate");

        const timeElement =
            document.getElementById("currentTime");


        const now = new Date();


        if (dateElement) {

            dateElement.textContent =
                now.toLocaleDateString(
                    "en-IN",
                    {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );

        }


        if (timeElement) {

            timeElement.textContent =
                now.toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        }

    }


    updateDateTime();

    setInterval(updateDateTime, 1000);


    /* =====================================
       EMPLOYEE SEARCH
       ===================================== */

    const employeeSearch =
        document.getElementById("employeeSearch");


    if (employeeSearch) {

        employeeSearch.addEventListener(
            "input",
            function () {

                const searchValue =
                    this.value.toLowerCase().trim();

                const rows =
                    document.querySelectorAll(
                        "#employeeTable tbody tr"
                    );


                rows.forEach(function (row) {

                    const rowText =
                        row.textContent.toLowerCase();

                    if (
                        rowText.includes(searchValue)
                    ) {

                        row.style.display = "";

                    } else {

                        row.style.display = "none";

                    }

                });

            }
        );

    }


    /* =====================================
       NOTIFICATION
       ===================================== */

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function () {

                showToast(
                    "You have 3 pending notifications."
                );

            }
        );

    }


    /* =====================================
       ADD EMPLOYEE
       ===================================== */

    const addEmployeeButton =
        document.getElementById(
            "addEmployeeButton"
        );


    if (addEmployeeButton) {

        addEmployeeButton.addEventListener(
            "click",
            function () {

                showToast(
                    "Employee form will be added in the next version."
                );

            }
        );

    }


    /* =====================================
       REPORT BUTTON
       ===================================== */

    const reportButton =
        document.getElementById("reportButton");


    if (reportButton) {

        reportButton.addEventListener(
            "click",
            function () {

                showToast(
                    "Report generation will be connected later."
                );

            }
        );

    }


    /* =====================================
       APPROVE / REJECT LEAVE
       ===================================== */

    const approveButtons =
        document.querySelectorAll(
            ".approve-button"
        );


    approveButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const request =
                    this.closest(".request-item");

                if (request) {

                    const name =
                        request.querySelector(
                            ".request-info strong"
                        );

                    const employeeName =
                        name
                            ? name.textContent
                            : "Employee";


                    showToast(
                        employeeName +
                        "'s leave request approved."
                    );

                    this.parentElement.remove();

                }

            }
        );

    });


    const rejectButtons =
        document.querySelectorAll(
            ".reject-button"
        );


    rejectButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const request =
                    this.closest(".request-item");

                if (request) {

                    const name =
                        request.querySelector(
                            ".request-info strong"
                        );

                    const employeeName =
                        name
                            ? name.textContent
                            : "Employee";


                    showToast(
                        employeeName +
                        "'s leave request rejected."
                    );

                    request.remove();

                }

            }
        );

    });


    /* =====================================
       GENERIC BUTTONS
       ===================================== */

    const genericButtons =
        document.querySelectorAll(
            ".primary-button, .secondary-button, .report-card"
        );


    genericButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                if (
                    this.id !== "addEmployeeButton" &&
                    this.id !== "reportButton"
                ) {

                    const text =
                        this.textContent.trim();

                    showToast(
                        text +
                        " feature is ready for configuration."
                    );

                }

            }
        );

    });


    /* =====================================
       BROWSER BACK / FORWARD
       ===================================== */

    window.addEventListener(
        "popstate",
        function () {

            const pageName =
                window.location.hash
                    .replace("#", "");

            if (
                pageName &&
                document.getElementById(pageName)
            ) {

                openPage(pageName);

            } else {

                openPage("dashboard");

            }

        }
    );


    /* =====================================
       INITIAL PAGE
       ===================================== */

    const initialPage =
        window.location.hash
            .replace("#", "");


    if (
        initialPage &&
        document.getElementById(initialPage)
    ) {

        openPage(initialPage);

    } else {

        openPage("dashboard");

    }


    console.log(
        "HRMS360 loaded successfully."
    );

});
```
