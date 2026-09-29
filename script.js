/* ================= DATA LAYER ================= */
const KEY = "hrms_db_v1";

const SEED = {
  users: [
    { id: 1, email: "admin@demo.com", password: "admin123", role: "admin", empId: 1 },
    { id: 2, email: "hr@demo.com", password: "hr123", role: "hr", empId: 2 },
    { id: 3, email: "emp@demo.com", password: "emp123", role: "employee", empId: 3 },
  ],
  employees: [
    { id: 1, code: "E001", name: "Asha Rao", dept: "Management", title: "Director", email: "admin@demo.com", phone: "9000000001", joinDate: "2020-01-10" },
    { id: 2, code: "E002", name: "Ravi Kumar", dept: "HR", title: "HR Manager", email: "hr@demo.com", phone: "9000000002", joinDate: "2021-03-15" },
    { id: 3, code: "E003", name: "Meena Iyer", dept: "Engineering", title: "Developer", email: "emp@demo.com", phone: "9000000003", joinDate: "2022-07-01" },
  ],
  leaveTypes: [
    { id: "CL", name: "Casual Leave", perYear: 12 },
    { id: "SL", name: "Sick Leave", perYear: 10 },
    { id: "PL", name: "Privilege Leave", perYear: 15 },
  ],
  leaves: [],
  attendance: [],
  holidays: [
    { date: "2026-10-02", name: "Gandhi Jayanti" },
    { date: "2026-11-08", name: "Diwali" },
    { date: "2026-12-25", name: "Christmas" },
  ],
};

let db = JSON.parse(localStorage.getItem(KEY) || "null");
if (!db) { db = JSON.parse(JSON.stringify(SEED)); save(); }

function save() { localStorage.setItem(KEY, JSON.stringify(db)); }
function nextId(arr) { return arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1; }

/* ================= HELPERS ================= */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const nowTime = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const empById = (id) => db.employees.find((e) => e.id === id);
const empName = (id) => (empById(id) ? empById(id).name : "Unknown");
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000) + 1;
const badge = (s) => `<span class="badge ${esc(s)}">${esc(s)}</span>`;

let me = null;
const canManage = () => me && (me.role === "admin" || me.role === "hr");

/* ================= AUTH ================= */
function login(e) {
  e.preventDefault();
  const email = $("#email").value.trim().toLowerCase();
  const pw = $("#password").value;
  const user = db.users.find((u) => u.email === email && u.password === pw);
  if (!user) { $("#login-error").textContent = "Invalid email or password"; return; }
  sessionStorage.setItem("hrms_uid", user.id);
  startApp();
}

function logout() {
  sessionStorage.removeItem("hrms_uid");
  location.reload();
}

function startApp() {
  const uid = Number(sessionStorage.getItem("hrms_uid"));
  me = db.users.find((u) => u.id === uid);
  if (!me) return;
  $("#login-view").classList.add("hidden");
  $("#app-view").classList.remove("hidden");
  $("#user-info").textContent = `${empName(me.empId)} (${me.role})`;
  go("dashboard");
}

/* ================= ROUTER ================= */
const PAGES = {
  dashboard: { label: "Dashboard", render: renderDashboard },
  employees: { label: "Employees", render: renderEmployees },
  attendance: { label: "Attendance", render: renderAttendance },
  leave: { label: "Leave", render: renderLeave },
};

function go(page) {
  $("#nav").innerHTML = Object.keys(PAGES)
    .map((k) => `<a class="${k === page ? "active" : ""}" onclick="go('${k}')">${PAGES[k].label}</a>`)
    .join("");
  $("#page-title").textContent = PAGES[page].label;
  PAGES[page].render();
}

/* ================= MODAL ================= */
function openModal(title, bodyHtml, onSubmit) {
  $("#modal-title").textContent = title;
  $("#modal-form-body").innerHTML = bodyHtml;
  $("#modal").classList.remove("hidden");
  $("#modal-form").onsubmit = (ev) => {
    ev.preventDefault();
    onSubmit(Object.fromEntries(new FormData(ev.target)));
    closeModal();
  };
}
function closeModal() { $("#modal").classList.add("hidden"); }

