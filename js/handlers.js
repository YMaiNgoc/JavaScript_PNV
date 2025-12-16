const form = document.getElementById("userForm");
const status = document.getElementById("formStatus");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalOverlay = document.getElementById("modalOverlay");

let editingUserId = null;

function openModal(isEdit = false) {
  if (!modalOverlay) return;
  if (!isEdit) {
    resetFormMode(false);
  }
  modalOverlay.classList.add("show");
}

function closeModal() {
  if (!modalOverlay) return;
  resetFormMode(false);
  modalOverlay.classList.remove("show");
}

function resetFormMode(hideModal = true) {
  editingUserId = null;
  formTitle.textContent = "Add User";
  submitBtn.textContent = "Create";
  form.reset();
  status.textContent = "";
  status.style.color = "";
  if (hideModal && modalOverlay) {
    modalOverlay.classList.remove("show");
  }
}

function setEditMode(user) {
  editingUserId = user.id;
  formTitle.textContent = `Edit User #${user.id}`;
  submitBtn.textContent = "Save Changes";
  
  form.name.value = user.name || "";
  form.username.value = user.username || "";
  form.email.value = user.email || "";
  form.phone.value = user.phone || "";
  form.website.value = user.website || "";
  
  status.textContent = "";
  status.style.color = "";
}

cancelBtn.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);
openModalBtn.addEventListener("click", () => openModal(false));

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

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
      closeModal();
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
      closeModal();
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
  openModal(true);
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
