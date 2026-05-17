

export async function errorHandler(err, req, res, next) {
    console.err(error);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: error.message
    });
}