module.exports = {
	createFunction: (file) => ({
		default: (request) => {
			const params = [...new URL(request.url).searchParams.entries()];

			return Promise.resolve(new Response(JSON.stringify({ file, params }), { status: 200 }));
		},
	}),
};
