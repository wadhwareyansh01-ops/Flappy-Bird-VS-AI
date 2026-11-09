document.getElementById("admin-login").addEventListener("submit", (event) => {
	event.preventDefault();

	const password = document.getElementById("unpass").value;

	if (password === "vishan") {
		window.location.href = "./adminarea.html";
	}
});
