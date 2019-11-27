class experiment {
  constructor(id,name,desc,username,tasks) {
    this.id=id;
    this.ename = name;
    this.desc = desc;
    this.username=username;
    this.tasks=tasks;
    experiments.push(this);
  }
}
