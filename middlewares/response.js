const responseEnhancer = (req, res, next) => {
    res.sendSuccess = (code, message, data = {}) => {
        res.status(code || 200).json({
            success: true,
            message,
            data,
        });
    };
    next();
};

export default responseEnhancer;
