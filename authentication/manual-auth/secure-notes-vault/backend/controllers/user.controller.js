export async function me(req, res) {
    res.status(200).json(req.user);
}