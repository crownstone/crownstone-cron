let hourMs = 3600*1000;

async function execute(task) {
  console.log(new Date().valueOf() + " ScheduledJob: Setting up execution of " +  task.id + "...");
  console.log(new Date().valueOf() + " ScheduledJob: Executing: " + task.id);
  try {
    await task.action()
    console.log(new Date().valueOf() + " ScheduledJob: Finished: "+ task.id);
  }
  catch (err) {
    console.error(new Date().valueOf() + " ScheduledJob: Failed: " + task.id);
    console.error(err);
    throw err;
  }
}


function shouldTaskBeExecuted(task, lastInvocation, forceExecute = false) {
  let everyNHours = task.everyNHours;

  let diff = new Date().valueOf() - lastInvocation;
  if (diff > everyNHours * hourMs || forceExecute) {
    console.log(new Date().valueOf() + " Task should be executed task: " + task.id, diff, everyNHours * hourMs, forceExecute);
    return true;
  }
  else {
    return false;
  }
}


// async function evaluate(task, lastInvocation, forceExecute = false) {
//   let everyNHours = task.everyNHours;
//
//   let diff = new Date().valueOf() - lastInvocation;
//   if (diff > everyNHours * hourMs || forceExecute) {
//     console.log(new Date().valueOf() + " Executing task: " + task.id);
//     await execute(task);
//     return true;
//   }
//   else {
//     console.log(new Date().valueOf() + " Skipping task: " + task.id);
//     return false;
//   }
// }




module.exports = {
  shouldTaskBeExecuted,
  execute
};