/* ================= DASHBOARD ================= */
function renderDashboard() {
  const t = today();
  const presentToday = db.attendance.filter((a) => a.date === t).length;
  const pending = db.leaves.filter((l) => l.status === "pending").length;
  const myPending = db.leaves.filter((l) => l.empId === me.empId && l.status === "pending").length;
  const upcoming = db.holidays.filter((h) => h.date >= t).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  $("#content").innerHTML = `
    <div class="grid">
      <div class="card stat"><div class="muted">Total employees</div><div class="num">${db.employees.length}</div></div>
      <div class="card stat"><div class="muted">Present today</div><div class="num">${presentToday}</div></div>
      <div class="card stat"><div class="muted">${canManage() ? "Pending leave requests" : "My pending requests"}</div><div class="num">${canManage() ? pending : myPending}</div></div>
    </div>
    <div class="card">
      <h3>Upcoming holidays</h3>
      ${upcoming.length
        ? `<table><tbody>${upcoming.map((h) => `<tr><td>${esc(h.date)}</td><td>${esc(h.name)}</td></tr>`).join("")}</tbody></table>`
        : '<p class="muted">No upcoming holidays.</p>'}
    </div>`;
}

/* ================= EMPLOYEES ================= */
let empQuery = "";

function renderEmployees() {
  $("#content").innerHTML = `
    <div class="toolbar">
      <input placeholder="Search name, department, code..." value="${esc(empQuery)}" oninput="empQuery=this.value; renderEmpRows()" />
      ${canManage() ? '<button class="primary" onclick="empForm()">+ Add employee</button>' : ""}
    </div>
    <div class="card table-wrap">
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Department</th><th>Title</th><th>Email</th><th>Phone</th><th>Joined</th>${canManage() ? "<th></th>" : ""}</tr></thead>
        <tbody id="emp-rows"></tbody>
      </table>
    </div>`;
  renderEmpRows();
}

function renderEmpRows() {
  const q = empQuery.toLowerCase();
  const rows = db.employees.filter((e) => [e.name, e.dept, e.code, e.title].join(" ").toLowerCase().includes(q));
  $("#emp-rows").innerHTML = rows.length
    ? rows.map((e) => `
      <tr>
        <td>${esc(e.code)}</td><td>${esc(e.name)}</td><td>${esc(e.dept)}</td><td>${esc(e.title)}</td>
        <td>${esc(e.email)}</td><td>${esc(e.phone)}</td><td>${esc(e.joinDate)}</td>
        ${canManage() ? `<td><button onclick="empForm(${e.id})">Edit</button><button class="danger" onclick="deleteEmp(${e.id})">Delete</button></td>` : ""}
      </tr>`).join("")
    : '<tr><td colspan="8" class="muted">No employees found.</td></tr>';
}

function empForm(id) {
  const e = id ? empById(id) : { name: "", code: "", dept: "", title: "", email: "", phone: "", joinDate: today() };
  const f = (label, name, type = "text") =>
    `<label>${label}<input name="${name}" type="${type}" value="${esc(e[name])}" required /></label>`;
  openModal(id ? "Edit employee" : "Add employee",
    f("Full name", "name") + f("Employee code", "code") + f("Department", "dept") + f("Job title", "title") +
    f("Email", "email", "email") + f("Phone", "phone") + f("Join date", "joinDate", "date"),
    (data) => {
      if (id) {
        Object.assign(empById(id), data);
      } else {
        const emp = { id: nextId(db.employees), ...data };
        db.employees.push(emp);
        // demo login for the new employee (default password: welcome123)
        db.users.push({ id: nextId(db.users), email: data.email.toLowerCase(), password: "welcome123", role: "employee", empId: emp.id });
      }
      save();
      renderEmployees();
    });
}

function deleteEmp(id) {
  if (id === me.empId) { alert("You can't delete your own record."); return; }
  if (!confirm("Delete this employee and their login?")) return;
  db.employees = db.employees.filter((e) => e.id !== id);
  db.users = db.users.filter((u) => u.empId !== id);
  db.attendance = db.attendance.filter((a) => a.empId !== id);
  db.leaves = db.leaves.filter((l) => l.empId !== id);
  save();
  renderEmployees();
}

