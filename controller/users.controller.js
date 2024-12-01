import Users from "../models/users.model.js";

export const getusers = async (req, res) => {
    try {
        const users = await Users.find({}, {
            name: 1,
            email: 1,
            regdNo: 1,
            phno: 1,
            dob: 1,
            gender: 1,
            branch: 1,
            sem: 1,
            block: 1
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const blockuser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.block = !user.block;
        const updatedUser = await user.save();
        res.status(200).json({
            success: true,
            message: `User ${user.block ? 'blocked' : 'unblocked'} successfully`,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const userdetails = async (req, res) => {
    try {
        const userid = req.params.id;
        const user = await Users.findById(userid, {
            name: 1,
            email: 1,
            regdNo: 1,
            dob: 1,
            gender: 1,
            phno: 1,
            branch: 1,
            sem: 1,
            block: 1
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(200).json([]);
        }

        const searchRegex = new RegExp(query, 'i');
        const users = await Users.find({
            $or: [
                { name: searchRegex },
                { regdNo: searchRegex }
            ]
        }, {
            name: 1,
            email: 1,
            regdNo: 1,
            dob: 1,
            gender: 1,
            phno: 1,
            branch: 1,
            sem: 1,
            block: 1
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
