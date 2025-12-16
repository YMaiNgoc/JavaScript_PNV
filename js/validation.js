function validateUser(user) {
  if (!user.name || !user.username) return "Name & Username required";
  if (!/^\S+@\S+\.\S+$/.test(user.email)) return "Invalid email";
  if (!/^[0-9\-+ ]+$/.test(user.phone)) return "Invalid phone";
  return null;
}
