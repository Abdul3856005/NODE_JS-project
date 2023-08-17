import ErrorHandler from "../middlewares/error.js";
import Task from "../models/task.js";

export const newTask = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        await Task.create({
            title,
            description,
            user: req.user,
        });

        res.status(201).json({
            success: true,
            message: "Task Added Successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getAllTask = async (req, res, next) => {
try {
    const userid = req.user._id;
    const tasks = await Task.find({ user: userid });

    res.status(200).json({
        success: true,
        tasks
    });
} catch (error) {
    next(error);
}
};

export const updateTask = async (req, res, next) => {
    const { id } = req.params;

    if (!id || id.length !== 24) {
        return res.status(400).json({
            success: false,
            message: "Invalid id format"
        });
    }

    try {
        const task = await Task.findById(id);

        if (!task) return next(new ErrorHandler("Invalid ID", 404));

        task.isCompleted = !task.isCompleted;
        await task.save();

        res.status(200).json({
            success: true,
            message: "Task Updated"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the task"
        });
    }
};

export const deleteTask = async (req, res, next) => {
   try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
        return res.status(400).json({
            success: false,
            message: "Invalid id format"
        });
    }
    const task = await Task.findById(id);

    if (!task) return next(new ErrorHandler("Task not found", 404));

    await task.deleteOne();

    res.status(200).json({
        success: true,
        message: "Task Deleted"
    });
   } catch (error) {
            next(error);
   }
};