/* ================= ATTENDANCE ================= */
function renderAttendance() {
  const t = today();
  const mine = db.attendance.find((a) => a.empId === me.empId && a.date === t);
  const rows = db.attendance
    .filter((a) => canManage() || a.empId === me.empId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, 60);

  $("#content").innerHTML = `
    <div class="card">
      <h3>Today (${t})</h3>
      <p>${mine ? `Checked in at <strong>${esc(mine.in)}</strong>${mine.out ? `, checked out at <strong>${esc(mine.out)}</strong>` : ""}` : "You haven't checked in yet."}</p>
      <button class="primary" ${mine ? "disabled" : ""} onclick="checkIn()">Check in</button>
      <button ${!mine || mine.out ? "disabled" : ""} onclick="checkOut()">Check out</button>
    </div>
    <div class="card table-wrap">
      <h3>${canManage() ? "Recent attendance (all employees)" : "My recent attendance"}</h3>
      <table>
        <thead><tr><th>Date</th>${canManage() ? "<th>Employee</th>" : ""}<th>In</th><th>Out</th></tr></thead>
        <tbody>${rows.map((a) => `<tr><td>${esc(a.date)}</td>${canManage() ? `<td>${esc(empName(a.empId))}</td>` : ""}<td>${esc(a.in)}</td><td>${esc(a.out || "-")}</td></tr>`).join("") || '<tr><td colspan="4" class="muted">No records yet.</td></tr>'}</tbody>
      </table>
    </div>`;
}

function checkIn() {
  db.attendance.push({ id: nextId(db.attendance), empId: me.empId, date: today(), in: nowTime(), out: "" });
  save();
  renderAttendance();
}

function checkOut() {
  const rec = db.attendance.find((a) => a.empId === me.empId && a.date === today());
  if (rec) { rec.out = nowTime(); save(); }
  renderAttendance();
}

/* ================= LEAVE ================= */
function leaveBalance(empId, typeId) {
  const type = db.leaveTypes.find((t) => t.id === typeId);
  const used = db.leaves
    .filter((l) => l.empId === empId && l.type === typeId && l.status === "approved")
    .reduce((sum, l) => sum + l.days, 0);
  return type.perYear - used;
}

function renderLeave() {
  const mine = db.leaves.filter((l) => l.empId === me.empId).sort((a, b) => b.id - a.id);
  const pending = db.leaves.filter((l) => l.status === "pending");

  $("#content").innerHTML = `
    <div class="grid">
      ${db.leaveTypes.map((t) => `<div class="card stat"><div class="muted">${esc(t.name)} balance</div><div class="num">${leaveBalance(me.empId, t.id)}</div></div>`).join("")}
    </div>
    <div class="card">
      <h3>Apply for leave</h3>
      <form onsubmit="applyLeave(event)">
        <label>Type <select name="type">${db.leaveTypes.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select></label>
        <label>From <input type="date" name="from" required /></label>
        <label>To <input type="date" name="to" required /></label>
        <label>Reason <textarea name="reason" rows="2" required></textarea></label>
        <button class="primary" type="submit">Submit request</button>
      </form>
    </div>
    <div class="card table-wrap">
      <h3>My requests</h3>
      <table>
        <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead>
        <tbody>${mine.map((l) => `<tr><td>${esc(l.type)}</td><td>${esc(l.from)}</td><td>${esc(l.to)}</td><td>${l.days}</td><td>${esc(l.reason)}</td><td>${badge(l.status)}</td></tr>`).join("") || '<tr><td colspan="6" class="muted">No requests yet.</td></tr>'}</tbody>
      </table>
    </div>
    ${canManage() ? `
    <div class="card table-wrap">
      <h3>Pending approvals</h3>
      <table>
        <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th></th></tr></thead>
        <tbody>${pending.map((l) => `<tr><td>${esc(empName(l.empId))}</td><td>${esc(l.type)}</td><td>${esc(l.from)}</td><td>${esc(l.to)}</td><td>${l.days}</td><td>${esc(l.reason)}</td>
          <td><button onclick="decideLeave(${l.id}, 'approved')">Approve</button><button class="danger" onclick="decideLeave(${l.id}, 'rejected')">Reject</button></td></tr>`).join("") || '<tr><td colspan="7" class="muted">Nothing pending.</td></tr>'}</tbody>
      </table>
    </div>` : ""}`;
}

function applyLeave(e) {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  if (d.to < d.from) { alert("End date can't be before start date."); return; }
  const days = daysBetween(d.from, d.to);
  if (days > leaveBalance(me.empId, d.type)) { alert("Not enough leave balance for this type."); return; }
  db.leaves.push({ id: nextId(db.leaves), empId: me.empId, type: d.type, from: d.from, to: d.to, days, reason: d.reason, status: "pending" });
  save();
  renderLeave();
}

function decideLeave(id, status) {
  const l = db.leaves.find((x) => x.id === id);
  if (l) { l.status = status; save(); }
  renderLeave();
}

/* ================= INIT ================= */
if (sessionStorage.getItem("hrms_uid")) startApp();
