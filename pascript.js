document.getElementById("admin-login").addEventListener("submit", (event) => {
	event.preventDefault();

	const password = document.getElementById("unpass").value;

	if (password === "9v9v98") {
		window.location.href = "./adminarea.html";
	}
});
