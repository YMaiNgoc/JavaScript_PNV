async function init() {
  const users = await fetchUsers();
  renderUsers(users);
}

document.getElementById("reloadBtn").addEventListener("click", init);

init();
