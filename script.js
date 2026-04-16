const form = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("search");

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let editIndex = null;

// DISPLAY JOBS
function displayJobs(data = jobs) {
  jobList.innerHTML = "";

  if (data.length === 0) {
    jobList.innerHTML = "<p>No applications yet.</p>";
    return;
  }

  data.forEach((job, index) => {
    const div = document.createElement("div");
    div.classList.add("job");

    // STATUS COLOR
    let color = "gray";
    if (job.status === "Interview") color = "blue";
    if (job.status === "Offer") color = "green";
    if (job.status === "Rejected") color = "red";

    div.style.borderLeftColor = color;

    div.innerHTML = `
      <strong>${job.company}</strong> - ${job.role}<br>
      Status: ${job.status}<br>
      Notes: ${job.notes || "None"}<br>
      <button onclick="editJob(${index})">Edit</button>
      <button onclick="deleteJob(${index})">Delete</button>
    `;

    jobList.appendChild(div);
  });

  updateDashboard();
}

// ADD / UPDATE JOB
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const job = {
    company: document.getElementById("company").value,
    role: document.getElementById("role").value,
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value
  };

  if (editIndex === null) {
    jobs.push(job);
  } else {
    jobs[editIndex] = job;
    editIndex = null;
  }

  localStorage.setItem("jobs", JSON.stringify(jobs));
  form.reset();
  displayJobs();
});

// DELETE
function deleteJob(index) {
  jobs.splice(index, 1);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  displayJobs();
}

// EDIT
function editJob(index) {
  const job = jobs[index];

  document.getElementById("company").value = job.company;
  document.getElementById("role").value = job.role;
  document.getElementById("status").value = job.status;
  document.getElementById("notes").value = job.notes;

  editIndex = index;
}

// SEARCH
searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const filtered = jobs.filter(job =>
    job.company.toLowerCase().includes(value)
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

// INIT
displayJobs();