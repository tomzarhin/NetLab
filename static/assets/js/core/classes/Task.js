class Task {
  constructor(task_id,name,desc,dataset,datasetcols,datasetToBayes) {
    this.task_id=task_id;
    this.taskName = name;
    this.taskDescription = desc;
    this.dataset=dataset;
    this.datasetcols=datasetcols;
    this.datasetToBayes=datasetToBayes;
  }
}