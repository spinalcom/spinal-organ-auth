$(document).ready(function () {
	$("#form").submit(function (e) {
		e.preventDefault();
		const query = formatQueryToObj();
		const data = Object.assign({ userName: $("#username").val(), password: $("#password").val() }, query);

		$.ajax({
			url: "/oauth/authorize",
			type: "POST",
			data: data,
			statusCode: {
				302: function () {
					alerte("Invalid credentials");
				},
			},
			success: function (data) {
				console.log("data", data);
			},
			error: function (error) {
				console.log(error);
			},
		});
	});
});

function formatQueryToObj() {
	const query = window.location.search.substr(1).split("&");

	if (query == "") return {};
	var obj = {};
	for (var i = 0; i < query.length; ++i) {
		var p = query[i].split("=", 2);
		if (p.length == 1) obj[p[0]] = "";
		else obj[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	}
	return obj;
}
