function createInfoFields(req, res, next) {
    let currentDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    let currentTime = new Date().toLocaleTimeString("en-IN", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const currentDateTime = currentDate + "T" + currentTime;

    if (!req.body.created_by) {
        req.body.created_by = req.body.user_email;
        req.body.created_at = currentDateTime;
        req.body.updated_by = [];
        req.body.updated_at = [];
    }
    next();
}

module.exports = {
    createInfoFields,
};
