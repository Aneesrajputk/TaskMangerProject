// const Task = require("../models/Task");


// // desc get all tasks(ADMIN :all , USER:only assigned Tasks);
// // routed GET/api/tasks
// // acess private


// // 1.	Read status from query string
// // 2.	Build dynamic filter object
// // 3.	Admin sees all tasks, user sees only assigned tasks
// // 4.	Populate user info in each task
// // 5.	Count how many checklist items are completed per task
// // 6.	Calculate total, pending, in-progress, and completed task counts
// // 7.	Return all data in a clean JSON structure
// const getTasks = async (req, res) => {
//     try {
//         const { status } = req.query;
//         let filter = {};
//         if (status) {
//             filter.status = status;
//         }

//         let tasks;
//         if (req.user.role == "admin") {
//             tasks = await Task.find(filter).populate(
//                 "assignedTo",
//                 "name email profileImageUrl"
//             );
//         } else {
//             tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(     // .populated finds the extra info of user
//                 "assignedTo",
//                 "name email profileImageUrl"
//             );
//         }

//         // Add completed todo checklist count to each task
//         tasks = await Promise.all(
//             tasks.map(async (task) => {
//                 const completedCount = task.todoChecklist.filter(
//                     (item) => item.completed
//                 ).length;
//                 return { ...task._doc, completedTodoCount: completedCount };
//             })
//         );


//         // status summmary Counts
//         //     To show a task summary for the user
//         //     Admin sees total tasks across all users.
//         //  Member sees only their own tasks.


//         const allTasks = await Task.countDocuments(
//             req.user.role === "admin" ? {} : { assignedTo: req.user._id }
//         );




//         const pendingTasks = await Task.countDocuments({
//             ...filter,
//             status: "Pending",
//             ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
//         });

//         const inProgressTasks = await Task.countDocuments({
//             ...filter,
//             status: "In progress",
//             ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
//         });

//         const completedTasks = await Task.countDocuments({
//             ...filter,
//             status: "Completed",
//             ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
//         });


//         res.json({
//             tasks,
//             statusSummary: {
//                 all: allTasks,
//                 pendingTasks,
//                 inProgressTasks,
//                 completedTasks,
//             },
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// };

// // desc get task by id
// // routes Get/api/tasks/:id;
// // access private route

// const getTasksById = async (req, res) => {

//     try {
//         const task = await Task.findById(req.params.id).populate(
//             "assignedTo",
//             "name email profileImageUrl"
//         );
//         if (!task) return res.status(404).json({
//             message: "Task not found"
//         });
//         res.json(task);
//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// }

// // desc create a new task (Admin only)
// // route POST/api/tasks
// // access private (ADMIN)
// const createTask = async (req, res) => {

//     try {
//         const { title, description, priority, dueDate, assignedTo, attachements, todoChecklist } = req.body;


//         if (!Array.isArray(assignedTo)) {
//             return res
//                 .status(400)
//                 .json({
//                     message: "AssignedTo must be an array of  user IDs"
//                 });
//         }
//         const task = await Task.create({
//             title,
//             description,
//             priority,
//             dueDate,
//             assignedTo,
//             createBy: req.user._id,
//             attachements,
//             todoChecklist
//         });
//         res.status(201).json({
//             message: "Task created Successfully", task
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// }
// // desc update task details (Admin only)
// // route PUT/api/tasks/:id
// // access private

// //***********************************************************************update task k liye ******************************************************
// // Get the task ID from URL.

// // Find that task in the database.

// // If not found → return 404.

// // If found → update fields if new data is given.

// // Validate the assignedTo field (must be an array).

// // Save the updated task.

// // Respond with success or error.
// const updateTask = async (req, res) => {

