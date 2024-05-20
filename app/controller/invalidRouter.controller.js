function invalidRouter(req, res) {
    res.json({
        isSuccess: false,
        message: "Invalid Router",
        data: {},
    });
}

module.exports = { invalidRouter };
