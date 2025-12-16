const tableBody = document.getElementById("userTableBody");

function createRow(user) {
  const tr = document.createElement("tr");
  tr.setAttribute("data-user-id", user.id || "");
  tr.innerHTML = `
    <td>${user.id ?? ""}</td>
    <td>${user.name}</td>
    <td>${user.username}</td>
    <td>${user.email}</td>
    <td>${user.phone}</td>
    <td>${user.website}</td>
    <td class="actions-cell">
      <button class="btn-edit" data-id="${user.id || ""}" title="Edit"><i class="fas fa-edit"></i></button>
      <button class="btn-delete" data-id="${user.id || ""}" title="Delete"><i class="fas fa-trash"></i></button>
    </td>
  `;
  return tr;
}

function renderUsers(users) {
  tableBody.innerHTML = "";

  if (users.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" class="muted">No users found.</td></tr>';
    return;
  }

  users.forEach((user) => {
    const row = createRow(user);
    tableBody.appendChild(row);
    attachRowEvents(row);
  });
}

function addUserRow(user) {
  const row = createRow(user);
  tableBody.appendChild(row);
  attachRowEvents(row);
}

function updateUserRow(userId, user) {
  const row = tableBody.querySelector(`tr[data-user-id="${userId}"]`);
  if (row) {
    const newRow = createRow(user);
    row.replaceWith(newRow);
    attachRowEvents(newRow);
  }
}

function removeUserRow(userId) {
  const row = tableBody.querySelector(`tr[data-user-id="${userId}"]`);
  if (row) {
    row.remove();
  }
}

function attachRowEvents(row) {
  const editBtn = row.querySelector(".btn-edit");
  const deleteBtn = row.querySelector(".btn-delete");
  
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const userId = editBtn.getAttribute("data-id");
      const user = {
        id: userId,
        name: row.cells[1].textContent,
        username: row.cells[2].textContent,
        email: row.cells[3].textContent,
        phone: row.cells[4].textContent,
        website: row.cells[5].textContent,
      };
      if (typeof startEditUser === "function") {
        startEditUser(user);
      }
    });
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      const userId = deleteBtn.getAttribute("data-id");
      if (typeof handleDeleteUser === "function") {
        handleDeleteUser(userId);
      }
    });
  }
}
