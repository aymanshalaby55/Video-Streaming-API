const SendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        console.log(err)
        res.status(err.statusCode || 500).json({
            status: 'fail',
            error: err,
            message: err.message,
            stack: err.stack,
        });
    } else {
        // Render error pages
        res.status(err.statusCode || 500).json({
            title: 'Something went wrong',
            msg: err.message,
        });
    }
};

module.exports = { SendErrorDev }