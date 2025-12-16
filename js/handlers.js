const form = document.getElementById("userForm");
const status = document.getElementById("formStatus");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

let editingUserId = null;

// Đảm bảo nút Cancel ẩn khi trang load
if (cancelBtn) {
  cancelBtn.classList.remove("show");
}

function resetFormMode() {
  editingUserId = null;
  formTitle.textContent = "Add User";
  submitBtn.textContent = "Create";
  cancelBtn.classList.remove("show");
  form.reset();
  status.textContent = "";
  status.style.color = "";
}

function setEditMode(user) {
  editingUserId = user.id;
  formTitle.textContent = `Edit User #${user.id}`;
  submitBtn.textContent = "Save Changes";
  cancelBtn.classList.add("show");
  
  form.name.value = user.name || "";
  form.username.value = user.username || "";
  form.email.value = user.email || "";
  form.phone.value = user.phone || "";
  form.website.value = user.website || "";
  
  status.textContent = "";
  status.style.color = "";
}

cancelBtn.addEventListener("click", resetFormMode);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = Object.fromEntries(new FormData(form));
  const error = validateUser(user);

  if (error) {
    status.textContent = error;
    status.style.color = "red";
    return;
  }

  try {
    if (editingUserId) {
      status.textContent = "Updating user...";
      status.style.color = "";
      
      const updated = await updateUser(editingUserId, user);
      const updatedUser = {
        ...user,
        id: editingUserId,
      };

      if (typeof updateUserRow === "function") {
        updateUserRow(editingUserId, updatedUser);
      }

      status.textContent = "User updated successfully (fake API)";
      status.style.color = "green";
      resetFormMode();
    } else {
      status.textContent = "Creating user...";
      status.style.color = "";

      const created = await createUser(user);
      const newUser = {
        ...user,
        id: created.id,
      };

      if (typeof addUserRow === "function") {
        addUserRow(newUser);
      }

      status.textContent = "User created successfully (fake API)";
      status.style.color = "green";
      form.reset();
    }
  } catch (err) {
    status.textContent = editingUserId 
      ? "Error while updating user." 
      : "Error while creating user.";
    status.style.color = "red";
  }
});

function startEditUser(user) {
  setEditMode(user);
  document.querySelector(".card:last-child").scrollIntoView({ 
    behavior: "smooth", 
    block: "nearest" 
  });
}

async function handleDeleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) {
    return;
  }

  try {
    const success = await deleteUser(userId);
    
    if (success && typeof removeUserRow === "function") {
      removeUserRow(userId);
      const statusEl = document.getElementById("status");
      if (statusEl) {
        statusEl.textContent = "User deleted successfully (fake API)";
        statusEl.style.color = "green";
        setTimeout(() => {
          statusEl.textContent = "";
        }, 3000);
      }
    }

    if (editingUserId === userId) {
      resetFormMode();
    }
  } catch (err) {
    alert("Error while deleting user.");
  }
}