//     try {
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({
//             message: "Task Not Found"
//         });


//         task.title = req.body.title || task.title;
//         task.description = req.body.description || task.description;
//         task.title = req.body.title || task.title;
//         task.priority = req.body.priority || task.priority;
//         task.dueDate = req.body.dueDate || task.dueDate;
//         task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
//         task.attachments = req.body.attachments || task.attachments;


//         if (req.body.assignedTo) {
//             if (!Array.isArray(req.body.assignedTo)) {
//                 return res.status(400)
//                     .json({
//                         message: "assignedTo must be an array of user IDs"
//                     });

//             }
//             task.assignedTo = req.body.assignedTo;
//         }

//         const updatedTask = await task.save();

//         res.json({
//             message: "Task updated",
//             updatedTask
//         });


//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// }

// // desc delete a task (Admin only)
// // route DELETE/api/tasks/:is
// // access private (ADMIN)
// const deleteTask = async (req, res) => {

//     try {
//         // find the delete task from data base 
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({
//             message: "Task Not Found"
//         });

//         await task.deleteOne();
//         res.json({
//             message: "Task deleted Successfully"
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// }

// // desc Update  task status  (Admin only)
// // route Put /api/tasks/:id/status
// // access private 


// // ✅ Validates if the task exists.

// // ✅ Checks if the logged-in user is authorized (either assigned to the task or an admin).

// // ✅ Updates task status.

// // ✅ If status is "Completed", it:

// //     Marks all checklist items as completed.

// //     Sets progress to 100.

// // ✅ Saves the updated task and returns it in the response.
// const updateTaskStatus = async (req, res) => {


//     try {
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({
//             message: "Task not Found"
//         });

//         const isAssigned = task.assignedTo.some(
//             (userId) => userId.toString() === req.user._id.toString()
//         );

//         if (!isAssigned && req.user.role !== "admin") {
//             return res.status(403).json({
//                 message: "Not authorized"
//             });
//         }

//         //  Updates the task’s status from the request body.
//         //  If no status is sent, it keeps the old one.

//         task.status = req.body.status || task.status;

//         // If Status is "Completed":
//         // Marks all checklist items as completed.
//         // Sets task progress to 100%.

//         if (task.status === "Completed") {
//             task.todoChecklist.forEach((item) => (item.completed = true));
//             task.progress = 100;
//         }

//         await task.save();
//         res.json({
//             message: "Task status updated",
//             task
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// }

// // desc update task checklist (Admin only)
// // route Put/api/tasks/:is/todo
// // access private ]]



// //   This controller updates the todoChecklist of a task, recalculates progress based on completion, and updates the task’s overall status accordingly.**
// const updateTaskChecklist = async (req, res) => {

//     try {
//         const { todoChecklist } = req.body;
//         const task = await Task.findById(req.params.id);

//         if (!task) return res.status(404).json({
//             message: "Task not Found"
//         });


//         // Only the assigned user or an admin can update the checklist.

//         if (!task.assignedTo.includes(req.user._id)&& req.user.role !== "admin") {
//             return res.status(403).json({
//                 message: "Not authorized to update Checklist"
//             });
//         }
//        task.todoChecklist=todoChecklist;

//        //Auto-update progress base on checklist completation

//     //    (completedCount / totalItems) * 100: gives the percentage of completed items.
//     //    Math.round(...): rounds that percentage to the nearest whole number.
//     //    totalItems > 0 ? ... : 0: a ternary operator. 
//     //    If totalItems > 0, calculate percentage.
//     //    If there are no checklist items, set progress = 0.


//         const completedCount=task.todoChecklist.filter(
//             (item)=>item.completed
//         ).length;

//         const totalItems=task.todoChecklist.length;
//         task.progress=
//         totalItems >0?Math.round((completedCount/totalItems)*100):0;


//         //Auto-mark task as completed if all tems are checked 
//         if(task.progress===100){
//             task.status="Completed";
//         }else if(task.progress>0){
//             task.status="Completed";
//         }
//         else{
//             task.status="Pending"
//         }
//          await task.save();
         


//          const updatedTask=await Task.findById(req.params.id).populate(
//             "assignedTo",
//             "name email profileImageUrl"
//          );

//          res.json({
//             message:"Task checklist updated",task:updatedTask
//          });
//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// }

// // desc Dashboard Data (Admin only)
// // route POST/api/tasks/dashboard-data
// // access private 
// const getDashboardData = async (req, res) => {

//     try {
//         // fetch statistics 
//         const totalTasks= await Task.countDocuments();
//         const pendingTasks =await Task.countDocuments({status:"Pending"});
//         const completedTasks =await Task.countDocuments({status:"Completed"});
//         const overdueTasks =await Task.countDocuments({
//             status:{$ne:"Completed"},
//             dueDate:{$lt:new Date()},
//         });





//         // ensure are possibele statuses includes 
//    const taskStatuses =["Pending", "In Progress","Completed"];
//         const taskDistributionRaw=await Task.aggregate([
//             {
//                 $group:{
//                     _id:"$status",
//                     count:{$sum:1},
//                 },
//             },
//         ]);

//         const taskDistribution=taskStatuses.reduce((acc,status)=>{
//             const formattedKey=status.replace(/\s+/g,""); /// remove spaces for respnse ke 
//             acc[formattedKey]=
//             taskDistributionRaw.find((item)=>item._id===status)?.count||0;
//             return acc;
//         },{});

//         taskDistribution["All"]=totalTasks;



//         const taskPriorities =["Low", "Medium","High"];
//         const taskPriorityLevelRaw=await Task.aggregate([
//             {
//                 $group:{
//                     _id:"$priority",
//                     count:{$sum:1},
//                 },
//             },
//         ]);
//         const taskPriortyLevels= taskPriorities.reduce((acc,priority)=>{
//             acc[priority]=
//             taskPriorityLevelRaw.find((item)=>item._id===priority)?.count||0;
//             return acc;
//         },{});

//         //Fetch recent 10 tasks
//         const recentTasks=await Task.find()
//         .sort({created:-1})
//         .limit(10)
//         .select("title status priority dueDate createdAt");
//         res.status(200).json({
//             statistics:{
//                 totalTasks,
//                 pendingTasks,
//                 completedTasks,
//                 overdueTasks
//             },
//             charts:{
//                 taskDistribution,
//                 taskPriortyLevels,
//             },
//             recentTasks,
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// }


// // desc Dashboard Data(USER-specific)
// // route get/api/tasks/user-dashboard-data
// // access private 
// const getUserDashboardData = async (req, res) => {

//     try {

//         const userId=req.user._id;  // only fetch data for the logged in user 
        
//         // getch statisticsfor user-specific tasks

//         const totalTasks=await Task.countDocuments({assignedTo:userId});
//         const pendingTasks=await Task.countDocuments({assignedTo:userId,status:"Pending"});
//         const completedTasks=await Task.countDocuments({assignedTo:userId,status:"Completed"});
//         const overdueTasks=await Task.countDocuments({
//             assignedTo:userId,
//             status:{$ne:"Completed"},
//             dueDate:{$lt:new Date},
//         });

//      //Task distribution by status 
// const taskStatuses =["Pending", "In Progress","Completed"];
//         const taskDistributionRaw=await Task.aggregate([
//             { $match:{assignedTo:userId}},
//             {$group:{_id:"$status",count:{$sum:1}, }  },
//         ]);

//         const taskDistribution=taskStatuses.reduce((acc,status)=>{
//             const formattedKey=status.replace(/\s+/g,""); /// remove spaces for respnse ke 
//             acc[formattedKey]=
//             taskDistributionRaw.find((item)=>item._id===status)?.count||0;
//             return acc;
//         },{});


//         taskDistribution["All"]=totalTasks;
    
// // task distribution by priority

//         const taskPriorities =["Low", "Medium","High"];
//         const taskPriorityLevelRaw=await Task.aggregate([
//             {
//                 $group:{
//                     _id:"$priority",
//                     count:{$sum:1},
//                 },
//             },
//         ]);
//         const taskPriortyLevels= taskPriorities.reduce((acc,priority)=>{
//             acc[priority]=
//             taskPriorityLevelRaw.find((item)=>item._id===priority)?.count||0;
//             return acc;
//         },{});


//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// }


// module.exports = {
//     getTasks,
//     getTasksById,
//     createTask,
//     updateTask,
//     deleteTask,
//     updateTaskStatus,
//     updateTaskChecklist,
//     getDashboardData,
//     getUserDashboardData
// }; 

const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");
const { updateTaskChecklist } = require("./taskcontrollers");

// desc   Export all tasks as an excel file
// route   GET/api/reports/exports/tasks
// @acess Private (Admin)

// const exportTasksReport = async (req, res) => {
//   try {
//     const tasks=await Task.find().populate("assignedTo","name email");
//     const workbook=new excelJS.Workbook();
//     const worksheet=workbook.addWorksheet("Tasks Report");

// worksheet.columns=[
//     {header:"Task ID", key:"_id",width:25},
//     {header:"Title", key:"title",width:30},
//     {header:"Description", key:"description",width:50},
//     {header:"Priority", key:"priority",width:15},
//     {header:"Status", key:"status",width:20},
//     {header:"Due Date", key:"dueDate",width:20},
//     {header:"Assigned To", key:"assignedTo",width:30},
// ];
//    tasks.forEach((task)=>{
//     const assignedTo=task.assignedTo
//     .map((user)=>`${user.name} (${user.email})`)
//     .join(", ")
//     worksheet.addRow({
//         _id:task._id,
//         title:task.title,
//         description :task.description,
//         priority:task.priority,
//         status:task.status,
//         dueDate:task.dueDate.toISOString().split("T")[0],
//         assignedTo:assignedTo ||"Unassigned",
//     });
//    });
//    res.setHeader(
//    "Content-Type",
//    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

//    //"application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet"
// );
// res.setHeader(
//     "Content-Disposition",
//     'attachment; filename="task_reports.xlsx"'

//    // 'attachments:filename="task_reports.xlsx"'
// );
// return workbook.xlsx.write(res).then(()=>{
//     res.end();
// });

//   } catch (error) {
//     res.status(500).json({
//       message: "Error exporting ",
//     });
//   }
// };
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    tasks.forEach((task) => {
      let assignedTo = "Unassigned";

      if (Array.isArray(task.assignedTo) && task.assignedTo.length > 0) {
        assignedTo = task.assignedTo
          .map((user) => `${user.name} (${user.email})`)
          .join(", ");
      } else if (task.assignedTo) {
        // single user populated
        assignedTo = `${task.assignedTo.name} (${task.assignedTo.email})`;
      }

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate
          ? task.dueDate.toISOString().split("T")[0]
          : "N/A",
        assignedTo,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="task_reports.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error exporting",
      error: error.message,
    });
  }
};


// desc Export user-task report as an Excel file
// route -  GET /api/reports/export/user
// access private(Admin)

const exportUsersReport = async (req, res) => {
  try {
    const users=await User.find().select("name email _id").lean();
    const userTasks=await Task.find().populate(
        "assignedTo",
        "name email _id"
    );

    const userTasksMap={};
  users.forEach((user)=>{
     userTasksMap[user._id]={
        name:user.name,
        email:user.email,
        taskCount:0,
        pendingTasks:0,
        inProgressTasks:0,
        completedTasks:0,
     };
  });
 

  // userTasks.forEach((task)=>{
  //   if(task.assignedTo){
  //       task.assignedTo.forEach((assignedTo)=>{
  //           if(userTasksMap[assignedUser._id]){
  //               userTasksMap[assignedUser._id].taskCount+=1;
  //           if(task.status==="Pending"){
  //               userTasksMap[assignedUser._id].inProgressTask+=1;
  //           } else if(task.status==="In Progress"){
  //               userTasksMap[assignedUser._id].inProgressTask+=1;
  //           }
  //           else if(task.status==="Completed"){
  //               userTasksMap[assignedUser._id].inProgressTask+=1;
  //           }
  userTasks.forEach((task) => {
  if (task.assignedTo) {
    task.assignedTo.forEach((assignedTo) => {
      if (userTasksMap[assignedTo._id]) {
        userTasksMap[assignedTo._id].taskCount += 1;

        if (task.status === "Pending") {
          userTasksMap[assignedTo._id].pendingTasks += 1;
        } else if (task.status === "In Progress") {
          userTasksMap[assignedTo._id].inProgressTasks += 1;
        } else if (task.status === "Completed") {
          userTasksMap[assignedTo._id].completedTasks += 1 ;
        }
            }
        });
    }
  });

  const workbook=new excelJS.Workbook();
  const worksheet=workbook.addWorksheet("User Task Report");
     worksheet.columns=[
        {header:"User Name",key:"name",width:30},
        {header:"Email",key:"email",width:40},
        {header:"Total Assigned Tasks",key:"taskCount",width:20},
        {header:"Pending Tasks",key:"pendingTasks",width:20},
        {
            header:"In Progress Tasks",
            key:"inProgressTasks",
            width:20,
        },
        {
            header:"Completed Tasks",key :"completedTasks",width:20
        },

     ];

     Object.values(userTasksMap).forEach((user)=>{
        worksheet.addRow(user);
     });


     res.setHeader(
   "Content-Type",
   "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet"
);
res.setHeader(
    "Content-Disposition",
    'attachments:filename="task_reports.xlsx"'
);

 return workbook.xlsx.write(res).then(()=>{
    res.end();
 });
   
  } catch (error) {
    res.status(500).json({
      message: "Error exporting Tasks ",error:error.message
    });
  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport,
};