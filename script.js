// SELECT ELEMENTS
const form = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("search");

// LOAD DATA
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let editIndex = null;

// DISPLAY JOBS
function displayJobs(data = jobs) {
  jobList.innerHTML = "";

  if (data.length === 0) {
    jobList.innerHTML = `
  <div style="text-align:center;color:#777;">
    <p>No applications yet</p>
    <small>Start by adding your first job 🚀</small>
  </div>
`;
    return;
  }

  data.forEach((job, index) => {
    const div = document.createElement("div");
    div.classList.add("job");

    const statusColor =
  job.status === "Applied" ? "#6b7280" :
  job.status === "Interview" ? "#3b82f6" :
  job.status === "Offer" ? "#10b981" :
  "#ef4444";

div.innerHTML = `
  <h3>${job.company}</h3>
  <p><strong>${job.role}</strong></p>

  <span style="
    background:${statusColor};
    color:white;
    padding:4px 8px;
    border-radius:5px;
    font-size:12px;
  ">
    ${job.status}
  </span>

  <p>${job.notes || ""}</p>
  <p><small>Applied on: ${job.date || "N/A"}</small></p>

  <button onclick="editJob(${index})">Edit</button>
  <button onclick="deleteJob(${index})">Delete</button>
`;

    jobList.appendChild(div);
  });

  updateDashboard();
}

// ADD OR UPDATE JOB
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const job = {
  company: document.getElementById("company").value,
  role: document.getElementById("role").value,
  status: document.getElementById("status").value,
  notes: document.getElementById("notes").value,
  date: new Date().toLocaleDateString()
};

  // VALIDATION
  if (!job.company || !job.role) {
    alert("Please fill in all required fields.");
    return;
  }

  if (editIndex === null) {
    jobs.push(job);
  } else {
    jobs[editIndex] = job;
    editIndex = null;
  }

  saveAndRefresh();
});

// DELETE JOB
function deleteJob(index) {
  if (!confirm("Delete this job?")) return;

  jobs.splice(index, 1);
  saveAndRefresh();
}

// EDIT JOB
function editJob(index) {
  const job = jobs[index];

  document.getElementById("company").value = job.company;
  document.getElementById("role").value = job.role;
  document.getElementById("status").value = job.status;
  document.getElementById("notes").value = job.notes;

  editIndex = index;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// SEARCH FUNCTION
searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const filtered = jobs.filter(job =>
    job.company.toLowerCase().includes(value) ||
    job.role.toLowerCase().includes(value)
  );

  displayJobs(filtered);
});

// DASHBOARD
function updateDashboard() {
  document.getElementById("total").textContent = jobs.length;

  document.getElementById("interview").textContent =
    jobs.filter(j => j.status === "Interview").length;

  document.getElementById("offer").textContent =
    jobs.filter(j => j.status === "Offer").length;

  document.getElementById("rejected").textContent =
    jobs.filter(j => j.status === "Rejected").length;
}

// SAVE + REFRESH
function saveAndRefresh() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
  form.reset();
  displayJobs();
}

// INITIAL LOAD
displayJobs();
