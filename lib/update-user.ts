export async function updateUser() {
  await fetch("/api/user/update-tries", { method: "POST" });
}