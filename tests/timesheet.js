var tasks=require ("../lib/task.js").tasks({name:"test"},function (size) {
  console.log (size +" in todo");
console.log (tasks.actives);
tasks.add ("write doc");
});

